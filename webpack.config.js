'use strict';

const HtmlWebackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: {
        'js/bundle': './src/app',
        'cordova': './src/wrappers/cordova'
    },
    output: {
        path: __dirname + '/dist/browser',
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            query: {
                cacheDirectory: true
            },
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader']
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css']
    },
    plugins: [new HtmlWebackPlugin({
        template: './src/views/index.html'
    })]
};