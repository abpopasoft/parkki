var path = require('path');

module.exports = {
    mode: 'production',
//    devtool: "source-maps",
    entry: {
        parkki: './src/index.js',
        omiNodeConnector: './src/omiNodeConnector.js',
//        oo: './src/odfMapper.js',
//        phubiPoller: './src/phubiPoller/phubiPollerLambda.js'
        parkkiDump: './src/odfMapper.js'
    },
    target: 'node',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]/index.js'
    },
}