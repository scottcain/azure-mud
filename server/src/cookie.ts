import { User } from './user'
import { Context } from '@azure/functions'

const fortuneList = [
    'Always be aware of the phase of the moon!',
    'Amulets of Yendor are hard to make.  Even for a wand of wishing.',
    'Be careful!  The Wizard may plan an ambush!',
    'Digging up a grave could be a bad idea…',
    'Eat your carrots.  They\'re good for your eyes.',
    'Elbereth has quite a reputation around these parts.',
    'For a good time engrave "Elbereth"',
    'I smell a maze of twisty little passages.',
    'I\'m watching you.  -- The Wizard of Yendor',
    'Not all boots were made for walking.',
    'Someone once said that what goes up < might come down >.',
    'The magic marker is mightier than the sword.',
    'There is no harm in praising a large dog.',
    'They say that Vlad lives!!! ... in the Unconferencing Dungeon.',
    'They say that if you start at the bottom the only place to go is up.',
    'They say that you are what you eat.',
    'Two wrongs don\'t make a right, but three lefts do.',
    'Why do you suppose they call them MAGIC markers?',
    'You may discover a menagerie inside a potion bottle.',
    'The art of mimicry may be learned from the bartender, if you\'re clever.',
    'You\'re going into the morgue at midnight???',
    'What could be haunting the foyer?',
    'You might be a Proc Gen Wizard if you believe procedural generation is a set of rules to be studied and mastered.',
    'You might be a Proc Gen Sorcerer if you believe procedural generation is a medium to examine your intuitions.',
    'You might be a Proc Gen Bard if you believe in embracing the strangeness of procedurally generated content.',
    'You might be a Proc Gen Artificer if your passion is in building tools and interfaces for others to explore procedural generation.',
    'You might be a Proc Gen Cleric if rituals are a part of your procedural generation work.',
    'You might be a Proc Gen Warlock if you have argued with your procedural generator.',
    'You might be a Proc Gen Druid if you are proud of your procedural generator\'s growth.',
    'You might be a Proc Gen Ranger if you can guide others on their paths to procedural generation joy.',
    'You might be a Proc Gen Paladin if you are an activist for true understanding of the tools of procedural generation.',
    'They say that fortune cookies are food for thought.',
    'Impress your partners and friends! Bring them an orb!',
    'The real ascension is the friends you make along the way.',
    'Losing is ❗fun❗',
    'Never turn your back on an elephant.',
    'You found kitten! Good job, robot!',
    '<a href=https://archiveofourown.org/works/5458259 target="_blank">Just because it says READ ME doesn\'t mean you should.</a>',
    'They say the greatest conduct you can follow is <a href=https://roguelike.club/code.html target="_blank">the Code</a>.',
    '<a href=https://youtu.be/tmrYfnMrifw?list=PLi7jNGNQhwdhKzh2I7NNJTxHjQEVejLxm target="_blank">Check out this year\'s preview event!</a>',
    '<a href=http://www.roguelikeradio.com/2020/09/episode-156-roguelike-celebration-event.html target="_blank">Listen to some of the organizers speak to Roguelike Radio!</a>',
    '<a href=https://www.youtube.com/playlist?list=PLi7jNGNQhwdg9M2K3s6W73E0BlWF0qrLY target="_blank">Check out the videos from 2019!</a>',
    '<a href=https://www.youtube.com/watch?v=jviNpRGuCIU&list=PLi7jNGNQhwdisqRtuvX8X8Q2F0TEUgQ5V target="_blank">Check out the videos from 2018!</a>',
    '<a href=https://www.youtube.com/watch?v=wwc7pZqs9UA&list=PLi7jNGNQhwdhiZcp2g4yU7xpXmOqS9VBl target="_blank">Check out the videos from 2017!</a>',
    '<a href=https://www.youtube.com/channel/UCsCqXksJuAkfZRtnW5Pq1mw/videos target="_blank">Check out the videos from 2016!</a>',
    'Past dance mixes by <a href=https://soundcloud.com/funkip/tracks target="_blank">Funkip</a>!',
    'Thank you once again to <a href=https://whitecoatcaptioning.com/ target="_blank">White Coat Captioning</a>!',
    'Buy a <a href=https://roguelike-celebration.myshopify.com/ target="_blank">t-shirt</a>, designed by <a href=http://www.fourbitfriday.com/ target="_blank">Tyriq Plummer</a>!',
    'Crush monsters, THEN get loots',
    'Spike pits are best avoided and bad for your health',
    'Always put a bag of holding into another bag of holding. I mean, what could possibly happen? <u>Nothing bad.</u>',
    'Unlike "Snake" you can always go back. Don\'t trust your keyboard\'s auto repeat.',
    'Metaprogression isn\'t permadeath',
    'Always wear the golden dragon armor on D:1',
    'Kick the dust from the stairs - what could go wrong?',
    'You don\'t <u>ever</u> drink unidentified potions... unless you have to.',
    'All-bards may not be the most powerful party composition, but it <u>is</u> the most fun!',
    'Death is just a new beginning!',
    'Metaprogression in FUN!',
    'In terms of procgen practitioner D&D classes, we can contain multitudes.',
    'Swallow sludge to transform yourself',
    'Procedural cat generation is money on the table.',
    'Add features to solve balance issues.',
    'Live as you play: Randomly',
    'The corridor is your friend.',
    'You\'ll be happier if you finish making it!',
    'Every monster you date is a monster you don\'t have to slay.'
  ]

export function cookie (user: User, messageId: string, context: Context) {
    // Inspecting a fortune cookie
    context.bindings.signalRMessages = [
        {
        groupName: user.roomId,
        target: 'dance',
        arguments: [messageId, user.id, ('opens a fortune cookie that reads: ' + fortuneList[Math.floor(Math.random() * fortuneList.length)])]
        }
    ]
    return
}
