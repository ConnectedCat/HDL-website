// basic gulp setup
var gulp = require('gulp');

var sass = require('gulp-sass');


gulp.task('default', function() {
  return gulp.src('./build/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./static/css'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('./build/*.scss', {debounceDelay: 500}, ['default']);
});
