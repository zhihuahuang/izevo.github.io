const gulp = require('gulp');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

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

gulp.task('normalize', done => {
    pump([
        gulp.src('node_modules/normalize.css/normalize.css'),
        cleanCSS(),
        gulp.dest('../assets/css')
    ], () => done());
});

gulp.task('default', ['normalize', 'css']);

gulp.task('watch', () => {
    gulp.watch('stylus/*', ['default']);
});