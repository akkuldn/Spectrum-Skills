/* Emotion data used by EmotionRecognition and MoodTracker */

export const EMOTIONS = [
  { id: 'happy',     label: 'Happy',     emoji: '😄', color: '#F5D78E', bg: 'bg-yellow-100',  description: 'Feeling joyful and good' },
  { id: 'sad',       label: 'Sad',       emoji: '😢', color: '#7BB3D0', bg: 'bg-blue-100',    description: 'Feeling unhappy or down' },
  { id: 'angry',     label: 'Angry',     emoji: '😠', color: '#E89090', bg: 'bg-red-100',     description: 'Feeling mad or frustrated' },
  { id: 'scared',    label: 'Scared',    emoji: '😨', color: '#D4A5C7', bg: 'bg-purple-100',  description: 'Feeling afraid or worried' },
  { id: 'surprised', label: 'Surprised', emoji: '😮', color: '#F0A882', bg: 'bg-orange-100',  description: 'Feeling shocked or amazed' },
  { id: 'calm',      label: 'Calm',      emoji: '😌', color: '#86C5A3', bg: 'bg-green-100',   description: 'Feeling peaceful and relaxed' },
  { id: 'excited',   label: 'Excited',   emoji: '🤩', color: '#F0A882', bg: 'bg-amber-100',   description: 'Feeling very enthusiastic' },
  { id: 'confused',  label: 'Confused',  emoji: '😕', color: '#72B5B0', bg: 'bg-teal-100',    description: 'Feeling unsure or puzzled' },
  { id: 'bored',     label: 'Bored',     emoji: '😑', color: '#94A3B8', bg: 'bg-slate-100',   description: 'Feeling uninterested' },
  { id: 'proud',     label: 'Proud',     emoji: '🥹', color: '#9B89C4', bg: 'bg-violet-100',  description: 'Feeling good about yourself' },
  { id: 'loved',     label: 'Loved',     emoji: '🥰', color: '#D4A5C7', bg: 'bg-pink-100',    description: 'Feeling cared for and safe' },
  { id: 'tired',     label: 'Tired',     emoji: '😴', color: '#A5B4FC', bg: 'bg-indigo-100',  description: 'Feeling sleepy or low energy' },
  { id: 'silly',     label: 'Silly',     emoji: '🤪', color: '#F5D78E', bg: 'bg-amber-100',   description: 'Feeling playful and goofy' },
  { id: 'nervous',   label: 'Nervous',   emoji: '😬', color: '#86C5A3', bg: 'bg-emerald-100', description: 'Feeling worried about something' },
  { id: 'frustrated',label: 'Frustrated',emoji: '😤', color: '#F0A882', bg: 'bg-orange-100',  description: 'Feeling blocked or annoyed' },
]

/* Simplified set for younger children (4–7) */
export const SIMPLE_EMOTIONS = [
  { id: 'happy',     label: 'Happy',     emoji: '😄', color: '#F5D78E' },
  { id: 'sad',       label: 'Sad',       emoji: '😢', color: '#7BB3D0' },
  { id: 'angry',     label: 'Angry',     emoji: '😠', color: '#E89090' },
  { id: 'scared',    label: 'Scared',    emoji: '😨', color: '#D4A5C7' },
  { id: 'calm',      label: 'Calm',      emoji: '😌', color: '#86C5A3' },
  { id: 'excited',   label: 'Excited',   emoji: '🤩', color: '#F0A882' },
]

