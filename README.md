# Ternion OPC Link Client CLI

A TypeScript Node.js CLI application for interacting with OPC-UA servers via the QNetLinks OPC REST API, powered by `@ternion/opc-link-client`.

## Prerequisites

- **Node.js 18+** (required for native `fetch` API)
- **QNetLinks OPC REST API** running at `http://localhost:9990` (default, configurable via `API_BASE_URL`)

## Docker Setup

To run the OPC-UA server and REST API using Docker, use the following command:


```bash
docker run -d --name opc-ua-server -p 9999:9999 -p 9990:9990 -p 3100:3100 drsanti/qnetlinks-opc-server
```

**Or using Docker Compose:**

```bash
docker-compose up -d
```

This will start the OPC-UA server and REST API in a Docker container with the following ports exposed:

- **Port 9999** - OPC-UA server
- **Port 9990** - REST API / WebSocket (default API endpoint: `http://localhost:9990/opc/api/v1`)
- **Port 3100** - Example REST client port

To stop the container:
```bash
docker-compose down
```

## Installation

```bash
npm install
npm install @ternion/opc-link-client
```

The application uses `@ternion/opc-link-client` version `^0.1.2` from npm, which includes convenience read methods for channels and vectors, plus improved type safety with proper TypeScript return types.

## Usage

### Run the application

```bash
npm start
```

### Run in watch mode (auto-reload on changes)

```bash
npm run dev
```

### Type check without running

```bash
npm run type-check
```

### Build TypeScript to JavaScript

```bash
npm run build
```

## Configuration

You can customize the API base URL by setting the `API_BASE_URL` environment variable:

**Unix/Linux/Mac (bash):**
```bash
API_BASE_URL=http://your-api-host:port/opc/api/v1 npm start
```

**Windows (PowerShell):**
```powershell
$env:API_BASE_URL="http://your-api-host:port/opc/api/v1"; npm start
```

**Windows (CMD):**
```cmd
set API_BASE_URL=http://your-api-host:port/opc/api/v1 && npm start
```

## Library Usage

This section explains how to use the `@ternion/opc-link-client` library functions.

### Importing the Library

```typescript
import { TernionOpcLinkClient } from "@ternion/opc-link-client";
```

For enhanced type safety, you can also import the response types:

```typescript
import {
  TernionOpcLinkClient,
  type ApiInfo,
  type HealthStatus,
  type NodeValue,
  type AliasCollection,
  type WriteResponse,
} from "@ternion/opc-link-client";
```

### Creating a Client Instance

```typescript
// Use default URL (http://localhost:9990/opc/api/v1)
const client = new TernionOpcLinkClient();

// Or specify a custom API URL
const client = new TernionOpcLinkClient("http://your-api-host:port/opc/api/v1");
```

### Information & Health Methods

#### Get API Information
```typescript
const apiInfo: ApiInfo = await client.getApiInfo();
console.log(apiInfo);
```

#### Get Health Status
```typescript
const health: HealthStatus = await client.getHealth();
console.log(health);
```

### Reading Values

#### Get All Cached Values
```typescript
const allValues: NodeValue[] = await client.getValues();
console.log(allValues);
console.log(`Total nodes: ${allValues.length}`);
```

#### Get Value by Node ID
```typescript
const value: NodeValue = await client.getValue("ns=1;s=Boolean.0");
console.log(value);
console.log(`Value: ${value.value}, Status: ${value.statusCode}`);
```

#### Read Node with Force Refresh
```typescript
const freshValue: NodeValue = await client.readNode({
  nodeId: "ns=1;s=Boolean.0",
  forceRefresh: true, // Bypass cache and read fresh value
});
console.log(freshValue);
console.log(`Updated at: ${freshValue.updatedAt}`);
```

#### Convenience Read Methods for Channels
```typescript
// Read Boolean channel
const boolValue: NodeValue = await client.readBoolean(0);
const boolValueFresh: NodeValue = await client.readBoolean(0, true); // force refresh
console.log(`Boolean value: ${boolValue.value}`);

// Read Int16 channel
const int16Value: NodeValue = await client.readInt16(1);
const int16ValueFresh: NodeValue = await client.readInt16(1, true); // force refresh
console.log(`Int16 value: ${int16Value.value}`);

// Read Float channel
const floatValue: NodeValue = await client.readFloat(2);
const floatValueFresh: NodeValue = await client.readFloat(2, true); // force refresh
console.log(`Float value: ${floatValue.value}`);
```

#### Convenience Read Methods for Vectors
```typescript
// Read BooleanVector node
const boolVector: NodeValue = await client.readBooleanVector();
const boolVectorFresh: NodeValue = await client.readBooleanVector(true); // force refresh
console.log(`BooleanVector dataType: ${boolVector.dataType}`);

// Read Int16Vector node
const int16Vector: NodeValue = await client.readInt16Vector();
const int16VectorFresh: NodeValue = await client.readInt16Vector(true); // force refresh
console.log(`Int16Vector dataType: ${int16Vector.dataType}`);

// Read FloatVector node
const floatVector: NodeValue = await client.readFloatVector();
const floatVectorFresh: NodeValue = await client.readFloatVector(true); // force refresh
console.log(`FloatVector dataType: ${floatVector.dataType}`);
```

