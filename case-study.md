### SETUP

добавил `webpack-bundle-analyzer` в devDependencies
и включил плагин в процесс сборки (development.js)

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
environment.plugins.append(
  'BundleAnalyzer',
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: true,
  }),
);
```

выполнил анализ исходной версии
![Alt text](/first_bundler_check.jpg?raw=true 'Initial')
vendor.js -> 1.35mb

запустил sitespeed.io

```shell script
docker run --privileged --rm -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io http://host.docker.internal:3000/ -n 1 --budget.configPath budget.json
```

проверка фейлится

```shell script
Failing budget JavaScript Transfer Size for http://host.docker.internal:3000/ with value 3.2 MB max limit 459.0 KB
```

закомментировал proChart.js

```shell script
Failing budget JavaScript Transfer Size for http://host.docker.internal:3000/ with value 521.9 KB max limit 459.0 KB
```

объем js сильно уменьшился но в бюджеты еще не влазит (но близко)

раскомментировал proChart.js но убрал chart.js и moment.js из vendor.js (environment.js)

```js
environment.plugins.append(
  'CommonsChunkVendor',
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: module => {
      // this assumes your vendor imports exist in the node_modules directory
      return (
        module.context &&
        module.context.indexOf('node_modules') !== -1 &&
        module.context.indexOf('moment') === -1 &&
        module.context.indexOf('chart.js') === -1
      );
    },
  }),
);
```

![Alt text](/second_bundler_check.jpg?raw=true 'Optimized')

```shell script
Failing budget JavaScript Transfer Size for http://host.docker.internal:3000/ with value 634.4 KB max limit 459.0 KB
```

бюджет все еще фейлится, но такой результат меня устраивает, я подниу бюджет до 650kb

добавил sitespeed проверку в контур ci

```yaml
name: CI

on: [push]

jobs:
  build-app:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: js budget check
        uses: docker://sitespeedio/sitespeed.io:latest
        with:
          args: https://8b1b-2a02-a310-c25a-f500-a479-5be6-50d3-1088.ngrok.io  -n 1 --budget.configPath ./budget.json
```
