const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const webpackCommonConfig = function (COMPONENT_NAME, COMPONENT_FOLDER, NODE_MODULES) {
    var glob = require('glob');

    var alias = {};
    var files = glob.sync(COMPONENT_FOLDER + '/src/*');
    for (var x = 0; x < files.length; x++) {
        var temp = files[x].split('/');

        alias[temp[temp.length - 1]] = files[x];
    }

    const resolve = {
        alias: alias,
        extensions: ['.js', '.jsx', '.json'],
        mainFiles: ['index.js', 'index.jsx']
    }
    const common = [
        {
            target: 'web',
            output: {
                filename: '[name].js',
                path: ''
            },
            devtool: 'cheap-module-source-map',
            stats: {
                warnings: false
            },
            module: {
                rules: ''
            },
            plugins: [
                new ExtractTextPlugin({
                    filename: '../styles/[name].css',
                    allChunks: true
                })
            ],
            resolve: resolve
        }
    ];
    return common;
}
module.exports = webpackCommonConfig;