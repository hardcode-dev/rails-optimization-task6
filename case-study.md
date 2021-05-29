# Задание №6

## Оптимизация загрузки js на dev.to . Задача

На всех страницах `dev.to` загружается файл `vendor.js`.

Анализ показывает, что этот файл содержит библиотеку `moment.js`, печально известную своим большим размером.

### Бюджет

Давайте начнём с того, что зададимся бюджетом на объём `js` на главной странице.

Создайте бюджет для `sitespeed.io`

```json
{
  "budget": {
    "transferSize": {
      "javascript": 460000
    }
  }
}
```

Убедитесь, что бюджет пока не соблюдается:

```bash
docker run --privileged --rm -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io http://host.docker.internal:3000/ -n 1 --budget.configPath homeBudget.json
```

### Идея оптимизации

- Включите в процесс сборки `webpack` плагин `webpack-bundle-analyzer`
- Выполните анализ исходной версии приложения с помощью `webpack-bundle-analyzer`
- убедитесь, что `moment.js` входит в сборку `vendor`
- Закомментируйте всё содержимое файла `proCharts.js`
- Выполните анализ изменённой версии в `webpack-bundle-analyzer`
- profit

### Cleanup

Разберитесь, в каком месте приложения код `moment.js` реально используется и подключите его только там.

### Защита от деградации

Мы сократили объём загружаемого `js` на большинстве страниц сайта!

Теперь проверка бюджета на главной странице должна пройти успешно!

## Оптимизация загрузки js на dev.to . Решение

### Этап №1

Проверяем начальное состояние приложения. 

Объем загружаемых js-библиотек многократно превышает бюджет.

