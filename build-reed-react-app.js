require('babel-register');
const PATH = require('path');
const webpack = require("webpack");
var fileName = PATH.resolve('./webpack.directories.json');
var DIRECTORIES = require(fileName);

var COMPONENT_NAME = process.argv.slice(2)[0];
var ENV = process.argv.slice(3)[0];
var TYPE = process.argv.slice(4)[0];

console.log('COMPONENT_NAME: ' + COMPONENT_NAME);
console.log('ENV: ' + ENV);
console.log('TYPE: ' + TYPE);

var COMPONENT_FOLDER = '';
var publicPath = '';
var directory = DIRECTORIES.filter(function (directory) {
    return directory.COMPONENT_NAME === COMPONENT_NAME
});
var config = require("./lib/webpack.config")(directory,true,ENV,TYPE);
var compiler = webpack(config);
if (TYPE === 'w') {
    console.log('Watching...' + COMPONENT_NAME);
    compiler.watch({ // watch options:
        aggregateTimeout: 300, // wait so long for more changes
        poll: true // use polling instead of native watchers
        // pass a number to set the polling interval
    }, function(err, stats) {
        if (err) {
            console.error(err);
            return;
          }
        
          console.log(stats.toString({
            chunks: false,  // Makes the build much quieter
            colors: true    // Shows colors in the console
          }));
    });
}else{
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
}