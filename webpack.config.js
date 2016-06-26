'use strict';

const HtmlWebackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: './src/app',
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