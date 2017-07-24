/**
 * 开发环境（本地）
 */

var ENV = {};

ENV.TYPE = 'development';
ENV.ASSETS_URI = './';
// ENV.BASE_URI = 'http://127.0.0.1/api';
ENV.BASE_URI = 'mock'; // mock data
// ENV.BASE_URI = 'proxy'; // forward to PROXY_URI
// ENV.PROXY_URI = 'http://127.0.0.1/api';

if (typeof module === 'object' && module && typeof module.exports === 'object') {
  module.exports = ENV;
}
