var webpack = require('webpack');
var config = require('./webpack.config.js')
var env=require('../config/prod')

env.plugins.map(item=>config.plugins.push(item))

console.log('building');
webpack(config, function (err, stats) {
    if (err) {
        console.log('---- BUILD ERROR.')
        throw err
    }

    process.stdout.write(stats.toString({
        colors: true,
        modules: true,
        children: false,
        chunks: false,
        chunkModules: true
    }) + '\n\n')
    
    //用于自动化构建验证结果
    if(stats.compilation.errors && stats.compilation.errors.length > 0){
        console.log('---- BUILD ERROR.')
    }else{
        console.log('---- BUILD SUCCESS.')
    }
});