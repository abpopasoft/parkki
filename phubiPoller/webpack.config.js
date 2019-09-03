const path = require('path');
const nodeExternals = require('webpack-node-externals');

//nodeExternals()
module.exports = {
    entry: {
        phubiPoller: './phubiPoller/src/phubiPollerLambda.js',
        phubiUpdater: './phubiPoller/src/phubiUpdaterLambda.js',
        simple: './phubiPoller/src/simple.js'
    },
    mode: 'development',
    target: 'node',
    output: {
        filename: '[name]/[name].js',
        path: path.resolve(__dirname, '../dist'),
        library: '[name]',
        libraryTarget: 'commonjs2'
    },
    // externals: [ nodeExternals({
    //     whitelist: ['node-fetch']
    // })]
   // externals:
   //      {'aws-sdk': {commonjs: 'aws-sdk'}}

    externals: [
        function(context, request, callback) {
 //       console.log(request);
            if('aws-sdk' == request){
                return callback(null, 'commonjs ' +request);
            }
            callback();
        }
    ]

};



