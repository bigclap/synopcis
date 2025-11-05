import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { Faker, en } from '@faker-js/faker';
import jsf from 'json-schema-faker';

const faker = new Faker({ locale: [en] });
jsf.extend('faker', () => faker);

const SWAGGER_JSON_URL = 'http://localhost:3000/api-docs-json';
const MOCK_FILE_PATH = path.resolve(
  __dirname,
  '../../frontend/src/services/api-mocks.json',
);

async function generateMocks() {
  try {
    console.log('Fetching Swagger JSON...');
    const response = await fetch(SWAGGER_JSON_URL);
    const swaggerDoc = await response.json();

    console.log('Generating mocks...');
    const schemas = swaggerDoc.components.schemas;
    const mocks = {};

    for (const schemaName in schemas) {
      if (schemas.hasOwnProperty(schemaName)) {
        const schema = schemas[schemaName];
        const mock = await jsf.resolve(schema);
        mocks[schemaName] = mock;
      }
    }

    console.log(`Writing mocks to ${MOCK_FILE_PATH}...`);
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(mocks, null, 2));

    console.log('Mocks generated successfully.');
  } catch (error) {
    console.error('Error generating mocks:', error);
    process.exit(1);
  }
}

generateMocks();
