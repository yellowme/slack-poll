# SlackPoll
Slack bot that helps users to do polling and allows users.

![SlackPoll](/static/sample.png)

## Usage

```
/poll "Question" "Option 1" "Option 2" -- encapsulate each individual option in double quotes
```

## Instalation

Initialize `.env` file with `DATABASE_URL` (if SQLite ignore `DATABASE_URL`)

```
cp .env.example .env
npm start
```

