require('babel-register');
const PATH = require('path');
const webpack = require("webpack");
var fileName = PATH.resolve('./webpack.directories.json');
var DIRECTORIES = require(fileName);

DIRECTORIES.map((directory) => {
    var config = require("./lib/webpack.config")(directory,false,'p');
    var compiler = webpack(config);
    compiler.run(function (err, stats) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stats.toString({
            chunks: false,  // Makes the build much quieter
            colors: true    // Shows colors in the console
        }));
    });
});