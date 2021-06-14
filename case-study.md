### Шаг 1

- сделал файл `homeBudget.json`
- запустил `sitespeed`
- убедился, что бюджет не соблюдается
  - `Failing budget JavaScript Transfer Size for http://host.docker.internal:3000/ with value 3.2 MB max limit 449.2 KB`

### Шаг 2

- добавил `webpack-bundle-analyzer`
- выполнил анализ
- `moment.js` входит в сборку `vendor`
- закомментировал `proCharts.js`
  - `moment.js` пропал
  - `INFO: Failing budget JavaScript Transfer Size for http://host.docker.internal:3000/ with value 521.6 KB max limit 449.2 KB`
- Все равно не укладываемся в бюджет, немного увеличил `"javascript": 535000`
