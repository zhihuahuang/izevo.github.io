const gulp = require('gulp');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');

const pump = require('pump');

gulp.task('css', done => {
    pump([
        gulp.src('stylus/*.styl'),
        stylus(),
        autoprefixer(),
        cleanCSS(),
        gulp.dest('../assets/css')
    ], () => done());

});

gulp.task('normalize', ['css'], done => {
    pump([
        gulp.src(['node_modules/normalize.css/normalize.css', '../assets/css/default.css']),
        concat('default.css'),
        cleanCSS(),
        gulp.dest('../assets/css')
    ], () => done());
});

gulp.task('js', done => {
   pump([
       browserify('js/index.js')
           .transform(babelify.configure({
               presets: [
                   'babel-preset-env',
                   'babel-preset-stage-2'
               ],
               plugins: [
                   ['babel-plugin-transform-runtime', {
                       helpers: false,
                       polyfill: false,
                       moduleName: 'babel-runtime'
                   }]
               ]
           }))
           .bundle(),
       source('index.js'),
       buffer(),
       uglify(),
       gulp.dest('../assets/js')
   ], err => {
       if (err) {
           console.error(err);
       }

       done();
   });
});

gulp.task('default', ['normalize', 'css', 'js']);

gulp.task('watch', ['default'], () => {
    gulp.watch('stylus/*', ['default']);
    gulp.watch('js/*', ['default']);
});
