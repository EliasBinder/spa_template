const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const staticContentMgr = require("./util/frameworkFrontendMgr");
const cacheMgr = require("./util/cacheMgr");
const directoryObserver = require("./util/directoryObserver");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/assets', express.static('assets'));
app.use('*', indexRouter);

//build static content for frontend
staticContentMgr.build();

//read cache from file
cacheMgr.file2Cache();
process.on('exit', function () {
    cacheMgr.cache2File();
});
process.on('SIGINT', function () {
    cacheMgr.cache2File();
    process.exit(2);
});

//Watch for changes in screens and componentMgmt
directoryObserver.startWatching();

module.exports = app;
