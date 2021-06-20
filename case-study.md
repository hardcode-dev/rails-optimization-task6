# Задание № 6

### Шаг 1. Бюджет

- Создал файл `homeBudget.json`.
- Проверил бюджет с помощью `sitespeed.io`.

```
sudo docker run --privileged --rm --net=host -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io http://localhost:3000/ -n 1 --budget.configPath homeBudget.json
Google Chrome 91.0.4472.77
Mozilla Firefox 89.0
Microsoft Edge 91.0.864.11 dev
[2021-06-20 14:22:03] INFO: Versions OS: linux 4.4.0-210-generic nodejs: v12.16.2 sitespeed.io: 17.8.0 browsertime: 12.9.0 coach: 6.4.0
[2021-06-20 14:22:03] INFO: Running tests using Chrome - 1 iteration(s)
[2021-06-20 14:22:04] INFO: Testing url http://localhost:3000/ iteration 1
[2021-06-20 14:22:28] INFO: http://localhost:3000/ 42 requests, TTFB: 472ms, firstPaint: 2.74s, firstVisualChange: 2.73s, FCP: 2.74s, DOMContentLoaded: 3.51s, LCP: 2.94s, CLS: 0, TBT: 1.50s, Load: 5.28s, speedIndex: 2.82s, visualComplete85: 3.10s, lastVisualChange: 3.10s
[2021-06-20 14:22:28] INFO: Failing budget JavaScript Transfer Size for http://localhost:3000/ with value 1.0 MB max limit 449.2 KB
[2021-06-20 14:22:28] INFO: Budget: 0 working, 1 failing tests and 0 errors
[2021-06-20 14:22:30] INFO: HTML stored in /sitespeed.io/sitespeed-result/localhost/2021-06-20-14-22-03
```

- В бюджет пока не укладываемся.
