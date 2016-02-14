# SlackPoll
Slack bot that helps users to do polling and allows users to vote through emoji reactions.

##Usage
`/poll [Question] [Option 1] [Option 2] -- encapsulate each individual option in square brackets`

##Start a Poll
An example of asking the team what you should do for lunch could be like this.  
`/poll Who wants to go for lunch? [yes] [no]`  
![Alt text](https://github.com/Peh-QinCheng/SlackPoll/blob/master/screenshots/example.png)  
Members of the chat can then click on the emoji reactions to vote in the poll.

##Installation instructions
This app is hosted on Heroku. For those who have not used heroku before, please download the Heroku Toolbelt [here](https://toolbelt.heroku.com/), and follow the instructions on getting started.  

In your terminal, within the repository, run the following Heroku commands.  

`heroku create`  

This will create a new heroku app (note you can only have a max of 5 heroku apps on the free plan). Git remotes are references to remote repositories and this command will also create a git remote you can reference as ‘heroku’ on the command line.

```
git add  
git commit -m "my commit message"
```
These are git commands for that’ll help track your changes to the app. They will commit your changes to your local directory, in preparation for deploying your app to Heroku.

`git push heroku master`  

This will actually push your app to Heroku.  

Once done, add a slash command app integration into your slack group. For the url, use:  
`your-heroku-url/hello`

For further clarifications, you can follow the tutorial which I followed [here](http://blog.npmjs.org/post/128237577345/how-to-build-a-slackbot-deploy-an-app-to-heroku).

