## Проблема

Слишком большой объем загружаемого js на домашней странице.

## Бюджет

```
460000 байт
```

## Подготовка

### Step 1

Создал конфигурационный файл для установки бюджета `config/budgets/home.json`

### Step 2

Проверил и убедился что бюджет не соблюдается

```
docker run --privileged --rm --net=host -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io http://localhost:4000/ -n 1 --budget.configPath config/budgets/home.json
...
[2020-09-13 08:57:10] ERROR: Failing budget JavaScript Transfer Size for http://localhost:4000/ with value 1.0 MB max limit 449.2 KB
[2020-09-13 08:57:10] INFO: Budget: 0 working and 1 failing tests
...
```

## Оптимизация

### Step 1

Подключил webpack-bundle-analyzer, и увидел, что moment.js входит в vendor-bundle

### Step 2

Закомментировал файл proCharts.js. moment.js больше не входит в vendor bundle.

И уложились в бюджет

```
docker run --privileged --rm --net=host -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io http://localhost:4000/ -n 1 --budget.configPath config/budgets/home.json
...
[2020-09-13 09:53:41] INFO: Budget: 1 working and 0 failing tests
[2020-09-13 09:53:42] INFO: HTML stored in /sitespeed.io/sitespeed-result/localhost/2020-09-13-09-53-24
```

### Step 3

Раскомментировал файл proCharts.js обратно. Место, где он вызывается - `app/views/dashboards/pro.html.erb`, там же он и подключается. Видимо вебпак при сборке решил включить его в общий бандл, т.к. библиотека chart.js - сторонняя. Чтож, исключим его из общего бандла, добавив этот пакет и его зависимости в исключения через `CommonsChunkPlugin`

Проверки webpack-bundle-analyzer и sitespeed.io прошли успешно

### Настройка CI

Решил попробовать Github Actions. т.к. раньше ими не пользовался. Настройка не такая уж и сложная оказалась

### Результаты

Пощупал github actions. Узнал как можно защищаться от деградации js бандла на CI. Познакомился с webpack-bundle-analyzer
