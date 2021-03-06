const express = require('express');
const createError = require('http-errors');
const path = require('path');
const bodyParser = require('body-parser');
const configs = require('./config');
const SpeakerService = require('./services/SpeakerService');
const FeedbackService = require('./services/FeedbackService');
const routes = require('./routes');

// Initial express web app
const app = express();

// Get config object by environment
const config = configs[app.get('env')];

// Initial Services
const speakerService = new SpeakerService(config.data.speakers);
const feedbackService = new FeedbackService(config.data.feedback);

// Setup view engine
app.set('view engine', 'pug');

// For display on right click => viewsource on browser
if(app.get('env') === 'development') {
    app.locals.pretty = true;
}

// Settings 'views' value 
app.set('views', path.join(__dirname, './views'));
app.locals.title = config.sitename;

// Use middleware for update rendertime
app.use((req, res, next) => {
    res.locals.rendertime = new Date();
    return next();
});

// http://expressjs.com/en/4x/api.html#express.static
// serves static assets such as HTML files, images, and so on
app.use(express.static('public'));

// http://expressjs.com/en/4x/api.html#express.urlencoded
// parses incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({extended: true}));

// Fix error favicon.ico not found
app.get('/favicon.ico', (req, res, next) => {
    return res.sendStatus(204);
});

// Use middleware to set speaderNames
app.use(async (req, res, next) => {
    try {
        const names = await speakerService.getNames();
        res.locals.speakerNames = names;
        return next();
    } catch(err) {
        return next(err);
    }
});

// http://expressjs.com/en/guide/using-middleware.html
// http://expressjs.com/en/guide/routing.html
// mount the router on the app
app.use('/', routes({
    speakerService,
    feedbackService,
}));

// No others route map
// Create error
app.use((req, res, next) => {
    return next(createError(404, 'File not found'));
});

// Render error
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    const status = err.status || 500;
    res.locals.status = status;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(status);
    return res.render('error');
});

app.listen(3000);

//module.export = app;
