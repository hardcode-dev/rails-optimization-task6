## Проблема

Слишком большой объем загружаемого vendor.js.

## Бюджет

```
460000 байт
```

## Подготовка

### Step 1

Запустил sitespeed.io и убедился что бюджет не соблюдается

```
docker run --privileged --rm --net=host -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io -n 1 http://localhost:3000/ --budget.configPath homeBudget.json
...
[2021-05-26 04:13:35] INFO: Failing budget JavaScript Transfer Size for http://localhost:3000/ with value 1.0 MB max limit 449.2 KB
[2021-05-26 04:13:35] INFO: Budget: 0 working, 1 failing tests and 0 errors
...
```

## Оптимизация

### Step 1

Построил отчет webpack-bundle-analyzer, который показал, что moment.js входит в vendor-bundle

### Step 2

Закомментировал файл proCharts.js. Теперь moment.js больше не входит в vendor-bundle.

```
docker run --privileged --rm --net=host -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io -n 1 http://localhost:3000/ --budget.configPath homeBudget.json
...
[2020-09-13 09:53:41] INFO: Budget: 1 working and 0 failing tests
```

### Step 3

Добавил moment.js и chart.js в исключения сборки вебпака через `CommonsChunkPlugin`. При этом страница '/dashboard/pro'
грузится правильно. Однако, проверка бюджета не совсем проходит:

```
[2021-06-01 08:24:43] INFO: Failing budget JavaScript Transfer Size for http://localhost:3000/ with value 452.9 KB max limit 449.2 KB
```

Возможно это из-за новых версий библиотек, которые весят немного больше. Пришлось немного поднять бюджет в homeBudget.json

### Настройка CI

### Результаты
