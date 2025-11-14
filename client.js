'use strict';

const api = require('@opentelemetry/api');
const tracer = require('./tracer')('example-http-client');
const http = require('http');

/** A function which makes requests and handles response. */
function makeRequest() {
  // span corresponds to outgoing requests. Here, we have manually created
  // the span, which is created to track work that happens outside of the
  // request lifecycle entirely.
  tracer.startActiveSpan('makeRequest', (span) => {
    // Log the outgoing request
    global.logger.emit({
      severityText: 'INFO',
      body: 'Making HTTP request to server',
      attributes: { host: 'localhost', port: 8080, path: '/helloworld' }
    });
    
    http.get({
      host: 'localhost',
      port: 8080,
      path: '/helloworld',
    }, (response) => {
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        console.log(body.toString());
        
        // Log the response
        global.logger.emit({
          severityText: 'INFO',
          body: 'Received response from server',
          attributes: { statusCode: response.statusCode, responseBody: body.toString() }
        });
        
        span.end();
      });
    });
  });

  // The process must live for at least the interval past any traces that
  // must be exported, or some risk being lost if they are recorded after the
  // last export.
  console.log('Sleeping 5 seconds before shutdown to ensure all records are flushed.');
  setTimeout(() => { console.log('Completed.'); }, 5000);
}

makeRequest();
