# HW6

## 1. Budget

Добавил бюджет, запускаю `sitespeed.io`.
Фейл, как и ожидалось, размер JS `1.1 MB`, `max limit 449.2 KB`.

## 2. Analyze

Запустил сборку с `webpack-bundle-analyzer`, самый большой чанк `proCharts`, в нем больший размер у `moment` и `chart.js`.

## 3. Optimization

`proCharts` подключается только во `views/dashboards/pro`, поэтому можно попробовать исключить из `vendor` `chart.js` и `moment`, добавив условия в параметр `minChunks`.

## 4. Result

Мы уложились в бюджет 460кб, добавим защиту от регрессии с помощью `sitespeed.io` в `CI`.

Со второго раза в бюджет немного не уложился, поэтому поднял бюджет до 500кб.
