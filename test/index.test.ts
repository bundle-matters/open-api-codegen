import { expect, describe, it } from 'vitest';
import path from 'path';
import fs from 'fs';
import { openapiCodegen } from '../src';

describe('test cases', () => {
  it('local json', async () => {
    const outputDir = path.resolve(__dirname, './fixtures/output/local');
    await openapiCodegen(
      './test/fixtures/openapi.json',
      outputDir,
      {
        include: '**/*.ts',
        type: 'CLIENT',
      },
    );
    expect(fs.existsSync(
      path.resolve(outputDir, '.swagger-codegen/VERSION'),
    )).toBe(false);
    expect(fs.existsSync(
      path.resolve(outputDir, 'index.ts'),
    )).toBe(true);

    expect(fs.existsSync(
      path.resolve(outputDir, 'api.ts'),
    )).toBe(true);

    expect(fs.existsSync(
      path.resolve(outputDir, 'models/index.ts'),
    )).toBe(true);
  });

  it('remote josn', async () => {
    const outputDir = path.resolve(__dirname, './fixtures/output/remote');
    await openapiCodegen(
      'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/api-with-examples.json',
      outputDir,
    );

    expect(fs.existsSync(
      path.resolve(outputDir, '.swagger-codegen/VERSION'),
    )).toBe(true);

    expect(fs.existsSync(
      path.resolve(outputDir, 'index.ts'),
    )).toBe(true);

    expect(fs.existsSync(
      path.resolve(outputDir, 'api.ts'),
    )).toBe(true);

    expect(fs.existsSync(
      path.resolve(outputDir, 'models/index.ts'),
    )).toBe(true);
  });
});
