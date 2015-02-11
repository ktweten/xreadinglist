/**
 * Created by Kelly on 2/10/2015.
 */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task('js', function () {
    return gulp.src(['./public/javascripts/xreadinglist/xreadinglist.js',
        './public/javascripts/xreadinglist/xreadinglist-*.js'])
        .pipe(uglify())
        .pipe(concat('xreadinglist.min.js'))
        .pipe(gulp.dest('./public/javascripts/'));
});
