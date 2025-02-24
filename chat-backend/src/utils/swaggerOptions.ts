import swaggerJsDoc from "npm:swagger-jsdoc";
import { dirname, join, fromFileUrl } from "jsr:@std/path";

/**
 * current directory of this file
 * @author Sriram Sundar
 *
 * @type {string}
 */
const __dirname: string = dirname(fromFileUrl(import.meta.url));

/**
 * port number to use in the examples for the docs
 * @author Sriram Sundar
 *
 * @type {number}
 */
const PORT: number = 3000;

/**
 * Swagger configuration options
 * @author Sriram Sundar
 *
 * @type {swaggerJsDoc.Options}
 */
const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LiMedAi API Documentation",
      version: "1.0.7",
      description: "API documentation for LiMedAi server for reference",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server example",
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"],
};

/**
 * Generate OpenAPI Specification
 * @author Sriram Sundar
 *
 * @type {object}
 */
const specs: object = swaggerJsDoc(swaggerOptions);

console.log("Swagger Options:", swaggerOptions);

/**
 * output path for the JSON file of the OpenAPI specification
 * @author Sriram Sundar
 *
 * @type {string}
 */
const jsonOutputPath: string = join(__dirname, "../docs/openapi.json");

// Write OpenAPI JSON specification to file synchronously
Deno.writeTextFileSync(jsonOutputPath, JSON.stringify(specs, null, 2));

console.log(
  "OpenAPI specification generated in JSON format at:",
  jsonOutputPath
);

export default specs;
