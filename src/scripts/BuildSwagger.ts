import fs from "fs";
import yaml from "js-yaml";
import $RefParser from "@apidevtools/json-schema-ref-parser";

const base_yaml: string = "./src/openapi/openapi.yaml";
const output_yaml: string = "./src/openapi/swagger.yaml";

async function baseYMLFile(file: string): Promise<any> {
    try {
      const schema = await $RefParser.dereference(file);
      return schema;
    } catch (error) {
      console.error("Error parsing schema:", error);
    }
  }
  async function getSwaggerYaml(example_set: string, outputPath: string) {
    try {
      const baseYAML = await baseYMLFile(base_yaml);
      const { paths } = baseYAML;
      let hasTrueResult = false; // Flag variable
      let schemaMap: Record<string, any> = {};
    for (const path in paths) {
      const pathSchema =
        paths[path]?.post?.requestBody?.content?.['application/json']?.schema;
      schemaMap[path.substring(1)] = pathSchema;
    }
    }
    catch (error) {
        console.log('Error generating build file', error);
      }
}