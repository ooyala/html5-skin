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
    shell = require('gulp-shell');

var path = {
  scripts: ['./js/components/*.js', './js/constants/*.js', './js/styles/*.js', './js/views/*.js', './js/*.js'],
  css: ['./css/*.css'],
};

// Build All
gulp.task('build', ['browserify', 'pretty', 'buildCss', 'insertVersion']);

// Browserify JS
gulp.task('browserify', function () {
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
    .pipe(gulp.dest('./build/'));
});

// Unminified JS
gulp.task('pretty', function () {
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
    .pipe(gulp.dest('./build/'));
});

// Build CSS
gulp.task('buildCss', function() {
  gulp.src(path.css)
  //.pipe(concat('html5-skin.css'))
  .pipe(gulp.dest('build'));
});

// Run tests
gulp.task('test', shell.task(['npm test']));

// Initiate a watch
gulp.task('watch', function() {
  gulp.watch(path.scripts, ['build']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'watch']);


gulp.task("insertVersion", ['browserify', 'pretty', 'buildCss'], shell.task(['sed -i "" "s/<SKIN_VERSION>/`git rev-parse HEAD`/" ./build/html5-skin.js',
                                        'sed -i "" "s/<SKIN_VERSION>/`git rev-parse HEAD`/" ./build/html5-skin.min.js']));
