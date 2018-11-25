# SlackPoll
Slack bot that helps users to do polling and allows users to vote through emoji reactions.

## Usage

```
/poll "Question" "Option 1" "Option 2" -- encapsulate each individual option in double quotes
```

## Instalation

### With SQLite

Initialize `yellowpoll.sqlite` and `.env` files

```
cp .env.example .env
cp yellowpoll.sqlite.example yellowpoll.sqlite
npm start
```

### With PostgreSQL, MySQL, MariaDB, etc

Initialize `yellowpoll.sqlite` and `.env` files

```
cp .env.example .env
npm start
```

