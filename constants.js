const emojis = require('./emoji.json');

const pollMode = {
  SINGLE: 's',
  MULTIPLE: 'm',
};

// Fallback emoji base
const fallbackEmojis = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

module.exports = {
  emojis,
  fallbackEmojis,
  pollMode,
};
