# SlackPoll

Slack bot that helps users to do polling and allows users.

![SlackPoll](/static/sample.png)

## Usage

```
Basic poll -- encapsulate each individual option in double quotes
/poll "Question" "Option 1" "Option 2"

Multi-Option poll -- add `-m` flag at the end
/poll "Question" "Option 1" "Option 2" -m
```

## Instalation

To integrate into your Slack workspace, you will need to create a [Slack App](https://api.slack.com/apps) and configure

- Interactive Components > Interactivity > Request URL (for the /hook Endpoint)
- Slash Commands (for the /poll Endpoint)
- OAuth & Permissions > Scopes > Add permissions [`chat:write:bot`, `commands`, `reactions:write`]

Initialize `.env` file with

- `DATABASE_URL` (if SQLite ignore `DATABASE_URL`)
- `SLACK_VERIFICATION_TOKEN` from Basic Information > App Credentials > Verification Token
- `SLACK_ACCESS_TOKEN` from OAuth & Permissions > OAuth Tokens & Redirect URLs > Tokens for Your Workspace > OAuth Access Token
- (Optional) You can define the poll display name in slack via `SLACK_MESSAGE_BAR_COLOR` _(default: <span style="color:#ffd100">#ffd100</span>)_
- (Optional) You can define the poll side color from the message via `SLACK_APP_DISPLAY_NAME` _(default: Yellow Poll)_
- (Optional) You can use `icon_emoji` list as a comma separed list with
  `SLACK_MESSAGE_ICON_EMOJIS` env var to change the slack bot profile image, if you define more than one it will pick one randomly. iex: `one,two,three`. _(default: :bar_chart:)_

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
