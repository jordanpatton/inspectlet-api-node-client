var http = require('http');
var request = require('request').defaults({
  followAllRedirects: true,
  maxRedirects: 10,
  timeout: 5000,
  jar: true
});
var cheerio = require('cheerio');

function InspectletAPI(username, password, autoAuth) {
  this.username = username || '';
  this.password = password || '';
  this.autoAuth = autoAuth || false;
}

InspectletAPI.prototype._logIn = function (callback) {
  request({
    uri: 'https://www.inspectlet.com/signin/login',
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'email='+this.username+'&password='+this.password+'&submform=Sign+In'
  }, function (error, response, body) {
    if(error) {
      callback(new Error('Unable to connect to Inspectlet API endpoint.'));
    } else {
      callback(null, body);
    }
  });
};
InspectletAPI.prototype.logIn = function (callback) {
  if(this.autoAuth) {
    callback(new Error('Disable autoAuth to logIn() manually.'));
  } else {
    this._logIn(callback);
  }
};

InspectletAPI.prototype._logOut = function (callback) {
  request({
    uri: 'https://www.inspectlet.com/control/logout',
    method: 'GET',
    headers: {'Content-Type': 'text/html'},
    body: ''
  }, function (error, response, body) {
    if(error) {
      callback(new Error('Unable to connect to Inspectlet API endpoint.'));
    } else {
      callback(null, body);
    }
  });
};
InspectletAPI.prototype.logOut = function (callback) {
  if(this.autoAuth) {
    callback(new Error('Disable autoAuth to logOut() manually.'));
  } else {
    this._logOut(callback);
  }
};

InspectletAPI.prototype.getHome = function (callback) {
  request({
    uri: 'http://www.inspectlet.com',
    method: 'GET',
    headers: {'Content-Type': 'text/html'},
    body: ''
  }, function (error, response, body) {
    if(error) {
      callback(new Error('Unable to connect to Inspectlet API endpoint.'));
    } else {
      callback(null, body);
    }
  });
};

InspectletAPI.prototype._getSites = function (callback) {
  request({
    uri: 'https://www.inspectlet.com/dashboard',
    method: 'GET',
    headers: {'Content-Type': 'text/html'},
    body: ''
  }, function (error, response, body) {
    if(error || response.statusCode !== 200) {
      callback(new Error('Unable to connect to Inspectlet API endpoint.'));
    } else {
      var sites = [];
      var $ = cheerio.load(body);
      $('div[id="sitelist"] > div[class="trow listcolor1"], div[id="sitelist"] > div[class="trow listcolor2"]').each(function (index, element) {
        sites.push({
          id:       $(element).find('div.crecenabled > a').eq(0).attr('href').trim().replace('/dashboard/captures/',''),
          name:     $(element).find('div.cname').eq(0).text().trim(),
          captures: $(element).find('div.crecenabled > a').eq(0).attr('href').trim(),
          heatmaps: $(element).find('div.cheatmaps > a').eq(0).attr('href').trim(),
          forms:    $(element).find('div.cformanalytics > a').eq(0).attr('href').trim(),
          status:   $(element).find('div.cstatus > img').eq(0).attr('src').trim()
        });
      });
      callback(null, sites);
    }
  });
};
InspectletAPI.prototype.getSites = function (callback) {
  var self = this;
  if(self.autoAuth) {
    self._logIn(function (logInError, logInData) {
      if(!logInError) {
        self._getSites(function (error, data) {
          self._logOut(function (logOutError, logOutData) {
            callback(error, data);
          });
        });
      }
    });
  } else {
    self._getSites(callback);
  }
};

InspectletAPI.prototype._getCaptures = function (siteId, params, callback) {
  if(typeof params === 'function') {callback = params; params = {};}
  request({
    uri: 'https://www.inspectlet.com/dashboard/captureapi/'+siteId,
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(params)
  }, function (error, response, body) {
    if(error) {
      callback(new Error('Unable to connect to Inspectlet API endpoint.'));
    } else {
      try {
        parsedResponse = JSON.parse(body);
      } catch(error) {
        callback(new Error('Error parsing JSON response from Inspectlet API.'));
        return;
      }
      callback(null, parsedResponse);
    }
  });
};
InspectletAPI.prototype.getCaptures = function (siteId, params, callback) {
  var self = this;
  if(self.autoAuth) {
    self._logIn(function (logInError, logInData) {
      if(!logInError) {
        self._getCaptures(siteId, params, function (error, data) {
          self._logOut(function (logOutError, logOutData) {
            callback(error, data);
          });
        });
      }
    });
  } else {
    self._getCaptures(siteId, params, callback);
  }
};

module.exports = InspectletAPI;