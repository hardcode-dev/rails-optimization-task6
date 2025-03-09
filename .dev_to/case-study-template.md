# Case-study оптимизации

## Актуальная проблема
В проекте `dev.to` есть определенная проблема. Анализ показывает, что на всех страницах загружается файл `vendor.js`. 

Этот файл содержит библиотеку moment.js, печально известную своим большим размером.

У нас уже была программа на `ruby`, которая умела делать нужную обработку.

## Формирование метрики
В качестве метрики берем объём `js` на главной странице.

В файле `homeBudget.json` устанавливаем бюджет в 460000 байт.

## Анализ
С помощью `sitespeed.io` убеждаемся, что бюджет пока не соблюдается:
`docker run --privileged --rm -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io http://host.docker.internal:3000/ -n 1 --budget.configPath homeBudget.json`

![sitespeed_before.png](/public/reports/sitespeed_before.png)

С помощью `webpack-bundle-analyzer` убедился, что `moment.js` входит в сборку `vendor`:

![bundle_analyze_before.png](/public/reports/bundle_analyze_before.png)

Закомментировал содержимое файла `proCharts.js`. `web-bundle-analyzer` показал что `moment` пропал из `vendor`:

![bundle_analyze_after.png](/public/reports/bundle_analyze_after.png)


## Оптимизация
В первую очередь я раскомментировал содержимое файла `proCharts.js`.

Проанализировав отчеты и код проекта я выяснил что `proCharts.js` использует `chart.js`, которая, в свою очередь, внутри использует `moment.js`.
Поэтому `moment` попадает в `vendor` вместе с `chart.js`, и они оказываются связанными.

В качестве оптимизации отредактировал `CommonsChunkPlugin` в `environment.js` путём исключения `chart.js` и `moment.js` из `vendor` сборки.
Этим мы можем гарантировать что теперь они будут подключаться только там, где непосредственно используются.
```
!module.context.includes('chart.js') && !module.context.includes('moment')
```
С помощью `web-bundle-analyzer` убедился, что это сработало:

![bundle_analyze_after_optimization.png](/public/reports/bundle_analyze_after_optimization.png)

Однако `sitespeed.io` показал что бюджет еще не выполнен:
![sitespeed_after.png](/public/reports/sitespeed_after.png)

В `webpack-bundle-analyzer` заметил, что в `vendor` остались 2 зависимости `chartjs-color` и `chartjs-color-string`. Поэтому их также исключил из `vendor`.

Теперь бюджет выполняется:
![sitespeed_finish.png](/public/reports/sitespeed_finish.png)

## CI
Защитил оптимизацию, настроив CI Github Actions:
https://github.com/alexrails/rails-optimization-task6/actions/runs/13750720227