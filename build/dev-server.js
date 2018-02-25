var webpack = require('webpack')
var webpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config.js')
var env=require('../config/dev.js')

var server_port=env.port
config.entry['ui3'].push('webpack-dev-server/client?http://0.0.0.0:'+server_port)
config.entry['ui3'].push('webpack/hot/only-dev-server')

config.plugins.push(new webpack.HotModuleReplacementPlugin())

var compiler = webpack(config)
var server = new webpackDevServer(compiler, {
    historyApiFallback: true,
    host:env.host,
    hot:true,
    inline: true,
    compress:true,
    stats:{
        colors:true,
        modules:false,
        chunkModules:false,
        children: false,
        chunks: false,
        assets:false,
        source:false,
        warnings:false,
        version:false,
        timings:false,
        warnings:false
    },
});
server.listen(server_port);
console.log('http://'+env.host+':'+env.port);
