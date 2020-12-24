import 'reflect-metadata';
import {writeFileSync} from 'fs';
import {printSchema} from 'graphql';
import {dirname, resolve} from 'path';

import createSchema from './app/Schema/createSchema';

(async () => {
  const outputDirectory = resolve(dirname(__dirname));

  const output = printSchema(await createSchema());
  writeFileSync(resolve(outputDirectory, 'schema.graphql'), output);

  console.log(`New GraphQL schema generated successfully.`);
})();
