const config = require('./config')
const Sequelize = require('sequelize')

const db = config.DATABASE_URL
  ? new Sequelize(config.DATABASE_URL)
  : new Sequelize('yellowpoll', null, null, {
    dialect: 'sqlite',
    storage: './yellowpoll.sqlite'
  })

const PollModel = db.define('polls', {
  text: { type: Sequelize.STRING },
  titleTs: { type: Sequelize.STRING },
  optionsTs: { type: Sequelize.STRING },
  buttonsTs: { type: Sequelize.STRING },
  buttons2Ts: { type: Sequelize.STRING },
  buttonDeleteTs: { type: Sequelize.STRING }
}, {
  timestamps: true
})

const PollAnswerModel = db.define('poll_answers', {
  answer: { type: Sequelize.STRING },
  userId: { type: Sequelize.STRING },
  username: { type: Sequelize.STRING }
}, {
  timestamps: true
})

db.sync()

PollAnswerModel.belongsTo(PollModel)

const Poll = db.models.polls
const PollAnswer = db.models.poll_answers

module.exports = { Poll, PollAnswer }