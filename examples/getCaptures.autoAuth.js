var InspectletAPI = require('../lib/inspectletapi.js');
var config = require('./config.json');

var params = {
  "searchparams": {
    "daterange": "",
    "daterangecustom": {
      "start": "",
      "end": ""
    },
    "seslength_start": "1",
    "seslength_end": "unlimited",
    "sestime_start": "0",
    "sestime_end": "unlimited",
    "startpage": {
      "operator": "is",
      "conditionval": ""
    },
    "exitpage": {
      "operator": "is",
      "conditionval": ""
    },
    "visitedpage": {
      "operator": "is",
      "conditionval": ""
    },
    "newold": {
      "new": true,
      "old": true
    },
    "notfinishedtyping": false,
    "tags": {
      "paneopen": "basic",
      "tagslist": [{
        "tag": ""
      }],
      "operatorslist": []
    },
    "funnel": [],
    "funnelmode": "none",
    "showstarredonly": false,
    "ipaddr": "",
    "country": "",
    "devices": "all",
    "trafficsource": {
      "kind": "all",
      "operator": "is",
      "keyword": ""
    }
  },
  "showcols": {
    "ip": true,
    "seslen": true,
    "pagetitlestart": true,
    "screensize": false,
    "referrer": true,
    "date": true,
    "tags": true
  },
  "atpage": {
    "resultspage": 1,
    "resultsperpage": 10
  }
};

var insp = new InspectletAPI(config.username, config.password, true);

insp.getCaptures(config.siteId, params, function (error, data) {
  console.log(data);
});