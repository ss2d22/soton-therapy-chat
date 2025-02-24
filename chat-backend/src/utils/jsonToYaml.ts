import { dirname, join, fromFileUrl } from "jsr:@std/path";
import { stringify } from "jsr:@std/yaml";

/**
 * current directory
 * @author Sriram Sundar
 *
 * @type {string}
 */
const __dirname: string = dirname(fromFileUrl(import.meta.url));

/**
 * json file path relative to the script location
 * @author Sriram Sundar
 *
 * @type {string}
 */
const jsonFilePath: string = join(__dirname, "../docs/openapi.json");

/**
 * yaml file path relative to the script location
 * @author Sriram Sundar
 *
 * @type {string}
 */
const yamlFilePath: string = join(__dirname, "../docs/openapi.yml");

try {
  // Read and parse JSON file
  const jsonSpec: string = await Deno.readTextFile(jsonFilePath);
  const jsonObject: object = JSON.parse(jsonSpec);

  // Convert JSON to YAML and write to file
  const yamlSpec: string = stringify(jsonObject);
  await Deno.writeTextFile(yamlFilePath, yamlSpec);

  console.log(
    "OpenAPI specification converted to YAML format at:",
    yamlFilePath
  );
} catch (error) {
  console.error("Error processing files:", error);
}
