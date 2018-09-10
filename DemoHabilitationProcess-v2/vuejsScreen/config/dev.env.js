'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL_EXT: '"http://localhost:15672/api/exchanges/%2F/habilitation-exchange"',
  BASE_URL_EXT_CAMUNDA: '"http://localhost:8080/engine-rest/"',
  BASE_URL_INT: '"https://es2-rec1.cofely.com:443"',
  OKTA_ISSUER: '"{OKTA-Issuer}"',
  OKTA_CLIENT_ID: '"{OKTA-Client-Id}"',
  OKTA_REDIRECT_URL: '"{Application-Redirect-Url}"',
});
