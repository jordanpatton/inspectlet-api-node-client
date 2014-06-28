var http = require('http');
var request = require('request');

function inspectletapi(username, password) {
  this.username = username || '';
  this.password = password || '';
  this.protocol = 'https';
  this.hostname = 'www.inspectlet.com';
  //this.connection = null;
  //this.cookie = '';
}

inspectletapi.prototype.execute = function (pathname, httpMethod, responseFormat, params, callback) {
  
  pathname = pathname || '';
  httpMethod = httpMethod || 'POST';
  responseFormat = responseFormat || 'JSON';
  params = params || {};
  
  var myHeaders = {};
  if(httpMethod === 'POST' && responseFormat === 'JSON') {
    myHeaders['Content-Type'] = 'application/json';
  } else if(httpMethod === 'POST' && responseFormat === 'HTML') {
    myHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
  } else if(httpMethod === 'GET' && responseFormat === 'JSON') {
    myHeaders['Content-Type'] = 'application/json';
  } else {
    myHeaders['Content-Type'] = 'text/html';
  }
  
  request({
    uri: this.protocol+'://'+this.hostname+pathname,
    method: httpMethod,
    headers: myHeaders,
    body: JSON.stringify(params)
  }, function (error, response, body) {
    console.log(error); console.log(response); console.log(body);
    if(error) {
      callback(new Error('Unable to connect to Inspectlet API endpoint.'));
    } else {
      if(responseFormat === 'JSON') {
        try {
          parsedResponse = JSON.parse(body);
        } catch(error) {
          callback(new Error('Error parsing JSON response from Inspectlet API.'));
          return;
        }
        callback(null, parsedResponse);
      } else {
        callback(null, body);
      }
    }
  });
  
};

inspectletapi.prototype.getHome = function (callback) {
  this.execute('/', 'GET', 'HTML', {}, callback);
};

inspectletapi.prototype.getSites = function (callback) {
  this.execute('/dashboard', 'GET', 'HTML', {}, callback);
};

inspectletapi.prototype.getCaptures = function (siteId, params, callback) {
  if(typeof params === 'function') {callback = params; params = {};}
  this.execute('/dashboard/captureapi/'+siteId, 'POST', 'JSON', params, callback);
};

module.exports = inspectletapi;