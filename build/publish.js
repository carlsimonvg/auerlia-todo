const gulp = require("gulp");
const Publish = require("build-utilities/publish");

gulp.task("build:dist", ["build:all"], function() {
    const publish = new Publish();
    publish.publish([
        {
            src: ["app/src/**/*.*"],
            dest: "dist/app/src"
        },
        {
            src: ["images/**/*.*"],
            dest: "dist/images"
        },
        {
            src: ["styles/**/*.*"],
            dest: "dist/styles"
        },
        {
            src: ["jspm_packages/**/*.*"],
            dest: "dist/jspm_packages"
        },
        {
            src: ["index.html"],
            dest: "dist"
        },
        {
            src: ["config.js"],
            dest: "dist"
        },
        {
            src: ["favicon.ico"],
            dest: "dist"
        },
        {
            src: ["service-worker.js"],
            dest: "dist"
        },
        {
            src: ["manifest.json"],
            dest: "dist"
        }
    ])
});