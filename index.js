var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var etudiantRouter = require('./routes/Etudiant');
var programRouter = require('./routes/Program');
var todoRouter = require('./routes/Todo');
var lessonRouter = require('./routes/Lesson')
var levelTestRouter = require('./routes/LevelTest');
var examRouter = require('./routes/Exam')
var notificationRouter = require('./routes/Notification');
var forumRouter = require('./routes/Forum');
var fileRouter = require('./routes/File');
var badgeRouter = require('./routes/Badge');

const cors = require('cors');
var app = express();
require('dotenv').config();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/etudiant', etudiantRouter);
app.use('/program',programRouter);
app.use('/todo',todoRouter);
app.use('/level-test', levelTestRouter);
app.use('/lesson', lessonRouter);
app.use('/exam', examRouter);
app.use('/notification', notificationRouter);
app.use('/forum', forumRouter);
app.use('/file', fileRouter);
app.use('/badge', badgeRouter);

app.use(function(req, res, next) { next(createError(404)); });

app.use(function(err, req, res, next) 
{
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

var port = process.env.PORT || 4000;
app.listen(port, () => console.log(` listening on port ${port}!`));

module.exports = app;