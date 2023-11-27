const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

gulp.task("compile", function () {
  return gulp
    .src(["src/**/*.ts"])
    .src(["views/**/*.ejs"])
    .pipe(tsProject())
    .pipe(gulp.dest("build/src"))
    .pipe(gulp.dest("build/src"));
});


gulp.task("server", function(){
    return gulp.src(["server.ts"]).pipe(tsProject()).pipe(gulp.dest("build"))
} )