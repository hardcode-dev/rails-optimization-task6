# Шаг 1: Зададим бюджет на объем js главной страницы

```json
{
  "budget": {
    "transferSize": {
      "javascript": 460000
    }
  }
}
```

Проверим, выполняется ли он до внесения правок.

```
$ sitespeed.io http://localhost:3000/ -n 1 --budget.configPath budget.json

[2021-11-17 23:14:21] INFO: Failing budget JavaScript Transfer Size for http://localhost:3000/ with value 1.0 MB max limit 449.2 KB
[2021-11-17 23:14:21] INFO: Budget: 0 working, 1 failing tests and 0 errors
```

Как видно из отчета, нет.

# Шаг 2: Проанализируем, что можно убрать

Для этого воспользуемся плагином `webpack-bundle-analyzer`.

![Screenshot](results/before_opt.jpg?raw=true)

Попробуем убрать `moment.js`, закомментировав `proCharts.js`.

![Screenshot](results/after_opt.jpg?raw=true)

Объем `js` снизился практически на мегабайт!

# Шаг 3: Оптимизируем

`proCharts.js` используется только в `/dashboard/pro`, потому его следует убрать из `vendor`, который по умолчанию загружается на каждой странице.
Для этого немного отредактируем настройку чанков в `environment.js`.

После исправления снова запустим проверку `sitespeed.io`.

```
$ sitespeed.io http://localhost:3000/ -n 1 --budget.configPath budget.json

[2021-11-18 00:41:16] INFO: Failing budget JavaScript Transfer Size for http://localhost:3000/ with value 450.3 KB max limit 449.2 KB
[2021-11-18 00:41:16] INFO: Budget: 0 working, 1 failing tests and 0 errors
```

Как видно, мы все равно не укладываемся в бюджет, но на этот раз совсем на немного, потому имеет смысл немного сдвинуть бюджет.

```
$ sitespeed.io http://localhost:3000/ -n 1 --budget.configPath budget.json

[2021-11-18 00:47:19] INFO: Budget: 1 working, 0 failing tests and 0 errors
```

Оптимизацию можно считать успешной.
