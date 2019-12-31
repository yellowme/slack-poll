# Anatomy

The application follows the Uncle Bob "[Clean Architecture](https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html)" principles and project structure

### Project anatomy

Application Structure
```
app
├── config.js
├── core -> Domain Layer
│   ├── entities
│   └── services
├── emoji.json
├── emojis.js
├── index.js
├── infrastructure
│   ├── express -> Regular Express application
│   │   ├── controllers
│   │   ├── helpers
│   │   ├── middlewares
│   │   ├── presenters -> Slack message presenter
│   │   ├── repositories
│   │   ├── routes
│   │   ├── serializers
│   │   └── server.js
│   ├── sequelize -> Database
│   │   ├── migrations
│   │   ├── models
│   │   └── sequelize.js
│   └── slackWebAPI.js -> Slack SDK
└── utils.js
```

Test Folder
```
test
├── application.js -> Test Application
├── config.js
├── factories
├── presenters -> Mock implementations
├── repositories -> Mock implementations
├── sequelize -> Mock implementations
└── slack -> Mock implementations
```

### Flow of Control

![Schema of create poll](/static/create_poll.svg)
![Schema of poll response](/static/create_poll_response.svg)