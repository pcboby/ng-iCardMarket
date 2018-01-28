// Generated on 2017-03-18 using generator-angular 0.16.0
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var openURL = require('open');
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');

var $root = require('./bower.json').webRoot || './'

var yeoman = {
    app: $root + 'app',
    dist: $root + 'dist',
    bower: $root + 'bower_components',
    test: $root + 'test'
};

var paths = {
    // styles: [yeoman.app + '/styles/**/*.css'],
    test: [yeoman.test + '/spec/**/*.js'],
    testRequire: [
        yeoman.bower + '/angular/angular.js',
        yeoman.bower + '/angular-mocks/angular-mocks.js',
        yeoman.bower + '/angular-resource/angular-resource.js',
        yeoman.bower + '/angular-cookies/angular-cookies.js',
        yeoman.bower + '/angular-sanitize/angular-sanitize.js',
        yeoman.bower + '/angular-route/angular-route.js',
        yeoman.test + '/mock/**/*.js',
        yeoman.test + '/spec/**/*.js'
    ],
    karma: 'karma.conf.js',
    html: {
        main: yeoman.app + '/index.html',
        views: yeoman.app + '/views/**/*.html',
        tpls: yeoman.app + '/tpls/**/*.html'
    },
    themes: {
        css: yeoman.app + '/themes/**/css/*.css',
        images: yeoman.app + '/themes/**/images/**/*',
        fonts: yeoman.app + '/themes/**/fonts/*'
    },
    scripts: [yeoman.app + '/scripts/**/*.js'],
    // scripts: {
    //     common:yeoman.app+'/scripts/*.js',
    //     ngapp: yeoman.app + '/scripts/app/**/*',
    //     ctrls: yeoman.app + '/scripts/controllers/**/*',
    //     utils: yeoman.app + '/scripts/utils/**/*'
    // }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
    .pipe($.jshint, '.jshintrc')
    .pipe($.jshint.reporter, 'jshint-stylish');

var themes_css = lazypipe()
    .pipe($.autoprefixer, 'last 1 version')
    .pipe(gulp.dest, '.tmp/themes');

var themes_images = lazypipe()
    .pipe(gulp.dest, '.tmp/themes');

var themes_fonts = lazypipe()
    .pipe(gulp.dest, '.tmp/themes');

///////////
// Tasks //
///////////

gulp.task('themes_css', function() {
    return gulp.src(paths.themes.css)
        .pipe(themes_css());
});

gulp.task('themes_fonts', function() {
    return gulp.src(paths.themes.fonts)
        .pipe(themes_fonts());
});

gulp.task('themes_images', function() {
    return gulp.src(paths.themes.images)
        .pipe(themes_images());
});

gulp.task('lint:scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(lintScripts());
});

gulp.task('clean:tmp', function(cb) {
    rimraf('./.tmp', cb);
});

gulp.task('start:client', ['start:serve', 'themes_css', 'themes_fonts', 'themes_images'], function() {
    openURL('http://localhost:9000/app');
});

gulp.task('start:serve',['bower'], function() {
    $.connect.server({
        root: [$root, '.tmp'],
        livereload: true,
        // Change this to '0.0.0.0' to access the server from outside.
        port: 9000
    });
});

gulp.task('start:serve:test', function() {
    $.connect.server({
        root: [yeoman.test, $root, '.tmp'],
        livereload: true,
        port: 9001
    });
});

gulp.task('watch', function() {
    $.watch(paths.themes.css)
        .pipe($.plumber())
        .pipe(themes_css())
        .pipe($.connect.reload());

    $.watch(paths.themes.images)
        .pipe($.plumber())
        .pipe(themes_images())
        .pipe($.connect.reload());

    $.watch(paths.themes.fonts)
        .pipe($.plumber())
        .pipe(themes_fonts())
        .pipe($.connect.reload());

    $.watch(paths.html.views)
        .pipe($.plumber())
        .pipe($.connect.reload());

    $.watch(paths.scripts)
        .pipe($.plumber())
        .pipe(lintScripts())
        .pipe($.connect.reload());

    $.watch(paths.test)
        .pipe($.plumber())
        .pipe(lintScripts());

    gulp.watch('bower.json', ['bower']);
});

gulp.task('serve', function(cb) {
    runSequence('clean:tmp', ['lint:scripts'], ['start:client'],
        'watch', cb);
});

gulp.task('serve:prod', function() {
    $.connect.server({
        root: [yeoman.dist],
        livereload: true,
        port: 9000
    });
});

gulp.task('test', ['start:serve:test'], function() {
    var testToFiles = paths.testRequire.concat(paths.scripts, paths.test);
    return gulp.src(testToFiles)
        .pipe($.karma({
            configFile: paths.karma,
            action: 'watch'
        }));
});

// inject bower components
gulp.task('bower', function() {
    return gulp.src(paths.html.main)
        .pipe(wiredep({
            directory: yeoman.bower,
            ignorePath: '..'
        }))
        .pipe(gulp.dest(yeoman.app));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function(cb) {
    rimraf(yeoman.dist, cb);
});

gulp.task('client:build', ['html', 'themes_css'], function() {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src(paths.html.main)
        .pipe($.useref({ searchPath: [$root, '.tmp'] }))
        //filter js
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        //filter css
        .pipe(cssFilter)
        .pipe($.minifyCss({ cache: true }))
        .pipe(cssFilter.restore())
        //add rev
        .pipe($.rev())
        .pipe($.revReplace())
        //pipe to
        .pipe(gulp.dest(yeoman.dist));
});

gulp.task('html', function() {
    return gulp.src(yeoman.app + '/views/**/*')
        .pipe(gulp.dest(yeoman.dist + '/views'));
});

gulp.task('images', function() {
    return gulp.src(yeoman.app + '/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(yeoman.dist + '/images'));
});

gulp.task('copy:extras', function() {
    return gulp.src(yeoman.app + '/*/.*', { dot: true })
        .pipe(gulp.dest(yeoman.dist));
});

gulp.task('copy:fonts', function() {
    return gulp.src(yeoman.app + '/fonts/**/*')
        .pipe(gulp.dest(yeoman.dist + '/fonts'));
});

gulp.task('build', ['clean:dist'], function() {
    runSequence(['images', 'copy:extras', 'copy:fonts', 'client:build']);
});

gulp.task('default', ['build']);