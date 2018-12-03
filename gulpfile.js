/*
 * @Author: sunliang 
 * @Date: 2018-12-03 09:02:51 
 * @Last Modified by: sunliang
 * @Last Modified time: 2018-12-03 09:40:43
 */

//引入路径
var gulp = require('gulp');
var devSass = require('gulp-sass');
var devJs = require('gulp-uglify');
var server = require('gulp-webserver');
var zipCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var url = require('url');
var fs = require('fs');
var path = require('path');

//gulp服务
gulp.task('server', function() {
    return gulp.src('./src')
        .pipe(server({
            port: 9090,
            open: true,
            livereload: true,
            directoryListing: true,
            middleware: function(req, res, next) {
                var pathanme = url.parse(req.url).pathname;
                if (pathanme === '/favicon.ico') {
                    return res.end('');
                }
                if (pathanme === '/api/list') {
                    res.end('接口')
                } else {
                    pathanme = pathanme === '/' ? 'index.html' : pathanme;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathanme)));
                }
            }
        }))
})

//编译scss 压缩css
gulp.task('scss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(devSass())
        .pipe(zipCss({ compatibility: 'ie8' }))
        .pipe(gulp.dest('./src/css'));
})

//压缩js  合并js
gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(devJs())
        .pipe(gulp.dest('./src/Zipjs'))
})

//监听scss,js
gulp.task('watch', function() {
    gulp.watch('./src/scss/*.scss', gulp.series('scss'))
    gulp.watch('./src/js/*.js', gulp.series('js'))
})

//创建default任务
gulp.task('default', gulp.series('scss', 'js', 'server', 'watch'));