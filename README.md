# Overview

OpenTelemetry HTTP Instrumentation allows the user to automatically collect trace data and logs, and export them to Sentry via OTLP (OpenTelemetry Protocol), providing observability to distributed systems.

This is a simple example that demonstrates tracing and logging for HTTP requests from client to server. The example shows key aspects of observability such as:

- Root Span (on Client)
- Child Span (on Client)
- Child Span from a Remote Parent (on Server)
- SpanContext Propagation (from Client to Server)
- Span Events
- Span Attributes
- Structured Logs correlated with Traces

## Installation

```sh
# from this directory
npm install
```

## Configuration

1. Copy the example environment file:

   ```sh
   cp .env.example .env
   ```

2. Edit `.env` and add your Sentry OTLP endpoints:

   - Get these values from: **Sentry Settings > Projects > [Your Project] > Client Keys (DSN)**
   - You'll need both the **OTLP Traces Endpoint** and **OTLP Logs Endpoint**
   - Your `.env` file should look like:

   ```bash
   OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=https://oXXXXX.ingest.us.sentry.io/api/XXXXX/integration/otlp/v1/traces
   OTEL_EXPORTER_OTLP_TRACES_HEADERS=x-sentry-auth=sentry sentry_key=YOUR_PUBLIC_KEY

   OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=https://oXXXXX.ingest.us.sentry.io/api/XXXXX/integration/otlp/v1/logs
   OTEL_EXPORTER_OTLP_LOGS_HEADERS=x-sentry-auth=sentry sentry_key=YOUR_PUBLIC_KEY
   ```

## Run the Application

**Note:** If you have `NODE_OPTIONS` set in your environment, unset it first:

```sh
unset NODE_OPTIONS
```

1. **Start the server** (in one terminal):

   ```sh
   npm run server
   ```

2. **Run the client** (in another terminal):
   ```sh
   npm run client
   ```

The server will output the `traceId` in the terminal (e.g., `traceid: 4815c3d576d930189725f1f1d1bdfcc6`).

## View in Sentry

After running the application, you should see data in Sentry within 30-60 seconds:

- **Traces**: Go to the **Performance** or **Traces** section in your Sentry project
- **Logs**: Go to the **Logs** section in your Sentry project

Traces and logs are correlated by trace ID for complete observability!

## Useful links

- For more information on OpenTelemetry, visit: <https://opentelemetry.io/>
- For more information on OpenTelemetry for Node.js, visit: <https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-sdk-trace-node>

## LICENSE

Apache License 2.0
