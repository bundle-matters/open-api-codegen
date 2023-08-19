# Open Api Code Generator
> Yet another openapi codegen but using https://generator3.swagger.io/api/generate service directly

![Github Action](https://github.com/bundle-matters/open-api-codegen/actions/workflows/ci.yml/badge.svg) [![codecov](https://codecov.io/gh/bundle-matters/open-api-codegen/branch/main/graph/badge.svg?token=ITYULU4YJ3)](https://codecov.io/gh/bundle-matters/open-api-codegen) [![Version](https://img.shields.io/npm/v/open-api-codegen.svg?sanitize=true)](https://www.npmjs.com/package/open-api-codegen) [![Downloads](https://img.shields.io/npm/dm/open-api-codegen.svg?sanitize=true)](https://npmcharts.com/compare/open-api-codegen?minimal=true) [![License](https://img.shields.io/npm/l/open-api-codegen.svg?sanitize=true)](https://www.npmjs.com/package/open-api-codegen)

## Install

```shell
# use npm
npm install open-api-codegen

# use yarn
yarn add open-api-codegen

# use pnpm
pnpm install open-api-codegen
```

## Usage

```js
const { openapiCodegen } = require('open-api-codegen');

openapiCodegen(
  'http://127.0.0.1:8000/openapi.json',
  path.resolve(__dirname, '../src/service/__generated__'),
);

openapiCodegen(
  'http://127.0.0.1:8000/openapi.json',
  path.resolve(__dirname, '../src/service/__generated__'),
  {
    type: 'CLIENT',
    include: '**/*.ts'
  },
);
```

## License

MIT
