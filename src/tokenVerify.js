/* Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file
 except in compliance with the License. A copy of the License is located at

     http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS"
 BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations under the License.
*/


import {AWS_REGION, AWS_USER_POOL_APP_CLIENT_ID, AWS_USER_POOL_ID} from "./settings";

var https = require('https');
var jose = require('node-jose');

var region = AWS_REGION;
var userpool_id = AWS_USER_POOL_ID;
var app_client_id = AWS_USER_POOL_APP_CLIENT_ID;
var keys_url = 'https://cognito-idp.' + region + '.amazonaws.com/' + userpool_id + '/.well-known/jwks.json';

export async function tokenVerify(token) {
    var sections = token.split('.');
    // get the kid from the headers prior to verification
    var header = jose.util.base64url.decode(sections[0]);
    header = JSON.parse(header);
    var kid = header.kid;
    // download the public keys
    return new Promise((resolve, reject) => {
        https.get(keys_url, function (response) {
            if (response.statusCode == 200) {
                response.on('data', function (body) {
                    var keys = JSON.parse(body)['keys'];
                    // search for the kid in the downloaded public keys
                    var key_index = -1;
                    for (var i = 0; i < keys.length; i++) {
                        if (kid == keys[i].kid) {
                            key_index = i;
                            break;
                        }
                    }
                    if (key_index == -1) {
                        console.log('Public key not found in jwks.json');
                        reject('Public key not found in jwks.json');
                    }
                    // construct the public key
                    jose.JWK.asKey(keys[key_index]).then(function (result) {
                        // verify the signature
                        jose.JWS.createVerify(result).verify(token).then(function (result) {
                            // now we can use the claims
                            var claims = JSON.parse(result.payload);
                            // additionally we can verify the token expiration
                            var current_ts = Math.floor(new Date() / 1000);
                            if (current_ts > claims.exp) {
                                reject('Token is expired');
                            }
                            // and the Audience (use claims.client_id if verifying an access token)
                            if (claims.aud != app_client_id) {
                                reject('Token was not issued for this audience');
                            }
                            resolve(claims);
                        }).catch(function (err) {
                            reject('Signature verification failed:' + err);
                        });
                    });
                });
            }
        });
    })

}