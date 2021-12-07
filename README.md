# Web data extractor (backend only)
The purpose of this application is in a constant product price monitoring on the legal basis, with the following email notification in case of the price growth/decline, product name changing or assortment update. Web data extractor has been built with use of the following technologies: JavaScript, Node.js, Express.js, Puppeteer.  

### How to clone and deploy this app on Heroku using Github:
    
1.	Clone this repository to your project folder;
2.	Before deploying an app make sure that that you're using '--no-sandbox' mode when launching Puppeteer. This can be done by passing it as an argument to your '.launch()' call: `puppeteer.launch({ args: ['--no-sandbox'] });`;
3.	Login or create new account on Heroku. Then create new app, name it, and choose your location;
4.	Install the Heroku CLI (if you haven’t before);
5.	Add the ‘heroku remote’ for existing repositories: `$ heroku git:remote -a heroku-puppeteer-app`;
6.	Commit your code to the repository and deploy it to Heroku using Git.
        ```
        $ git add .
        $ git commit -am "Heroku"
        $ git push heroku master
        ```
7.	Wait until the end of the deployment
8.	To output logs of your app – open new terminal window and use: ‘$ heroku logs --tail -a heroku-puppeteer-app’
9.	Add the following buildpack ONLY after you you’ve made an initial commit: https://github.com/jontewks/puppeteer-heroku-buildpack. If you install mentioned buildpack before an initial commit, after deployment your app you might not get any output in your console and app not going to work.
a.	To install buildpack use following command ‘$ heroku buildpacks:add jontewks/puppeteer -a heroku-puppeteer-app’
10.	After adding buildpack make small changes in your app, so you can push it again to Heroku using the same following commands:
a.	$ git add .
b.	$ git commit -am "Heroku"
c.	$ git push heroku master
11.	 After deployment you can check if app is working and giving you logs by using previously mentioned command: ‘$ heroku logs --tail -a heroku-puppeteer-app’

