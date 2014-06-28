var InspectletAPI = require('../lib/inspectletapi.js');
var config = require('./config.json');

var insp = new InspectletAPI(config.username, config.password, false);

insp.logIn(function (logInError, logInData) {
  console.log('logged in');
  
  insp.getSites(function (error, data) {
    console.log(data);
    
    insp.logOut(function (logOutError, logOutData) {
      console.log('logged out');
    });
  });
});