'use strict';

const express = require('express');
const http = require('http');
const net = require('net');

// The following lines create an express request and an express response
// as they are created in an express server before being passed to the middlewares
// Google use express 4.17.1 to run http cloud function
// https://cloud.google.com/functions/docs/writing/http#http_frameworks
const app = express();

const req = new http.IncomingMessage(new net.Socket());
const expressRequest = Object.assign(req, { app });
Object.setPrototypeOf(expressRequest, express.request);

const res = new http.ServerResponse(req);
const _expressResponse = Object.assign(res, { app, req: expressRequest });
Object.setPrototypeOf(_expressResponse, express.response);

expressRequest.res = _expressResponse;

module.exports = {
  expressRequest,
  expressResponse(endCallback) {
    return Object.assign(_expressResponse, { end: endCallback }); // Override of the end function which is always called to send the response of the http request
  },
};
