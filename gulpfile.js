/**
 * @name gulp-packager
 * @version 1.4.0
 * @release 23-05-2021
 */

const { paths } = require("./_config/paths");

const {
  src,
  dest,
  watch,
  series
} = require('gulp');

// const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-dart-sass');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');

const browserSync = require('browser-sync').create();

// const del = require('delete');
// const { EventEmitter } = require('events');
// const { exec } = require('child_process');
// const fs = require('fs');

// function clean(cb) {
//   // body omitted
//   cb();
// }

async function SCSS() {
  return src(paths.cssSrc)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ["defaults"]
    }))
    .pipe(sourcemaps.write())
    .pipe(dest(paths.cssDest))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.cssDest))
    .pipe(livereload())
    .pipe(browserSync.reload({ stream: true }));
  // .pipe(browserSync.stream({ match: '**/*.css' }));
}

async function syncServe() {
  browserSync.init({
    watch: true,
    server: {
      baseDir: paths.root,
      serveStaticOptions: {
        extensions: ["html"]
      }
    },
    callbacks: {
    }
  });
  livereload.listen();
}

watch(paths.cssSrc, series(SCSS));
exports.default = series(SCSS, syncServe);