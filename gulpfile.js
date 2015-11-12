// Build automation
// Require sudo npm install -g gulp
// For dev, initiate watch by executing either `gulp` or `gulp watch`

var gulp = require('gulp'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    shell = require('gulp-shell'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename');

var path = {
  scripts: ['./js/**/*.js'],
  sass: ['./scss/**/*.scss']
};

// Build All
gulp.task('build', ['browserify', 'browserify-min', 'insertVersion', 'sass', 'sass-min']);

// Browserify JS
gulp.task('browserify', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './js/controller.js',
    debug: false,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });
  return b.bundle()
    .pipe(source('html5-skin.js'))
    .pipe(buffer())
    .on('error', gutil.log)
    .pipe(gulp.dest('./build'));
});

// Browserify Minified JS
gulp.task('browserify-min', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './js/controller.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });
  return b.bundle()
    .pipe(source('html5-skin.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build'));
});

// Build Sass
gulp.task('sass', function () {
  gulp.src(path.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build'))
});

// Build Minified Sass
gulp.task('sass-min', function () {
  gulp.src(path.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build'))
});

// Run tests
gulp.task('test', shell.task(['npm test']));

// Initiate a watch
gulp.task('watch', function() {
  gulp.watch(path.scripts, ['browserify', 'browserify-min']);
  gulp.watch(path.sass, ['sass', 'sass-min']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'watch']);

//Insert version needs the other build steps to finish first, so we mark them as dependent tasks
gulp.task('insertVersion', ['browserify', 'browserify-min'], shell.task(['sed -i "" "s/<SKIN_VERSION>/`git rev-parse HEAD`/" ./build/html5-skin.js',
    'sed -i "" "s/<SKIN_VERSION>/`git rev-parse HEAD`/" ./build/html5-skin.min.js']));

// //Assets
// gulp.task('assets', function () {
//   gulp.src(['assets/**/*'])
//     .pipe(gulp.dest('./build/assets'));
// });