# Задание №6

## Оптимизация загрузки js на dev.to и настройка `CI`

На всех страницах `dev.to` загружается файл `vendor.js`.

Анализ показывает, что этот файл содержит библиотеку `moment.js`, печально известную своим большим размером.

## Бюджет

Начал с того, что задался бюджетом на объём `js` на главной странице.

Создал бюджет для `sitespeed.io` Для этого добавил файл `homeBudget.json` в корень проекта со след. содержанием:

```json
{
  "budget": {
    "transferSize": {
      "javascript": 460000
    }
  }
}
```

Введя команду

```bash
docker run --privileged --rm -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io http://host.docker.internal:3000/ -n 1 --budget.configPath homeBudget.json
```

убедился, что бюджет пока не соблюдается:

```bash
[2021-09-17 17:49:22] INFO: Failing budget JavaScript Transfer Size for http://host.docker.internal:3000/ with value 1.0 MB max limit 449.2 KB
[2021-09-17 17:49:22] INFO: Budget: 0 working, 1 failing tests and 0 errors
```

## Идея оптимизации

- Включил в процесс сборки `webpack` плагин `webpack-bundle-analyzer`
- Выполнил анализ исходной версии приложения с помощью `webpack-bundle-analyzer`
- Убедился, что `moment.js` входит в сборку `vendor`
- ![image](cs_docs/moment.png)

- Закомментируйте всё содержимое файла `proCharts.js`
- Выполните анализ изменённой версии в `webpack-bundle-analyzer`
- profit

## Cleanup

Разберитесь, в каком месте приложения код `moment.js` реально используется и подключите его только там.

## Защита от деградации

Мы сократили объём загружаемого `js` на большинстве страниц сайта!

Теперь проверка бюджета на главной странице должна пройти успешно!

## Настройка CI

Теперь настроим `CI`: `Travis` или `Github Actions`.

Шаги:

- выставить текущую версию приложения в интернет с помощью `ngrok`
- запушить урл `ngrok` в конфиг `CI` в `github` и тем самым триггернуть билд
- билд должен проверять ваше приложение по урлу `ngrok` с помощью `sitespeed.io` на соблюдение бюджета
- после проверки `ngrok` можно выключать

## Как сдать задание

Сделать `PR` в этот репозиторий, содержащий:

- изменения кода
- описание
- скриншоты `bundle-analyzer` до и после оптимизации
- настроенный `CI` на `Travis` или `Github Actions`
