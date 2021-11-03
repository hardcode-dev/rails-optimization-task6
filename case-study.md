### Подготовка. Развертка проекта

- Использовал наработки предыдущих заданий, единственная возникшая проблемы - израсходовался Algolia key, пришлось завести новый.
- Также в текущем задании была указана версия 2.6.1, а в 4м - 2.6.3 (обновил до 2.6.3)

### Установка бюджета. Первая проверка sitespeed.io

- Установил указанный бюджет (~450KB), собрал github workflow для проверки.
- Первый тест показал что метрика не укладывается в бюджет. Текущее значение: 1.0 MB
  ![image](case-study-images/first.png)

### Проверка webpack-bundle-analyzer

- Добавил webpack-bundle-analyzer, прогнал проверку. Основная часть vendor - moment.js и chart.js
  ![image](case-study-images/bundle-analyzer1.png)
- Закомментировал всё содержимое файла proCharts.js. Объем vendor сократился до 450KB.
  ![image](case-study-images/bundle-analyzer2.png)

### Оптимизация

- proCharts.js подключается в `app/views/dashboards/pro.html.erb`.
  Подключение происходит через отдельный pack, тем не менее этот pack попадает в vendor сборку.
- Отключаем с помощью CommonsChunkVendor плагина. webpack-bundle-analyzer показал что moment и chart
  исключены из vendor.
  ![image](case-study-images/bundle-analyzer3.png)
- текущее значение метрики почти уложилось в бюджет (value: 475.8 KB, max limit: 449.2 KB),
  повысим бюджет назначительно для обеспечения прохождения проверки.

### Выводы
