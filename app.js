const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const staticContentMgr = require("./util/staticContentMgr");
const cacheMgr = require("./util/cacheMgr");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

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

module.exports = app;
