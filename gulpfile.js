// Build automation
// Require sudo npm install -g gulp
// For dev, initiate watch by executing either `gulp` or `gulp watch`

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    react = require('gulp-react');

var path = {
  scripts: ['./js/*.js'],
  css: ['./css/*.css'],
};

// Build All
gulp.task('build', ['buildScript', 'buildCss']);

// Build JS
gulp.task('buildScript', function() {
  gulp.src(path.scripts)
  .pipe(concat('html5-skin.js'))
  .pipe(react())
  .pipe(jshint())
  .pipe(jshint.reporter())
  //.pipe(uglify())
  .pipe(gulp.dest('build'));
});

// Build CSS
gulp.task('buildCss', function() {
  gulp.src(path.css)
  .pipe(concat('html5-skin.css'))
  .pipe(gulp.dest('build'));
});

// Initiate a watch
gulp.task('watch', function() {
  gulp.watch(path.scripts, ['buildScript']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'watch']);