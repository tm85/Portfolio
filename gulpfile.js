var gulp = require('gulp');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var del = require('del');
var plumber = require('gulp-plumber');


// Image Compression
var imagemin = require("gulp-imagemin");
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

// File Paths
var DIST_PATH = 'public/dist';
var SCRIPTS_PATH = 'public/script/**/*.js';
var SCSS_PATH = 'public/scss/**/*.scss';
var IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';

// Styles For SCSS
gulp.task('styles', function () {
    console.log('starting styles task');
    return gulp.src(SCSS_PATH)
        .pipe(plumber(function (err) {
            console.log("Styles task error");
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

// Scripts
gulp.task('scripts', function () {
    console.log('starting scripts task');

    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function (err) {
            console.log("Scripts task error");
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

// Images
gulp.task('images', function () {
    return gulp.src(IMAGES_PATH)
        .pipe(imagemin(
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminPngquant(),
                imageminJpegRecompress()
            ]
        ))
        .pipe(gulp.dest(DIST_PATH + '/images'));
});


gulp.task('clean', function () {
    return del.sync([
        DIST_PATH
    ]);
});

gulp.task('default', ['clean', 'images', 'styles', 'scripts'], function () {
    console.log('Starting default task');
});


// Watch
gulp.task('watch', ['default'], function () {
    console.log('Starting watch task');
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(SCSS_PATH, ['styles']);
});