var InspectletAPI = require('../lib/inspectletapi.js');
var config = require('./config.json');

var insp = new InspectletAPI(config.username, config.password, true);

insp.getSites(function (error, data) {
  console.log(data);
});