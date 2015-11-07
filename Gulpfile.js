'use strict';
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var nodemon = require('nodemon');
gulp.task('serve', function (cb) {
    nodemon({
        script  : './bin/www',
        watch   : process.cwd() + '/*'
        //...add nodeArgs: ['--debug=5858'] to debug 
        //..or nodeArgs: ['--debug-brk=5858'] to debug at server start
    }).on('start', function () {
        setTimeout(function () {
            console.log('restarting server')
            livereload.changed();
        }, 2000); // wait for the server to finish loading before restarting the browsers
    });
});