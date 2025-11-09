/**
 * Main application entry point for testing @ternion/opc-link-client
 *
 * This application demonstrates how to use the TernionOpcLinkClient library
 * to interact with the QNetLinks OPC REST API.
 *
 * Requirements:
 * - QNetLinks OPC REST API running at http://localhost:9990 (default)
 * - Or set API_BASE_URL environment variable to customize the API URL
 */

import { TernionOpcLinkClient } from "@ternion/opc-link-client";

async function main(): Promise<void> {
  // Get API base URL from environment or use default
  const apiBaseUrl =
    process.env.API_BASE_URL || "http://localhost:9990/opc/api/v1";
  const client = new TernionOpcLinkClient(apiBaseUrl);

  console.log("=== Ternion OPC Link Client Test Application ===\n");
  console.log(`Using API URL: ${apiBaseUrl}\n`);

  try {
    // Test API information and health
    console.log("1. Testing API Information...");
    const apiInfo = await client.getApiInfo();
    console.log("   API Info:", apiInfo);

    console.log("\n2. Testing Health Check...");
    const health = await client.getHealth();
    console.log("   Health:", health);

    // Test reading values
    console.log("\n3. Testing Read Operations...");
    const allValues = await client.getValues();
    console.log("   All cached values:", allValues);

    // Test reading by alias
    console.log("\n4. Testing Alias Operations...");
    try {
      const boolAlias = await client.getAlias("bool", 0);
      console.log("   Boolean alias 0:", boolAlias);
    } catch (error) {
      console.log("   Boolean alias 0: Not available");
    }

    try {
      const allBools = await client.getAllAliases("bool");
      console.log("   All boolean aliases:", allBools);
    } catch (error) {
      console.log("   All boolean aliases: Not available");
    }

    // Test reading specific node
    console.log("\n5. Testing Node Read Operations...");
    try {
      const nodeValue = await client.readNode({
        nodeId: "ns=1;s=Boolean.0",
        forceRefresh: true,
      });
      console.log("   Read Boolean.0 (generic readNode):", nodeValue);
    } catch (error) {
      console.log("   Read Boolean.0: Node not available");
    }

    try {
      const cachedValue = await client.getValue("ns=1;s=Float.2");
      console.log("   Cached Float.2:", cachedValue);
    } catch (error) {
      console.log("   Cached Float.2: Node not available");
    }

    // Test convenience read methods for channels
    console.log("\n6. Testing Convenience Read Methods (Channels)...");
    try {
      const boolValue = await client.readBoolean(0);
      console.log("   Read Boolean.0 (convenience):", boolValue);
    } catch (error) {
      console.log("   Read Boolean.0: Not available");
    }

    try {
      const int16Value = await client.readInt16(1, true); // force refresh
      console.log("   Read Int16.1 (force refresh):", int16Value);
    } catch (error) {
      console.log("   Read Int16.1: Not available");
    }

    try {
      const floatValue = await client.readFloat(2);
      console.log("   Read Float.2 (convenience):", floatValue);
    } catch (error) {
      console.log("   Read Float.2: Not available");
    }

    // Test convenience read methods for vectors
    console.log("\n7. Testing Convenience Read Methods (Vectors)...");
    try {
      const boolVector = await client.readBooleanVector();
      console.log("   Read BooleanVector:", boolVector);
    } catch (error) {
      console.log("   Read BooleanVector: Not available");
    }

    try {
      const int16Vector = await client.readInt16Vector(true); // force refresh
      console.log("   Read Int16Vector (force refresh):", int16Vector);
    } catch (error) {
      console.log("   Read Int16Vector: Not available");
    }

    try {
      const floatVector = await client.readFloatVector();
      console.log("   Read FloatVector:", floatVector);
    } catch (error) {
      console.log("   Read FloatVector: Not available");
    }

    // Test writing values
    console.log("\n8. Testing Write Operations...");
    try {
      const writeBool = await client.writeBoolean(0, true);
      console.log("   Write Boolean.0:", writeBool);
    } catch (error) {
      console.log(
        "   Write Boolean.0: Failed -",
        error instanceof Error ? error.message : error
      );
    }

    try {
      const writeInt16 = await client.writeInt16(1, 42);
      console.log("   Write Int16.1:", writeInt16);
    } catch (error) {
      console.log(
        "   Write Int16.1: Failed -",
        error instanceof Error ? error.message : error
      );
    }

    try {
      const writeFloat = await client.writeFloat(2, 3.14159);
      console.log("   Write Float.2:", writeFloat);
    } catch (error) {
      console.log(
        "   Write Float.2: Failed -",
        error instanceof Error ? error.message : error
      );
    }

    console.log("\n=== Test Application Completed Successfully ===");
  } catch (error) {
    console.error("\n=== Application Error ===");
    console.error("Error:", error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) {
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

// Run the application
main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
