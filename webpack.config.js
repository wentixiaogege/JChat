/**
 * Created by jxymacbook on 2016-02-27.
 */
var webpack = require('webpack');
var path = require('path');
var dockerMachineIP = 'http://192.168.99.100';
var webPackDevServerPort = 3000;

module.exports = {
    devtool: "source-map", // for debugging
    entry: {
        auth:[
            'webpack-dev-server/client?' + dockerMachineIP + ':' + webPackDevServerPort,
            'webpack/hot/only-dev-server',
            //index: './public/javascripts/home.js',
            //auth: './public/javascripts/auth.js'
            './public/javascripts/auth.js'
            //vendors: ['bootstrap', 'jasny', 'moment', 'pace', 'typed', 'jquery']
        ]

    },
    output: {
        path: __dirname + '/public/build',
        publicPath: dockerMachineIP + ':' + webPackDevServerPort + '/public/build/', //this path hold webpack hot reload compiled bundle code
        filename: '[name].bundle.js' //the real output path is specified in gulp config file
    },
    module: {
        loaders: [
            /*{ test: /\.js$/, loader: 'babel-loader' },
            { test: /\.js$/, loader: 'jsx-loader' }*/
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel?presets[]=es2015&presets[]=react'],
                //loaders: ['babel?presets[]=es2015&presets[]=react'],
                exclude: /node_modules/,
                include: __dirname
            }
        ]
    },
    devServer: {
        //publicPath: 'http://192.168.99.100:3000',
        host: '0.0.0.0', //in docker
        port: '3000',//in docker
        hot: true,
        inline: true,
        stats: {colors: true},
        //used for cross origin request, like node running on 8080, will get data from webpack hot-reload webpack-dev-server running on 3000,
        headers: {'Access-Control-Allow-Origin': 'http://192.168.99.100:8080','Access-Control-Allow-Credentials': 'true'}
    },
    resolve: {
        /*alias: {
            bootstrap: __dirname + '/public/javascripts/lib/bootstrap.min.js',
            jasny: __dirname + '/public/javascripts/lib/jasny-bootstrap.min.js',
            moment: __dirname + '/public/javascripts/lib/moment.min.js',
            pace: __dirname + '/public/javascripts/lib/pace.min.js',
            typed: __dirname + '/public/javascripts/lib/typed.js',
            jquery: __dirname + '/public/javascripts/lib/jquery-1-12.min.js'
        }*/
    },
    watchOptions: { //fix webpack watch mode does not work with commad webpack --watch
        poll: 1000,
        aggregateTimeout: 1000
    },
    plugins: [

        new webpack.ProvidePlugin({ //ensure jquery available in bundle js file
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'root.jQuery': 'jquery'
        }),

        new webpack.optimize.CommonsChunkPlugin('common.js'), // extract common part of module

        //new webpack.optimize.UglifyJsPlugin({minimize: true}) //minimized file

        new webpack.HotModuleReplacementPlugin() ,//hot reload

    ]

};