/*jshint -W040 */
/*jshint -W098 */
'use strict';
// Require Gulp first


var gulp = require('gulp'),
    // pkg = require('./package.json'),
    // args = require('yargs').argv,
    // gulpif = require('gulp-if'),
    del = require('del'),
// Load plugins
    $ = require('gulp-load-plugins')({lazy: true});

/**
 * @name babel
 *
 * @description Transpiles ES6 to ES5 using Babel
 *
 * @see {@link http://babeljs.io/|Babeljs}
 */
gulp.task('babel', () => {
return gulp
    .src('app/es6/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel({
        presets: [
            'es2015',
            'stage-3'
        ]
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('app/js/'))
    .pipe($.size({
        pretty: true,
        title: 'Babel'
    }));
});

/**
 * @name babelFuture
 *
 * @description Transpiles ESNext to ES6 using Babel.
 *
 * The way this work can change at any time without warning as it uses
 * things at stage 0 in the TC39 pipeline. Use at your own risk
 *
 * @see {@link https://tc39.github.io/process-document/|TC 39 Process Document}
 * @see {@link http://www.2ality.com/2015/11/tc39-process.html|TC 39 Process Document Explained}
 *
 */
gulp.task('babelFuture', () => {
    log('Transpiling experimental ESNext to ES5');
    return gulp.src('app/es6/**/*.js')
        .pipe(gulpif(args.list, $.print()))
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['stage-0']
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('app/js/experimental'))
        .pipe($.size({
            pretty: true,
            title: 'Babel Experimental'
        }));
});

// Javascript style and syntax validation
/**
 * @name eslint
 * @description runs eslint under for the gulpfile and all the files under app.js
 * excluding node_modules using the google rules for eslint
 *
 * ESLint ignores files with "node_modules" paths.
 * So, it's best to have gulp ignore the directory as well.
 * Also, Be sure to return the stream from the task
 *
 * Otherwise, the task may end before the stream has finished.
 *
 * eslint() attaches the lint output to the "eslint" property
 * of the file object so it can be used by other modules.
 *
 * eslint.format() outputs the lint results to the console.
 * Alternatively use eslint.formatEach() (see Docs).
 *
 * To have the process exit with an error code (1) on
 * lint error, return the stream and pipe to failAfterError last.
 */
ggulp.src(['**/*.js','!node_modules/**'])
    .pipe(eslint({
        extends: 'eslint:recommended',
        ecmaFeatures: {
            'modules': true
        },
        rules: {
            "quotes": ["error", "double"],
            'strict': 2
        },
        globals: {},
        envs: [
            'browser',
            'es6'
        ]
    }))
    .pipe(eslint.formatEach('compact', process.stderr));

/**
 * @name jslint
 *
 * @description runs jshint on the gulpfile and all files under app/js
 *
 * @see {@link http://jshint.com/docs/|JSHint Docs}
 */
gulp.task('js-lint', () => {
    return gulp.src(['gulpfile.js', 'app/js/**/*.js', '!node_modules/**'])
        .pipe(gulpif(args.list, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}));
});

/**
 * @name jsdoc
 * @description runs JSDOC on gulp file. Later tasks will add documentation
 * to service worker and our own scripts
 */
gulp.task('jsdoc', function (done) {
  var config = require('./conf.json');
  gulp.src(['README.md', 'js/**/*.js'], {read: false})
    .pipe($.jsdoc3(config, done));
});

/**
 * @name jsdoc:gulpfile
 * @description runs JSDOC on gulp file. Later tasks will add documentation
 * to service worker and our own scripts
 */
gulp.task('jsdoc:gulpfile', function (done) {
    var config = require('./conf.json');
    gulp.src(['GULP-README.md', './gulpfile.js'], {read: false})
        .pipe($.jsdoc3(config, done));
});
