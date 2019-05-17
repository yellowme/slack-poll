const emojis = require('./emoji.json');

const pollMode = {
  SINGLE: 's',
  MULTIPLE: 'm',
};

// Fallback emoji base
const fallbackEmojis = [
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
  emojis,
  fallbackEmojis,
  pollMode,
};
