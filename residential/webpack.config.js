const path = require('path');
const nodeExternals = require('webpack-node-externals');

//nodeExternals()
module.exports = {
    entry: {
        residentialCreate: './residential/src/residentialCreateLambda.js',
        residentialRead: './residential/src/residentialReadLambda.js',
    },
    mode: 'development',
    target: 'node',
    output: {
        filename: 'residential/[name].js',
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
