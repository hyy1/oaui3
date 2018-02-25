var webpack = require('webpack')
module.exports = {
    plugins:[
        new webpack.optimize.UglifyJsPlugin(),//压缩js
    ]
}