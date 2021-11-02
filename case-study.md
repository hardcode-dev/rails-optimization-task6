# Задание № 6

### Шаг 1. Бюджет

- Создал файл `myBudget.json`.
- Проверил бюджет с помощью `sitespeed.io`.

```
sudo docker run --privileged --rm --net=host -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io http://localhost:3000/ -n 1 --budget.configPath myBudget.json
Google Chrome 95.0.4638.54
Mozilla Firefox 93.0
Microsoft Edge 93.0.961.10 dev
[2021-11-02 18:52:16] INFO: Versions OS: linux 5.11.0-38-generic nodejs: v14.17.6 sitespeed.io: 20.3.1 browsertime: 14.7.0 coach: 6.4.3
[2021-11-02 18:52:16] INFO: Running tests using Chrome - 1 iteration(s)
[2021-11-02 18:52:17] INFO: Testing url http://localhost:3000/ iteration 1
[2021-11-02 18:52:32] INFO: http://localhost:3000/ 47 requests, TTFB: 369ms, firstPaint: 785ms, firstVisualChange: 811ms, FCP: 785ms, DOMContentLoaded: 981ms, LCP: 1.43s, CLS: 0, TBT: 61ms, Load: 1.55s, speedIndex: 850ms, visualComplete85: 811ms, lastVisualChange: 1.49s
[2021-11-02 18:52:33] INFO: Failing budget JavaScript Transfer Size for http://localhost:3000/ with value 1.0 MB max limit 449.2 KB
[2021-11-02 18:52:33] INFO: Budget: 0 working, 1 failing tests and 0 errors
[2021-11-02 18:52:36] INFO: HTML stored in /sitespeed.io/sitespeed-result/localhost/2021-11-02-18-52-16
```

JavaScript Transfer Size with value 1.0 MB limit max 449.2 KB

- В бюджет пока не укладываемся.
