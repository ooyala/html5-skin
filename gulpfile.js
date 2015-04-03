// Build automation
// Require sudo npm install -g gulp

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    react = require('gulp-react');

gulp.task('build', function() {
  gulp.src('./js/*.js')
  .pipe(concat('html5-skin.js'))
  .pipe(react())
  .pipe(jshint())
  .pipe(jshint.reporter())
  //.pipe(uglify())
  .pipe(gulp.dest('build'));
});