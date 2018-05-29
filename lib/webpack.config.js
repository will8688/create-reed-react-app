
const PATH = require('path');
const webpack = require("webpack");
const webpackConfig = function (directory,single,ENV,TYPE) {  
    if(single){
        directory = directory[0];
    }else{
        directory = directory;
    }
    COMPONENT_NAME = directory.COMPONENT_NAME;
    COMPONENT_FOLDER = PATH.resolve(directory.COMPONENT_FOLDER);
    NODE_MODULES = PATH.resolve('../../node_modules');
    console.log(NODE_MODULES);
    PRE_LOADER = PATH.resolve('./Scripts/components/utils/loader/PreLoader.scss');
    PUBLIC_IMAGE_PATH = directory.PUBLIC_IMAGE_PATH;

    const loaders = require("./webpack.loaders")(COMPONENT_NAME, COMPONENT_FOLDER, NODE_MODULES, PRE_LOADER, PUBLIC_IMAGE_PATH);
    const config = require("./webpack.common")(COMPONENT_NAME, COMPONENT_FOLDER, NODE_MODULES);
    loaders.client[0].include.push(COMPONENT_FOLDER);
    config[0].name = COMPONENT_NAME;
    config[0].output.path = COMPONENT_FOLDER + '/compiled/scripts';
    config[0].entry = {};
    config[0].entry[COMPONENT_NAME] = ['core-js/fn/object/assign', 'core-js/es6/set', 'core-js/fn/promise', 'core-js/fn/array/from', COMPONENT_FOLDER + '/client.js'];

    config[0].module.rules = loaders.client;
    if (ENV === 'p') {
        config[0].plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        }));
        config[0].plugins.push(new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}));
    }
    return config;
}
module.exports = webpackConfig;