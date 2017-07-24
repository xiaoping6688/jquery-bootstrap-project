const gulp = require('gulp')
const copy = require('gulp-copy')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const minifycss = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const spriter = require('gulp-css-spriter')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const minifyhtml = require('gulp-minify-html')
const rename = require('gulp-rename')
const rev = require('gulp-rev')
const revcollector = require('gulp-rev-collector')
const eslint = require('gulp-eslint')
const sequence = require('gulp-sequence')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const connect = require('gulp-connect')
const proxy = require('http-proxy-middleware')
const browserSync = require('browser-sync').create()
const rsync = require('gulp-rsync');

const Config = require('./config/' + process.env.NODE_ENV)

// var argv = process.argv.slice(2)
// console.log('argv:' + argv)

let paths = {
  distDir: './dist',
  jsConfSrc: './config/*.js',
  jsComSrc: './src/js/common/*.js',
  jsSrc: './src/js/*.js',
  jsDest: './dist/js',
  cssSrc: './src/css/**/*',
  cssDest: './dist/css',
  imgSrc: './src/img/**/*',
  imgDest: './dist/img',
  htmlSrc: './src/page/**/*',
  tplSrc: './src/template/**/*.tpl',
  htmlDest: './dist/html',
  pageSrc: './src/*.html',
  libSrc: './src/lib/**/*',
  libDest: './dist/lib',
  mockSrc: './mock/**/*',
  mockDest: './dist/mock',
  distFiles: './dist/**/*',
  // manifestFile: './rev-manifest.json'
}

let deployOptions = {
  root: 'dist/',
  hostname: 'node@127.0.0.1', // use node user to login remote host
  destination: '/home/node/projectName/'
}

/**
 * 远程部署
 */
gulp.task('deploy', function() {
  return gulp.src('dist/**')
    .pipe(rsync(deployOptions))
})

/**
 * 环境输出
 */
gulp.task('env', function(){
  return gulp
    .src('./config/' + process.env.NODE_ENV + '.js')
    .pipe(rename('env.js'))
    .pipe(gulp.dest(paths.jsDest))
})

/**
 * 启动本地server
 */
gulp.task("server", function() {
  connect.server({
    root: paths.distDir,
    port: 3000,
    livereload: true,
    middleware: function (connect, opt) {
      return [
        proxy('/proxy',  {
          pathRewrite: {'^/proxy': ''},
          target: Config.PROXY_URI || 'http://127.0.0.1',
          changeOrigin: true,
          onProxyReq: function (proxyReq, req, res) {
            // for (var key in req.headers) {
            //   console.log('[HEADER]', key, req.headers[key])
            // }
          }
        })
      ]
    }
  })
})

/**
 * 同步浏览器
 */
gulp.task('browser', function() {
  var files = [
    paths.distFiles
  ]

  browserSync.init({
    files: files,
    proxy: 'http://localhost:3000',
    // browser: 'google chrome',
    notify: false,
    ui: false,
    port: 3001
  })

  gulp.watch(files).on('change', browserSync.reload)
})

gulp.task('scripts-common', function() {
  return gulp.src(paths.jsComSrc)
    .pipe(sourcemaps.init())
    .pipe(concat('common.min.js'))
    .pipe(uglify())
    // .pipe(rev()) // 文件名加MD5后缀
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.jsDest))
    // .pipe(rev.manifest()) // 生成一个rev-manifest.json
    // .pipe(gulp.dest('./')) // 将 rev-manifest.json 保存到 ./ 目录内
})

gulp.task('scripts', function() {
  return gulp.src(paths.jsSrc)
    // .pipe(sourcemaps.init())
    // .pipe(concat('app.min.js'))
    .pipe(uglify())
    // .pipe(rev()) // 文件名加MD5后缀
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.jsDest))
    // .pipe(rev.manifest()) // 生成一个rev-manifest.json
    // .pipe(gulp.dest('./')) // 将 rev-manifest.json 保存到 ./ 目录内
})

// gulp.task('rev', ['scripts'], function() {
//   gulp.src(['./rev-manifest.json', '../server/views/index.hbs']) // 读取 rev-manifest.json 文件以及需要进行文件名替换的文件
//     .pipe(revcollector()) // 执行文件内文件名的替换
//     .pipe(gulp.dest('../server/views')) // 替换后的文件输出的目录
// })

