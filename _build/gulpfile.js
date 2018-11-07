const gulp = require('gulp');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');

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

gulp.task('default', ['normalize', 'css']);

gulp.task('watch', ['default'], () => {
    gulp.watch('stylus/*', ['default']);
});