/* Emotion recognition activity questions */
export const EMOTION_QUESTIONS = [
  {
    id: 'q1',
    difficulty: 'easy',
    situation: 'Alex opens a birthday present and it\'s the toy they wanted most!',
    correctEmotion: 'happy',
    options: ['happy', 'sad', 'angry', 'scared'],
    hint: 'Think about how YOU feel when you get something special.',
  },
  {
    id: 'q2',
    difficulty: 'easy',
    situation: 'Sam drops their ice cream cone on the ground.',
    correctEmotion: 'sad',
    options: ['happy', 'sad', 'excited', 'proud'],
    hint: 'How would you feel if something nice was ruined?',
  },
  {
    id: 'q3',
    difficulty: 'easy',
    situation: 'Jamie hears a very loud, sudden noise behind them.',
    correctEmotion: 'scared',
    options: ['happy', 'bored', 'scared', 'calm'],
    hint: 'Loud surprises can make our hearts beat fast.',
  },
  {
    id: 'q4',
    difficulty: 'easy',
    situation: 'Max has been waiting for 30 minutes and the bus still hasn\'t come.',
    correctEmotion: 'frustrated',
    options: ['excited', 'frustrated', 'proud', 'loved'],
    hint: 'Waiting for a long time can feel very uncomfortable.',
  },
  {
    id: 'q5',
    difficulty: 'medium',
    situation: 'Taylor finds out their best friend told a secret they shared privately.',
    correctEmotion: 'sad',
    options: ['happy', 'sad', 'excited', 'proud'],
    hint: 'Think about trust and what happens when it is broken.',
  },
  {
    id: 'q6',
    difficulty: 'medium',
    situation: 'Charlie finished building the tallest LEGO tower in the whole class!',
    correctEmotion: 'proud',
    options: ['sad', 'scared', 'proud', 'bored'],
    hint: 'This is the feeling you get when you work hard and succeed.',
  },
  {
    id: 'q7',
    difficulty: 'medium',
    situation: 'Riley doesn\'t understand the maths problem no matter how many times they try.',
    correctEmotion: 'confused',
    options: ['happy', 'confused', 'excited', 'tired'],
    hint: 'This feeling often happens when something doesn\'t make sense.',
  },
  {
    id: 'q8',
    difficulty: 'medium',
    situation: 'Jordan is about to give a speech in front of the whole school.',
    correctEmotion: 'nervous',
    options: ['calm', 'nervous', 'silly', 'loved'],
    hint: 'This feeling often comes before something big and important.',
  },
  {
    id: 'q9',
    difficulty: 'hard',
    situation: 'Morgan won a competition but their friend came last and looks very upset.',
    correctEmotion: 'excited',
    options: ['excited', 'guilty', 'proud', 'calm'],
    hint: 'Morgan feels happy but also worried about their friend\'s feelings.',
  },
  {
    id: 'q10',
    difficulty: 'hard',
    situation: 'Casey has been doing the same activity for two hours with no break.',
    correctEmotion: 'bored',
    options: ['excited', 'proud', 'bored', 'surprised'],
    hint: 'Too much of the same thing can make time feel very slow.',
  },
]

/* Coping strategies for different emotions */
export const COPING_STRATEGIES = {
  angry: [
    { title: 'Take 5 Breaths', emoji: '🌬️', description: 'Breathe in slowly for 4 counts, then out for 4 counts. Do this 5 times.' },
    { title: 'Squeeze & Release', emoji: '✊', description: 'Make a tight fist, hold for 5 seconds, then slowly open your hand.' },
    { title: 'Walk Away', emoji: '🚶', description: 'Step away from the situation for a few minutes to cool down.' },
    { title: 'Draw Your Feelings', emoji: '🎨', description: 'Draw or scribble on paper to let your feelings out safely.' },
  ],
  sad: [
    { title: 'Comfort Object', emoji: '🧸', description: 'Hold something soft and comforting that makes you feel safe.' },
    { title: 'Talk About It', emoji: '💬', description: 'Find a trusted adult or friend to share how you\'re feeling.' },
    { title: 'Gentle Movement', emoji: '🌊', description: 'Slowly rock back and forth or go for a gentle walk.' },
    { title: 'Favorite Memory', emoji: '🌟', description: 'Close your eyes and think of a really happy memory.' },
  ],
  scared: [
    { title: 'Safe Place', emoji: '🏠', description: 'Find a quiet, safe space where you feel protected.' },
    { title: '5-4-3-2-1', emoji: '👋', description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.' },
    { title: 'Box Breathing', emoji: '📦', description: 'Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat.' },
    { title: 'Hug Yourself', emoji: '🤗', description: 'Wrap your arms around yourself and give yourself a warm hug.' },
  ],
  frustrated: [
    { title: 'Take a Break', emoji: '⏸️', description: 'Stop what you\'re doing and do something different for 5 minutes.' },
    { title: 'Bounce It Out', emoji: '⚽', description: 'Bounce a ball or do some jumping jacks to release energy.' },
    { title: 'Ask for Help', emoji: '🙋', description: 'It\'s okay to ask someone for help when things are hard.' },
    { title: 'Positive Self-Talk', emoji: '💪', description: 'Say to yourself: "I can do this. I just need to try differently."' },
  ],
  calm: [
    { title: 'Mindful Breathing', emoji: '🌸', description: 'Enjoy your calm feeling with some gentle, slow breaths.' },
    { title: 'Gratitude', emoji: '🙏', description: 'Think of 3 things you are thankful for right now.' },
    { title: 'Relax Your Body', emoji: '😌', description: 'Starting from your feet, slowly relax each part of your body upward.' },
  ],
}
