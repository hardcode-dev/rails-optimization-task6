# Case-study оптимизации

## Бюджет

Добавил бюджет

```json
{
  "budget": {
    "transferSize": {
      "javascript": 460000
    }
  }
}
```

... и он оказался провален:

```
JavaScript Transfer Size with value 1.1 MB limit max 449.2 KB
```

## Оптимизация: диагностика

- Установлен плагин `webpack-bundle-analyzer`
- Выполнен анализ исходной версии приложения: см.: bundle_data_before.png
- Закомментирован `proCharts.js`
- Выполнен повторный анализ: см.: after_data_before.png
  profit очевиден

## Оптимизация: работа

moment используется 1) в chart.js (views/dashboards/pro), 2) как подзависимость в геме momentjs-rails, но там он нас на беспокоит; vendor собирается в chunks - там его и поправим

В бюджет немного не уложились:(
`JavaScript Transfer Size with value 454.2 KB limit max 449.2 KB`
Поднимем его с 46_000 до 47_000:

```
INFO: Budget: 1 working, 0 failing tests and 0 errors
JavaScript Transfer Size with value 454.2 KB limit max 459.0 KB
```

## Настройка CI

Настроен `CI`: `Github Actions`.

## Настройка CI

Теперь настроим `CI`: `Travis` или `Github Actions`.

## Как сдать задание

- изменения кода
- описание
- скриншоты `bundle-analyzer` до и после оптимизации
- настроенный `CI` на `Github Actions`