gulp.task('images', function() {
  return gulp.src(paths.imgSrc)
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.imgDest))
})

gulp.task('styles', function() {
  return gulp.src(paths.cssSrc)
    .pipe(sass()) // 编译scss
//     .pipe(concat('app.min.css')) // 合并scss
    .pipe(autoprefixer()) // 浏览器厂商前缀 {browsers:["> 1%","Firefox >= 10","ie >= 9","iOS >= 4","Chrome >= 10"],cascade:false}
    // .pipe(spriter({
    //   // The path and file name of where we will save the sprite sheet
    //   'spriteSheet': paths.imgDest + '/spritesheet.png',
    //   // Because we don't know where you will end up saving the CSS file at this point in the pipe,
    //   // we need a litle help identifying where it will be.
    //   'pathToSpriteSheetFromCSS': '../img/spritesheet.png'
    // }))
    .pipe(minifycss()) // 压缩css
    .pipe(gulp.dest(paths.cssDest))
})

gulp.task('htmls', function() {
  gulp.src(paths.htmlSrc)
    .pipe(minifyhtml({ comments: false }))
    .pipe(gulp.dest(paths.htmlDest))
})

gulp.task('templates', function() {
  gulp.src(paths.tplSrc)
    .pipe(minifyhtml({ comments: false }))
    .pipe(gulp.dest(paths.htmlDest))
})

gulp.task('pages', function() {
  gulp.src(paths.pageSrc)
    .pipe(minifyhtml({ comments: false }))
    .pipe(gulp.dest(paths.distDir))
})

gulp.task('lint', function () {
  return gulp.src(['./src/js/**/*', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('clean', function(cb) {
  del([paths.distFiles], { force: true }).then(function() {
    cb()
  })
})

gulp.task('libs', function() {
  gulp.src(paths.libSrc)
    .pipe(copy(paths.distDir, { prefix: 1 }))
    .pipe(gulp.dest(paths.libDest))
})

gulp.task('mocks', function() {
  gulp.src(paths.mockSrc)
    .pipe(copy(paths.distDir, { prefix: 0 }))
    .pipe(gulp.dest(paths.mockDest))
})

gulp.task('watch', function() {
  gulp.watch(paths.jsConfSrc, ['env'])
  gulp.watch([paths.jsComSrc], ['scripts-common'])
  gulp.watch([paths.jsSrc], ['scripts'])
  gulp.watch(paths.cssSrc, ['styles'])
  gulp.watch(paths.imgSrc, ['images'])
  gulp.watch(paths.htmlSrc, ['htmls'])
  gulp.watch(paths.tplSrc, ['templates'])
  gulp.watch(paths.pageSrc, ['pages'])
  gulp.watch(paths.libSrc, ['libs'])

  if (Config.BASE_URI === 'mock') {
    gulp.watch(paths.mockSrc, ['mocks'])
  }
})

gulp.task('build', ['clean'], function (cb) {
  // gulp.start('env', 'scripts-common', 'scripts', 'styles', 'images', 'htmls', 'pages', 'libs')
  sequence('env', 'scripts-common', 'scripts', 'styles', 'images', 'htmls', 'templates', 'pages', 'libs')(cb)
})

gulp.task('build-no-clean', function () {
  gulp.start('env', 'scripts-common', 'scripts', 'styles', 'images', 'htmls', 'templates', 'pages', 'libs')
})

gulp.task('default', function (cb) {
  if (Config.BASE_URI === 'mock') {
    sequence('build', 'mocks', 'watch', 'server', 'browser')(cb)
  } else {
    sequence('build', 'watch', 'server', 'browser')(cb)
  }
})


// function SpriterGroup(pathArr) {
//   for (let i = 0; i < pathArr.length; i++) {
//     gulp.src(pathArr[i])
//       .pipe(spriter({
//         'spriteSheet' : paths.imgDest + '/spriteSheet_' + i +'.png',
//         'pathToSpriteSheetFormCss' : '../img/spriteSheet_' + i + '.png'
//       }))
//       .pipe(gulp.dest(paths.cssDest))
//   }
// }
