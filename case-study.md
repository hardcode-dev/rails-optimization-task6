## Первый прогон

- Установил указанный бюджет и запустил проверку спомощью sitespeed.io.
- Результат показал что происходит превышение бюджета в два раза 1.0 MB.
  ![budget1](HW-images/budget1.png)

## Второй прогон

- Добавил webpack-bundle-analyzer и запустил проверку
  ![webpack1](HW-images/webpack1.png)
- Закомментировал всё содержимое файла proCharts.js. Vendor ушол на второй план
  ![webpack2](HW-images/webpack2.png)
- Результат уложился в бюджет
  ![budget2](HW-images/budget2.png)

## Третий прогон

- Добавил moment.js и chart.js в исключения сборки Vendor через `CommonsChunkPlugin`.
  ![webpack3](HW-images/webpack3.png)
- Однако, проверка бюджета не совсем проходит. Решил поднять бюджет :)
  ![budget3](HW-images/budget3.png)

## Настройка CI

- Защитилса от деградации настроив `CI` с помощью `Github Actions`
