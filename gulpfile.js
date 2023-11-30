const { src, dest, watch, series, parallel} = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const browserSync = require("browser-sync").create();
const cleanDir = require('gulp-clean');
const csso = require('gulp-csso');
const rename = require("gulp-rename");

const html = () => {
  return src('./src/html/*.html')
  .pipe(fileinclude({
    prefix: '@@'
  }))
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(dest('./dist'))
}
const scripts = () => {
  return src('./src/scripts/**/*.js')
  .pipe(dest('./dist/scripts'))
}
const styles = () => {
  return src('./src/sass/**/*.scss', {sourcemaps: true})
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('main.css'))
  .pipe(dest('./dist/styles', {sourcemaps: true}))
  .pipe(rename({suffix: '.min'}))
  .pipe(csso())
  .pipe(dest('./dist/styles', {sourcemaps: true}))
}
const watchFiles = () => {
  watch('./src/html/**/*.html', html).on('all', browserSync.reload);
  watch('./src/scripts/**/*.js', scripts).on('all', browserSync.reload);
  watch('./src/sass/**/*.scss', styles).on('all', browserSync.reload);
}
const server = () => {
  return browserSync.init({
    server: {
        baseDir: "./dist"
      }
  });
}
const clean = () => {
  return src('./dist/*').pipe(cleanDir());
}
exports.dev = series(
  clean,
  html,
  scripts,
  styles,
  parallel(watchFiles, server)
)
exports.scripts = scripts;
exports.styles = styles;
exports.watchFiles = watchFiles;
exports.html = html;
exports.clean = clean;