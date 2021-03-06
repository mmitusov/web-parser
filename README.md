# Web data extractor (backend only)
### Description
The purpose of this application is in a constant product price monitoring on the legal basis, with the following email notification in case of the price growth/decline, product name changing or assortment update. Web data extractor has been built with use of the following technologies: JavaScript, Node.js, Express.js, Puppeteer and Node-cron.  

### How to clone and deploy Puppeteer app on Heroku using Github without errors
    
1.	Clone this repository to your project folder;
2.	Before deploying an app make sure that that you're using '--no-sandbox' mode when launching Puppeteer. This can be done by passing it as an argument to your '.launch()' call: `puppeteer.launch({ args: ['--no-sandbox'] });`;
3.	Login or create new account on Heroku. Then create new app, name it, and choose your location;
4.	Install the Heroku CLI (if you haven’t before);
5.	Add the ‘heroku remote’ for existing repositories: `heroku git:remote -a heroku-puppeteer-app`;
6.	Commit your code to the repository and deploy it to Heroku using Git:
```
git add .
git commit -am "Heroku"
git push heroku master
```
7.	Wait until the end of the deployment;
8.	To output logs of your app – open new terminal window and use: `heroku logs --tail -a heroku-puppeteer-app`
9.	Add the following buildpack ONLY after you you’ve made an initial commit: https://github.com/jontewks/puppeteer-heroku-buildpack. If you install mentioned buildpack before an initial commit, after deployment your app you might not get any output in your console and app not going to work. To install buildpack use following command: `heroku buildpacks:add jontewks/puppeteer -a heroku-puppeteer-app`
10.	After adding buildpack make small changes in your app, so you can push it again to Heroku using the same following commands:
```
git add .
git commit -am "Heroku"
git push heroku master
```
11.	 After deployment you can check if app is working and giving you logs by using previously mentioned command: `heroku logs --tail -a heroku-puppeteer-app`
12.	 Enjoy!

### Preventing your Heroku app from sleeping
If you are on a free tier on Heroku your app sleeps if it is not active for more than 30 minutes. To avoid that you can do one of the following: 
1. Create a JavaScript function that pings your app every 5 minutes. And place it is any file that’s executed in your app. Example of the function is below.
```
var http = require("http");
setInterval(function() {
    http.get("http://<your app name>.herokuapp.com");
}, 300000); // every 5 minutes (300000)
```
2. Or use [Kaffeine Shots](https://kaffeine.herokuapp.com) app. It basically pings your app every 30 minutes once and doesn't make it sleep except for the minimum 6 hours which is mandatory. But you can turn this option off.

**P.S. You can view the amount of free dyno hours remaining by using the CLI. You can do this by running heroku ps on one of your free apps: `heroku ps -a <app name>`**

If this tutorial was helpful for you - leaving the Star for this repository would be appreciated.