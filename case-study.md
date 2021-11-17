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

Попробуем убрать `moment.js`.

![Screenshot](results/after_opt.jpg?raw=true)

Объем `js` снизился практически на мегабайт!
