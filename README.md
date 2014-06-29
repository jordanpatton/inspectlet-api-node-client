# inspectlet-api-node-client

A node.js wrapper for the Inspectlet API.

## Installation

Install via **npm** (Node Packaged Modules):

    npm install inspectletapi

Install via **git** (hosted on GitHub):

    git clone git@github.com:jordanpatton/inspectlet-api-node-client.git inspectletapi

## Examples

    var InspectletAPI = require('inspectletapi');
    var insp = new InspectletAPI('username', 'password', true);
    insp.getSites(function (error, data) {console.log(data);});
    insp.getCaptures(config.siteId, params, function (error, data) {console.log(data);});
