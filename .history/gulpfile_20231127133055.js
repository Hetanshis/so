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

gulp.task("server", function () {
  return gulp.src(["server.ts"]).pipe(tsProject()).pipe(gulp.dest("build"));
});


gulp.task("copy-package-json", function () {
    return gulp.src("package.json").pipe(gulp.dest("build"));
  });

  gulp.task("default", gulp.series("compile", "copy-package-json", "server"));