const emojiData = require('./emoji.json');

// Fallback emoji base
const emojis = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'keycap_ten',
];

module.exports = {
  fullEmoji: emojiData.map(e => e.short_name),
  limitedEmoji: emojis,
  pollMode: {
    SINGLE: 's',
    MULTIPLE: 'm',
  },
};
