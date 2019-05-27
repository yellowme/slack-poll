# SlackPoll

Slack bot that helps users to do polling and allows users.

![SlackPoll](/static/sample.png)

## Usage

```
/poll "Question" "Option 1" "Option 2" -- encapsulate each individual option in double quotes
```

## Instalation

To integrate into your Slack workspace, you will need to create a [Slack App](https://api.slack.com/apps) and configure

- Interactive Components > Interactivity > Request URL (for the /hook Endpoint)
- Slash Commands (for the /poll Endpoint)
- OAuth & Permissions > Scopes > Add permissions [`chat:write:bot`, `commands`, `reactions:write`]

Initialize `.env` file with

- `DATABASE_URL` (if SQLite ignore `DATABASE_URL`)
- `SLACK_VERIFICATION_TOKEN`, `SLACK_ACCESS_TOKEN` from your SlackApp
- (Optional) You can define the poll display name in slack via `SLACK_APP_DISPLAY_NAME` _(default: <span style="color:#ffd100">#ffd100</span>)_
- (Optional) You can define the poll side color from the message via `SLACK_MESSAGE_BAR_COLOR` _(default: Yellow Poll)_

```
cp .env.example .env
npm start
```

## Development

Generating Migrations

```sh
./node_modules/.bin/sequelize migration:generate --name <migration_name>
```

Running daemon

```sh
npm run dev
```
