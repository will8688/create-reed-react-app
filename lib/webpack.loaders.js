var ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackSharedLoaders = function (COMPONENT_NAME, COMPONENT_FOLDER, NODE_MODULES, PRE_LOADER, PUBLIC_IMAGE_PATH) {
    const loaders = {
        client: [
            {
                test: /\.js$/,
                include: [],
                loader: 'eslint-loader',
                enforce: 'pre',
                options: {
                    failOnError: true,
                    failOnWarning: true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0', 'flow'],
                    compact: false
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]&outputPath=../images/&publicPath=' + PUBLIC_IMAGE_PATH
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]&outputPath=../fonts/&publicPath=/fonts/'
                ]
            },
            {
                test: /\.css$/, 
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }, {
                test: /\.scss$/,
                include: PRE_LOADER, 
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        'sass-loader'
                    ]
                })
            }, {
                test: /\.scss$/,
                exclude: PRE_LOADER, 
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        },
                        'sass-loader'
                    ]
                })
            }, {
                test: /\.css$/,
                include: NODE_MODULES,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'less-loader'
                    ]
                })
            }
        ]
    };
    return loaders;
}

module.exports = webpackSharedLoaders;