### Alias Operations

#### Get Value by Alias
```typescript
// Read channel 0 of bool type
const boolValue: NodeValue = await client.getAlias("bool", 0);
console.log(`Value: ${boolValue.value}, DataType: ${boolValue.dataType}`);

// Read channel 1 of int16 type
const int16Value: NodeValue = await client.getAlias("int16", 1);
console.log(`Value: ${int16Value.value}`);

// Read channel 2 of float type
const floatValue: NodeValue = await client.getAlias("float", 2);
console.log(`Value: ${floatValue.value}`);
```

#### Get All Aliases of a Type
```typescript
// Get all boolean aliases
const allBools: AliasCollection = await client.getAllAliases("bool");
console.log(`Found ${allBools.length} boolean channels`);

// Get all int16 aliases
const allInt16s: AliasCollection = await client.getAllAliases("int16");
console.log(`Found ${allInt16s.length} int16 channels`);

// Get all float aliases
const allFloats: AliasCollection = await client.getAllAliases("float");
console.log(`Found ${allFloats.length} float channels`);
```

**Note:** Valid alias types are `"bool"`, `"int16"`, and `"float"`.

### Writing Values

#### Write Boolean Value
```typescript
// Write true to Boolean.0 (channel 0)
const result: WriteResponse = await client.writeBoolean(0, true);
console.log(`Status: ${result.status}, Written value: ${result.result.value}`);
```

#### Write Int16 Value
```typescript
// Write 42 to Int16.1 (channel 1)
// Valid range: -32768 to 32767
const result: WriteResponse = await client.writeInt16(1, 42);
console.log(`Status: ${result.status}, Written value: ${result.result.value}`);
```

#### Write Float Value
```typescript
// Write 3.14159 to Float.2 (channel 2)
const result: WriteResponse = await client.writeFloat(2, 3.14159);
console.log(`Status: ${result.status}, Written value: ${result.result.value}`);
```

#### Write Using Generic Method
```typescript
// Write to a custom node
const result: WriteResponse = await client.writeNode({
  nodeId: "ns=1;s=CustomNode",
  dataType: "Boolean", // or "Int16", "Float", or custom type
  value: true,
  refreshCache: true, // Optional: refresh cache after write
});
console.log(`Status: ${result.status}, Node: ${result.nodeId}`);
```

### Error Handling

All methods throw errors on failure. Always wrap calls in try-catch:

```typescript
try {
  await client.writeBoolean(0, true);
  const value = await client.getAlias("bool", 0);
  console.log("Success:", value);
} catch (error) {
  console.error("Operation failed:", error);
  // Handle error appropriately
}
```

### Complete Example

```typescript
import {
  TernionOpcLinkClient,
  type HealthStatus,
  type NodeValue,
  type WriteResponse,
} from "@ternion/opc-link-client";

async function example() {
  const client = new TernionOpcLinkClient();

  try {
    // Check API health
    const health: HealthStatus = await client.getHealth();
    console.log("API Health:", health);

    // Read all cached values
    const values: NodeValue[] = await client.getValues();
    console.log(`Total nodes cached: ${values.length}`);

    // Read by alias
    const boolValue: NodeValue = await client.getAlias("bool", 0);
    console.log(`Boolean 0: ${boolValue.value}`);

    // Write values
    const writeBool: WriteResponse = await client.writeBoolean(0, true);
    console.log(`Write status: ${writeBool.status}`);

    const writeInt16: WriteResponse = await client.writeInt16(1, 42);
    console.log(`Write status: ${writeInt16.status}`);

    const writeFloat: WriteResponse = await client.writeFloat(2, 3.14159);
    console.log(`Write status: ${writeFloat.status}`);

    // Read back the written values
    const writtenBool: NodeValue = await client.getAlias("bool", 0);
    console.log(`Written Boolean value: ${writtenBool.value}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

example();
```

## What it does

The application demonstrates various operations:

1. **API Information** - Get API metadata
2. **Health Check** - Check API health status
3. **Read Operations** - Read cached values and specific nodes
4. **Alias Operations** - Read values by alias (bool, int16, float)
5. **Node Read Operations** - Read specific nodes with force refresh
6. **Write Operations** - Write Boolean, Int16, and Float values

## Error Handling

The application includes comprehensive error handling. If the API is not available or nodes don't exist, the application will gracefully handle errors and continue with other operations.

## Type Safety

The `@ternion/opc-link-client` library (v0.1.2+) provides full TypeScript type safety with proper return types:

- `getApiInfo()` returns `Promise<ApiInfo>`
- `getHealth()` returns `Promise<HealthStatus>`
- `getValues()` returns `Promise<NodeValue[]>`
- `getValue()`, `getAlias()`, `readNode()`, and all convenience read methods return `Promise<NodeValue>`
- `getAllAliases()` returns `Promise<AliasCollection>` (which is `NodeValue[]`)
- All write methods return `Promise<WriteResponse>`

This provides better IDE autocomplete, compile-time error checking, and improved developer experience.

## License

MIT

