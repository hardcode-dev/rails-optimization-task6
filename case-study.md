## Шаг-1

- добавил sitespeedio budget
- добавил webpack-bundle-analyzer
- заккоментировал app/javascript/packs/proCharts.js сравнил с помощью webpack-bundle-analyzer до и после результаты [до](https://prnt.sc/rga1ci)
  и [после](https://prnt.sc/rga0j1) - вызов moment.js происходит в `import Chart from 'chart.js';` вызовы чарта на главной странице не исользуются,
- следующий по размерам twilio.js тоже что и с моментом. можно ппопробовать перенести их в какое-нибудь внешнее хранение и вызывать на загрузке
  в нужных местах, что-бы не бандлилось все вместе. Хотя, мне кажется, - потраченные усилия не будут соответсвовать результату.

## UPD check revue notes

- Поправил main.yml
- Поправил environment.js [результат](https://prnt.sc/ri6vuf)
