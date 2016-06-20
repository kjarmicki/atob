'use strict';

const HtmlWebackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: './src/index',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            query: {
                cacheDirectory: true
            },
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [new HtmlWebackPlugin({
        template: './src/views/index.html'
    })]
};