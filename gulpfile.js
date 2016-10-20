var path = require('path');
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    del = require('del'),
    webserver = require('gulp-webserver'),
    pkg = require('./package.json');

var srcDir = path.join(__dirname, "src");
var buildDir = path.join(__dirname, "build");
var modules = path.join(__dirname, "node_modules");

var files = {
    js: path.resolve(srcDir, "./app/**/*.js"),
    indexhtml: path.resolve(srcDir, "./index.html"),
    style: path.resolve(srcDir, "./styles.css"),
    templates: path.resolve(srcDir, "./app/templates/**/*.html")
};


gulp.task('libs', function() {
    var paths = [];
    for(var dep in pkg.dependencies) {
        paths.push(path.join(modules, dep, dep + '.min.js'));
    }
    gulp.src(paths)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(buildDir))
});
gulp.task('clean', function() {
    del([buildDir]);
});

gulp.task('watch', function() {
    gulp.watch(files.js, ['js:dev']);
    gulp.watch(files.indexhtml, ['statics']);
    gulp.watch(files.templates, ['templates']);
    gulp.watch(files.style, ['statics']);
});

gulp.task('statics', function() {
    gulp.src(files.indexhtml).pipe(gulp.dest(buildDir));
    gulp.src(files.style).pipe(gulp.dest(buildDir));
});

gulp.task('templates', function() {
    gulp.src(files.templates).pipe(gulp.dest(path.join(buildDir, "templates")));
});

gulp.task('js:dev', function () {
    return gulp.src(files.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(buildDir));
});
gulp.task('js:min', function () {
    return gulp.src(files.js)
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(buildDir));
});

gulp.task('webserver', function() {
    gulp.src(buildDir)
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true,
            host: 'localhost',
            port: 8000,
            //https: true
        }));
    console.log(buildDir);
});

gulp.task('default', ['js:dev', 'libs', 'templates', 'statics', 'webserver', 'watch']);
gulp.task('build', ['libs', 'js:min', 'templates', 'statics']);