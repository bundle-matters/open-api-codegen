# Open Api Code Generator

Yet another openapi codegen but using **https://generator3.swagger.io/api/generate** service directly

![Github Action](https://github.com/bundle-matters/openapi-cg/actions/workflows/ci.yml/badge.svg) [![codecov](https://codecov.io/gh/bundle-matters/openapi-cg/branch/main/graph/badge.svg?token=ITYULU4YJ3)](https://codecov.io/gh/bundle-matters/openapi-cg) [![Version](https://img.shields.io/npm/v/openapi-cg.svg?sanitize=true)](https://www.npmjs.com/package/openapi-cg) [![Downloads](https://img.shields.io/npm/dm/openapi-cg.svg?sanitize=true)](https://npmcharts.com/compare/openapi-cg?minimal=true) [![License](https://img.shields.io/npm/l/openapi-cg.svg?sanitize=true)](https://www.npmjs.com/package/openapi-cg)

## Install

```shell
# use npm
npm install openapi-cg

# use yarn
yarn add openapi-cg

# use pnpm
pnpm install openapi-cg
```

## Usage

```js
const { openapiCodegen } = require('openapi-cg');

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
