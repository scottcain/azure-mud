import { Room, roomData } from './rooms'
import DB from './redis'

// TODO: pronouns (and realName?) shouldn't be optional
// but leaving like this til they actually exist in the DB.

// The bare minimum amount of user information we need to send
// about every user to every other user on login
export interface MinimalUser {
  id: string;
  username: string;
  pronouns?: string;
  isMod?: boolean;
  isBanned?: boolean;
  // From https://www.w3schools.com/colors/colors_names.asp
  nameColor?: string;
  item?: string
  polymorph?: string;
}

// A user profile. Users may fetch this about other users.
export interface PublicUser extends MinimalUser {
  realName?: string;
  pronouns?: string;
  description?: string;
  askMeAbout?: string;
  twitterHandle?: string;
  url?: string;
}

// A private representation of the current user
// contains info we may not want to publicly expose.
export interface User extends PublicUser {
  roomId: string;
  lastShouted?: Date;

  // Right now, fetching a room given a roomId doesn't hit redis.
  // If that changes, we might want to make this lazy
  room: Room;
}

export async function isMod (userId: string) {
  const modList = await DB.modList()
  return modList.includes(userId)
}

export async function updateModStatus (userId: string) {
  const userIsMod = await isMod(userId)

  const profile = await DB.getPublicUser(userId)
  const minimalProfile = await DB.getMinimalProfileForUser(userId)

  if (!profile || !minimalProfile) {
    console.log('ERROR: Could not find user ', userId)
    return
  }

  await DB.setUserProfile(userId, { ...profile, isMod: userIsMod })
  await DB.setMinimalProfileForUser(userId, { ...minimalProfile, isMod: userIsMod })
}

export async function getUserIdForOnlineUsername (username: string) {
  // This currently only checks active users, by intention
  // If we used all users, that would mistakenly let you e.g. send messages to offline users
  // (who would never get the message)
  const userMap = await activeUserMap()
  const user = Object.values(userMap).find((u) => u.username === username)
  if (user) {
    return user.id
  }
}

export async function getUserIdForUsername (username: string) {
  const userMap = await DB.minimalProfileUserMap()
  const user = Object.values(userMap).find((u) => u.username === username)
  if (user) {
    return user.id
  }
}

export async function updateUserProfile (userId: string, data: Partial<User>) {
  // Copy/pasted from ProfileEditView.tsx in the client
  function crushSpaces (s: string): string {
    if (s.includes(' ')) {
      console.log('spaces detected ' + s)
      while (s.includes(' ')) {
        s = s.replace(' ', '-')
      }
      console.log('spaces crushed: ' + s)
    }
    return s
  }

  const profile: Partial<User> = (await DB.getPublicUser(userId)) || {}
  let username = profile.username
  if (data.username) { username = crushSpaces(data.username) }

  // If someone's trying to set a new username, validate it
  if (data.username && profile.username !== username) {
    const userIdForNewUsername = await getUserIdForUsername(username)
    if (userIdForNewUsername && userIdForNewUsername !== userId) {
      throw new Error(`Username '${username}' is already taken`)
    }
  }

  const newProfile: User = {
    ...profile,
    ...data,
    id: userId,
    username,
    isMod: profile.isMod
  } as User // TODO: Could use real validation here?

  await DB.setMinimalProfileForUser(userId, minimizeUser(newProfile))

  await DB.setUserProfile(userId, newProfile)
  return newProfile
}

export async function updateUserProfileColor (userId: string, color: string): Promise<MinimalUser> {
  const profile: User = await DB.getPublicUser(userId)
  profile.nameColor = color
  await DB.setUserProfile(userId, profile)

  const minimalProfile: MinimalUser = await DB.getMinimalProfileForUser(userId)
  minimalProfile.nameColor = color
  await DB.setMinimalProfileForUser(userId, minimalProfile)

  return minimalProfile
}

export async function getFullUser (userId: string): Promise<User | undefined> {
  const profile = await DB.getPublicUser(userId)
  if (!profile) return

  let roomId = await DB.currentRoomForUser(userId)
  if (!roomId) {
    roomId = 'entryway'
    await DB.setCurrentRoomForUser(userId, roomId)
  }

  const lastShouted = await DB.lastShoutedForUser(userId)

  return {
    ...profile,
    id: userId,
    roomId,
    room: roomData[roomId],
    lastShouted
  }
}

export function minimizeUser (user: User | PublicUser): MinimalUser {
  const minimalUser: MinimalUser = {
    id: user.id,
    username: user.username,
    isBanned: user.isBanned,
    nameColor: user.nameColor,
    item: user.item,
    polymorph: user.polymorph,
    isMod: user.isMod
  }

  return minimalUser
}

export async function activeUserMap (): Promise<{
  [userId: string]: MinimalUser;
}> {
  const userIds = await DB.getActiveUsers()
  const names: MinimalUser[] = await Promise.all(
    userIds.map(async (u) => await DB.getMinimalProfileForUser(u))
  )

  const map: { [userId: string]: MinimalUser } = {}
  for (let i = 0; i < userIds.length; i++) {
    map[userIds[i]] = names[i]
  }

  console.log(userIds, names, map)

  return map
}
