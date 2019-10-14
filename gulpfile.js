var gulp = require('gulp'),
    browserSync = require('browser-sync');
 
gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: 'client'
        },
        ui: {
            port: 8050
        },
        port: 8000,
        logLevel: 'debug',
        notify: false
    });
    gulp.watch('client/**/*.*').on('change', browserSync.reload);
});
