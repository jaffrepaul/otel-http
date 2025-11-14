'use strict';

const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { LoggerProvider, BatchLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

module.exports = (serviceName) => {
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
  });

  // Setup trace exporter
  const traceExporter = new OTLPTraceExporter();
  const traceProvider = new NodeTracerProvider({
    resource: resource,
    spanProcessors: [new SimpleSpanProcessor(traceExporter)]
  });

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  traceProvider.register();

  // Setup log exporter
  const logExporter = new OTLPLogExporter();
  const loggerProvider = new LoggerProvider({
    resource: resource,
    processors: [new BatchLogRecordProcessor(logExporter)],
  });
  
  // Make logger globally available
  global.logger = loggerProvider.getLogger('default', '1.0.0');

  registerInstrumentations({
    // // when boostraping with lerna for testing purposes
    instrumentations: [
      new HttpInstrumentation(),
    ],
  });

  return opentelemetry.trace.getTracer('http-example');
};
