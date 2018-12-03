# Sample of NodeJS

## Libraries are used in this sample
1. https://expressjs.com web application

2. https://pugjs.org/ view engine

## Code Flow
1. [server/data folder] Store data in local files.
2. [server/services folder] Service Layer is used to manipulate data.
3. [server/routes folder] Routers modules which will call Service Layer to manipulate data, and call view engine (pug) to render view by view templates [server/views folder].

## How to run

### Clone
$ git clone https://github.com/quangvt/sample_nodejs_express.git
$ cd sample_nodejs_express

Install dependencies
$ npm install

Run web app
$ npm start

Test on browser
http://localhost:3000/
http://localhost:3000/speakers
http://localhost:3000/feedback

