Отчёт `sitespeed.io` по ассетам в изначальном состоянии:

```bash
docker run --privileged --rm --network host -v "\$(pwd)":/sitespeed.io sitespeedio/sitespeed.io https://localhost/ -n 1 --budget.configPath homeBudget.json
Google Chrome 79.0.3945.79
Mozilla Firefox 71.0
[2020-03-16 20:58:30] INFO: Versions OS: linux 5.4.0-14-generic nodejs: v12.13.0 sitespeed.io: 11.9.3 browsertime: 7.8.3 coach: 4.3.0
[2020-03-16 20:58:30] INFO: Running tests using Chrome - 1 iteration(s)
[2020-03-16 20:58:31] INFO: Testing url https://localhost/ iteration 1
[2020-03-16 20:59:04] INFO: https://localhost/ 43 requests, backEndTime: 399ms, firstPaint: 907ms, firstVisualChange: 934ms, DOMContentLoaded: 1.29s, Load: 5.75s, speedIndex: 1590, visualComplete85: 2.67s, lastVisualChange: 5.77s, rumSpeedIndex: 4137
[2020-03-16 20:59:04] INFO: Budget: 0 working and 1 failing tests
[2020-03-16 20:59:04] ERROR: Failing budget JavaScript Transfer Size for https://localhost/ with value 1.0 MB max limit 449.2 KB
[2020-03-16 20:59:06] INFO: HTML stored in /sitespeed.io/sitespeed-result/localhost/2020-03-16-20-58-30
```

Вывод `yarn list` говорит о том, что moment используется `chart.js`:

```bash
├─ chart.js@2.7.3
│ ├─ chartjs-color@^2.1.0
│ └─ moment@^2.10.2
```

Найдя место, где происходит импорт, комментируем файл (`proChart.js`):

```bash
docker run --privileged --rm --network host -v "\$(pwd)":/sitespeed.io sitespeedio/sitespeed.io https://localhost/ -n 1 --budget.configPath homeBudget.json

Google Chrome 79.0.3945.79
Mozilla Firefox 71.0
[2020-03-16 20:53:48] INFO: Versions OS: linux 5.4.0-14-generic nodejs: v12.13.0 sitespeed.io: 11.9.3 browsertime: 7.8.3 coach: 4.3.0
[2020-03-16 20:53:48] INFO: Running tests using Chrome - 1 iteration(s)
[2020-03-16 20:53:51] INFO: Testing url https://localhost/ iteration 1
[2020-03-16 20:54:13] INFO: https://localhost/ 43 requests, backEndTime: 340ms, firstPaint: 863ms, firstVisualChange: 866ms, DOMContentLoaded: 1.20s, Load: 1.61s, speedIndex: 906, visualComplete85: 1.03s, lastVisualChange: 1.03s, rumSpeedIndex: 863
[2020-03-16 20:54:13] INFO: Budget: 1 working and 0 failing tests
[2020-03-16 20:54:15] INFO: HTML stored in /sitespeed.io/sitespeed-result/localhost/2020-03-16-20-53-48
```

В бюджет попали. Я пытался использовать `react-loadable`, но при коммите eslint ругался на следующее:

```bash
app/javascript/packs/proCharts.js
 5:18  error  'h' must be in scope when using JSX                          react/react-in-jsx-scope
 5:18  error  JSX not allowed in files with extension '.js'                react/jsx-filename-extension
10:18  error  'h' must be in scope when using JSX                          react/react-in-jsx-scope
13:35  error  A constructor name should not start with a lowercase letter  new-cap
15:34  error  A constructor name should not start with a lowercase letter  new-cap
```

Расширение я изменил, но `import { h } from 'preact';` раздул размер JS до 497 Кб:

```bash
docker run --privileged -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io --budget.configPath /sitespeed.io/homeBudget.json -n 1 https://290137d9.ngrok.io
Google Chrome 79.0.3945.79
Mozilla Firefox 71.0
[2020-03-22 18:16:38] INFO: Versions OS: linux 5.4.0-14-generic nodejs: v12.13.0 sitespeed.io: 11.9.3 browsertime: 7.8.3 coach: 4.3.0
[2020-03-22 18:16:38] INFO: Running tests using Chrome - 1 iteration(s)
[2020-03-22 18:16:40] INFO: Testing url https://290137d9.ngrok.io iteration 1
[2020-03-22 18:17:12] INFO: https://290137d9.ngrok.io 42 requests, backEndTime: 1.15s, firstPaint: 1.45s, firstVisualChange: 1.47s, DOMContentLoaded: 2.37s, Load: 8.67s, speedIndex: 1490, visualComplete85: 1.53s, lastVisualChange: 2.17s, rumSpeedIndex: 1464
[2020-03-22 18:17:12] ERROR: Failing budget JavaScript Transfer Size for https://290137d9.ngrok.io with value 497.0 KB max limit 449.2 KB
[2020-03-22 18:17:12] INFO: Budget: 0 working and 1 failing tests
[2020-03-22 18:17:14] INFO: HTML stored in /sitespeed.io/sitespeed-result/290137d9.ngrok.io/2020-03-22-18-16-38
```

В итоге закомментировал содержимое файла обратно.

В качестве CI для тренировки использовал `travis`, заменив содержимое файла настроек на две директивы, запускающие контейнер с sitespeed.io для проверки бюджета проекта, проксирующегося через `ngrok`. При превышении бюджета пайплайн возвращает `Your build exited with 1`, при соблюдении -- `Your build exited with 0`.
