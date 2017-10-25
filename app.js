"use strict";

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

// var io = require('socket.io')(server);
// io.on('connection', function(){ /* … */ });
// server.listen(3000);



// console.log($);

var index = require('./routes/index');
var users = require('./routes/users');
var config = require('./config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Changed from app.listen(3000, ...) to support socket.io
server.listen(process.env.PORT || 7777, () => console.log('Frontend server is running on port 7777'));

io.on('tweet', function(){
  //All events emitted go in here (entire post request...?)
    // Emit the tweet data from the post request to the client side

    //MAKE SURE (ON CLIENT SIDE) THAT THE NEWLY ACQUIRED TWEET IS APPENDED TO THE LIST OF TWEETS
      // Check requirements. Show 5 tweets total? Or start by showing 5 tweets?
        //That will determine if more needs to be done after appending the new tweet info to ul of li



  // On (tweet) post request

  // });
});


module.exports = app;