```bash
$ sitespeed.io http://localhost:3000/ --budget.configPath myBudget.json -b chrome
[2021-05-29 15:49:00] INFO: Versions OS: linux 5.8.0-53-generic nodejs: v10.24.1 sitespeed.io: 17.6.0 browsertime: 12.7.0 coach: 6.3.3
[2021-05-29 15:49:00] INFO: Running tests using Chrome - 3 iteration(s)
[2021-05-29 15:49:01] INFO: Testing url http://localhost:3000/ iteration 1
[2021-05-29 15:49:15] INFO: http://localhost:3000/ TTFB: 1.17s DOMContentLoaded: 2.75s firstPaint: 2.20s FCP: 2.20s LCP: 2.66s Load: 3.22s TBT: 300ms CLS:0.0000
[2021-05-29 15:49:16] INFO: Testing url http://localhost:3000/ iteration 2
[2021-05-29 15:49:30] INFO: http://localhost:3000/ TTFB: 844ms DOMContentLoaded: 2.34s firstPaint: 1.87s FCP: 1.87s LCP: 4.24s Load: 4.25s TBT: 345ms CLS:0.0000
[2021-05-29 15:49:32] INFO: Testing url http://localhost:3000/ iteration 3
[2021-05-29 15:49:45] INFO: http://localhost:3000/ TTFB: 892ms DOMContentLoaded: 2.43s firstPaint: 1.88s FCP: 1.88s LCP: 2.69s Load: 3.00s TBT: 254ms CLS:0.0000
[2021-05-29 15:49:45] INFO: http://localhost:3000/ 50 requests, TTFB: 969ms (σ144.00ms), firstPaint: 1.98s (σ154.00ms), FCP: 1.98s (σ154.00ms), DOMContentLoaded: 2.50s (σ175.00ms), LCP: 3.20s (σ740.00ms), CLS: 0 (σ0.00), TBT: 300ms (σ37.00ms), Load: 3.49s (σ544.00ms) (3 runs)
[2021-05-29 15:49:45] INFO: Failing budget JavaScript Transfer Size for http://localhost:3000/ with value 3.6 MB max limit 449.2 KB
[2021-05-29 15:49:45] INFO: Budget: 0 working, 1 failing tests and 0 errors
[2021-05-29 15:49:49] INFO: HTML stored in /home/dekan/Work/Ruby/rails-optimization-examples/rails-optimization-task6/sitespeed-result/localhost/2021-05-29-15-49-00
```
![webpack-bundle-analyzer.1](https://github.com/rubygitflow/rails-optimization-task6/raw/profiler6/statistics_report/webpack-bundle-analyzer.1.png)

### Этап №2

Проверяем удаление из приложения js-библиотеки `proCharts.js`. 

Объем загружаемых js-библиотек сократился в 6 раз.

```bash
$ sitespeed.io http://localhost:3000/ --budget.configPath myBudget.json -b chrome
[2021-05-29 20:25:16] INFO: Versions OS: linux 5.8.0-53-generic nodejs: v10.24.1 sitespeed.io: 17.6.0 browsertime: 12.7.0 coach: 6.3.3
[2021-05-29 20:25:17] INFO: Running tests using Chrome - 3 iteration(s)
[2021-05-29 20:25:21] INFO: Testing url http://localhost:3000/ iteration 1
[2021-05-29 20:27:21] INFO: http://localhost:3000/ TTFB: 71.92s DOMContentLoaded: 101.70s firstPaint: 76.37s FCP: 76.37s LCP: 76.36s Load: 103.54s TBT: 1.90s CLS:0.0000
[2021-05-29 20:27:25] INFO: Testing url http://localhost:3000/ iteration 2
[2021-05-29 20:28:19] INFO: http://localhost:3000/ TTFB: 29.85s DOMContentLoaded: 35.07s firstPaint: 33.56s FCP: 33.56s LCP: 33.51s Load: 37.15s TBT: 1.49s CLS:0.0000
[2021-05-29 20:28:23] INFO: Testing url http://localhost:3000/ iteration 3
[2021-05-29 20:28:51] INFO: http://localhost:3000/ TTFB: 4.15s DOMContentLoaded: 9.18s firstPaint: 8.25s FCP: 8.25s LCP: 7.73s Load: 11.36s TBT: 540ms CLS:0.0000
[2021-05-29 20:28:51] INFO: http://localhost:3000/ 65 requests, TTFB: 35.31s (σ27.94s), firstPaint: 39.39s (σ28.11s), FCP: 39.39s (σ28.11s), DOMContentLoaded: 48.65s (σ38.97s), LCP: 39.20s (σ28.30s), CLS: 0 (σ0.00), TBT: 1.31s (σ570.00ms), Load: 50.68s (σ38.83s) (3 runs)
[2021-05-29 20:28:54] INFO: Failing budget JavaScript Transfer Size for http://localhost:3000/ with value 607.4 KB max limit 449.2 KB
[2021-05-29 20:28:54] INFO: Budget: 0 working, 1 failing tests and 0 errors
[2021-05-29 20:29:11] INFO: HTML stored in /home/dekan/Work/Ruby/rails-optimization-examples/rails-optimization-task6/sitespeed-result/localhost/2021-05-29-20-25-16
```
![webpack-bundle-analyzer.2](https://github.com/rubygitflow/rails-optimization-task6/raw/profiler6/statistics_report/webpack-bundle-analyzer.2.png)

### Этап №3

Библиотека moment.js напрямую не вызывается из приложения, но используется в нескольких библиотеках. Это: 
- Rxjs (напрямую из приложения не вызывается)
- codemirror (напрямую вызывается из chat, article-form)
- ещё несколько компонентов react приложения.

Ещё одна библиотека proCharts вызывается только  из app/views/dashboards/pro.html.erb

После отключения js библиотек имеем следующее. 

Бюджет еще не достигнут

```bash
$ sitespeed.io http://localhost:3000/ --budget.configPath myBudget.json -b chrome
[2021-05-29 23:07:04] INFO: Versions OS: linux 5.8.0-53-generic nodejs: v10.24.1 sitespeed.io: 17.6.0 browsertime: 12.7.0 coach: 6.3.3
[2021-05-29 23:07:04] INFO: Running tests using Chrome - 3 iteration(s)
[2021-05-29 23:07:08] INFO: Testing url http://localhost:3000/ iteration 1
[2021-05-29 23:08:10] INFO: http://localhost:3000/ TTFB: 36.37s DOMContentLoaded: 42.29s firstPaint: 39.81s FCP: 39.81s LCP: 40.02s Load: 44.08s TBT: 2.40s CLS:0.0000
[2021-05-29 23:08:13] INFO: Testing url http://localhost:3000/ iteration 2
[2021-05-29 23:08:41] INFO: http://localhost:3000/ TTFB: 3.67s DOMContentLoaded: 9.08s firstPaint: 7.24s FCP: 7.24s LCP: 7.47s Load: 10.82s TBT: 1.87s CLS:0.0000
[2021-05-29 23:08:45] INFO: Testing url http://localhost:3000/ iteration 3
[2021-05-29 23:09:38] INFO: http://localhost:3000/ TTFB: 30.04s DOMContentLoaded: 35.60s firstPaint: 33.71s FCP: 33.71s LCP: 34.54s Load: 37.36s TBT: 1.06s CLS:0.0000
[2021-05-29 23:09:38] INFO: http://localhost:3000/ 63 requests, TTFB: 23.36s (σ14.16s), firstPaint: 26.92s (σ14.14s), FCP: 26.92s (σ14.14s), DOMContentLoaded: 28.99s (σ14.34s), LCP: 27.34s (σ14.23s), CLS: 0 (σ0.00), TBT: 1.78s (σ552.00ms), Load: 30.75s (σ14.36s) (3 runs)
[2021-05-29 23:09:41] INFO: Failing budget JavaScript Transfer Size for http://localhost:3000/ with value 539.2 KB max limit 449.2 KB
[2021-05-29 23:09:41] INFO: Budget: 0 working, 1 failing tests and 0 errors
[2021-05-29 23:09:59] INFO: HTML stored in /home/dekan/Work/Ruby/rails-optimization-examples/rails-optimization-task6/sitespeed-result/localhost/2021-05-29-23-07-03
```
![webpack-bundle-analyzer.3](https://github.com/rubygitflow/rails-optimization-task6/raw/profiler6/statistics_report/webpack-bundle-analyzer.3.png)

### Этап №4

Отключим от приложения неиспользуемые профилировщики.

Бюджет почти достигнут (большего достичь не получилось)

```bash
$ sitespeed.io http://localhost:3000/ --budget.configPath myBudget.json -b chrome
[2021-05-29 23:40:12] INFO: Versions OS: linux 5.8.0-53-generic nodejs: v10.24.1 sitespeed.io: 17.6.0 browsertime: 12.7.0 coach: 6.3.3
[2021-05-29 23:40:13] INFO: Running tests using Chrome - 3 iteration(s)
[2021-05-29 23:40:17] INFO: Testing url http://localhost:3000/ iteration 1
[2021-05-29 23:41:14] INFO: http://localhost:3000/ TTFB: 31.59s DOMContentLoaded: 37.00s firstPaint: 35.29s FCP: 35.29s LCP: 36.13s Load: 40.44s TBT: 902ms CLS:0.0000
[2021-05-29 23:41:17] INFO: Testing url http://localhost:3000/ iteration 2
[2021-05-29 23:42:11] INFO: http://localhost:3000/ TTFB: 30.29s DOMContentLoaded: 35.72s firstPaint: 33.90s FCP: 33.90s LCP: 34.06s Load: 37.80s TBT: 1.74s CLS:0.0000
[2021-05-29 23:42:14] INFO: Testing url http://localhost:3000/ iteration 3
[2021-05-29 23:42:40] INFO: http://localhost:3000/ TTFB: 1.75s DOMContentLoaded: 7.34s firstPaint: 5.55s FCP: 5.55s LCP: 5.70s Load: 9.61s TBT: 1.78s CLS:0.0000
[2021-05-29 23:42:40] INFO: http://localhost:3000/ 44 requests, TTFB: 21.21s (σ13.77s), firstPaint: 24.91s (σ13.70s), FCP: 24.91s (σ13.70s), DOMContentLoaded: 26.68s (σ13.69s), LCP: 25.30s (σ13.88s), CLS: 0 (σ0.00), TBT: 1.47s (σ405.00ms), Load: 29.29s (σ13.96s) (3 runs)
[2021-05-29 23:42:42] INFO: Failing budget JavaScript Transfer Size for http://localhost:3000/ with value 452.8 KB max limit 449.2 KB
[2021-05-29 23:42:42] INFO: Budget: 0 working, 1 failing tests and 0 errors
[2021-05-29 23:42:58] INFO: HTML stored in /home/dekan/Work/Ruby/rails-optimization-examples/rails-optimization-task6/sitespeed-result/localhost/2021-05-29-23-40-12
```
![webpack-bundle-analyzer.4](https://github.com/rubygitflow/rails-optimization-task6/raw/profiler6/statistics_report/webpack-bundle-analyzer.4.png)

