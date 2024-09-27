## Задача - попрактиковаться в оптимизации загрузки js для Rails и настройке CI для него

### Установил бюджет, которого надо достичь
Удостоверился, что проверка зафейлилась (ERROR: Failing budget JavaScript Transfer Size for http://host.docker.internal:3000/ with value 1.0 MB max limit 449.2 KB)
### Установил webpack-bundle-analyzer, проанализировал текущее положение

Анализ до комментирования `proCharts.js` и после показал такой профит: 
1) Уменшился общий объем загруженных чанков с 3.37 Мб до 2.46 Мб
2) Модуль Vendor из самого большого (1.35 Мб) уменьшился до второго места (448.67 Кб)

Теперь разберемся, в каком месте приложения moment.js используется

Если закомментить весь proChart, но оставить незакомменченной первую строку `import Chart from 'chart.js';`, то результат бандл аналайзера такой же, как если б не был закомменчен весь файл. Но пока неясно где же там вообще подключается библиотека moment.js

proChart.js вызывает chart.js, который вызывает scale.time.js, который уже require-ит moment. Посмотрим, где используются предоставляемые тут функции.


function sorter(a, b)
function arrayUnique(items)
function buildLookupTable(timestamps, min, max, distribution)
function lookup(table, key, value)
function interpolate(table, skey, sval, tkey)
function momentify(value, options)
function parse(input, scale)
function determineStepSize(min, max, unit, capacity)
function determineUnitForAutoTicks(minUnit, min, max, capacity)
function determineUnitForFormatting(ticks, minUnit, min, max)
function determineMajorUnit(unit)
function generate(min, max, capacity, options)
function computeOffsets(table, ticks, min, max, options)
function ticksFromTimestamps(values, majorUnit)


Вообще не нашел ни одного места, где б эти функции вызывались. Запустил проект без профилировщика, вроде нормально отображаются и даты и время, и консоль с отладчиком не жалуются ни на что. Похоже, можно от этого файла отказаться. 

Теперь грузится js файлов на 2.82 Мб, то есть полмегабайта профита. 

Проверим выполнение бюджета, фейлится
with value 729.9 KB max limit 449.2 KB

Нам надо сэкономить еще около 300 Кб.

### Следующая точка роста
Присмотримся к Twilio-video, на индексной странице у нас видео нет, поэтмоу наверное вызов этой библиотеки лучше инициировать при загрузке статьи.
Сейчас она импортируется в файле video.jsx
Тот в свою очередь вызывается из chat.jsx

Закомментили оттуда вызов этой библиотеки, теперь у нас js файлов грузится лишь 1.67 Мб

Судя по коду, библиотека чата нам нужна в chat_channels#index экшне, а не на главной. Попробуем включить ее загрузку именно туда.
Выяснилось, что эта библиотека и не подключается на главной, а именно в чатах и вводится в действие. Видимо, bundle-analyzer - это вообще не анализ фронтовой страницы, а анализ всего бандла js целиком. Нам же надо оптимизировать пока фронт страницу.

Восольщзуемся Lighthouse. Ну он просто показал, что мы грузим большие библиотеки и порекомендовал их закэшировать.

Попробуем PWMetrics
Он не устанавливается, требует установить `chrome-launcher`, а тот валится опять с какими-то человеконечитабельными ошибками.

Попробуем задеплоить с ngrok и проанализировать с PageSpeedInsights и WebPageTest

PageSpeedInsights, кроме минификации js файлов не дал конкретных рекомендаций по их оптимизации

На WebPageTest, к сожалению, непонятно, о каких js файлах идет речь

Thinkwithgoogle тоже сказал достаточно общие вещи - кэшируйте статический контент и уменьшите объем js. А какой именно js нам не нужен на главной странице - не сказал.


Какое то непонятное поведение всего этого вебпака, он опять отказывается работать, просто ни с того ни с сего стал загружать еще на 300 Кб больше js и в логах теста стал писать The server responded with a 404 status code for http://host.docker.internal:3000/uploads/user/profile_image/..., в какой то момент перестал воспринимать webpack-bundle-analyzer, пришлось опять его добавлять с помощью yarn add webpack-bundle-analyzer, бред какой-то. вообще все изменения в коде вернул в положение "как было", git status ничего не показывает, а количество js подгружаемого опять изменилось.

Выпилил c index страницы

    <%= javascript_pack_tag "vendor", defer: true %>
    <%= javascript_pack_tag "manifest", defer: true %>

Но ничего в работе сайта с виду не поменялось. Тест прошел. Зачем эти тэги тут, мне тоже неясно, в node_modules много файлов с похожими названиями, но я всегда думал, что javascript_pack_tag должен тянуть файлы из папки javascript/packs/, а там ни манифеста, ни вендора. 

Непонятно, как вообще на системном уровне каком-то определять, что я, удаляя эти пару строчек не завалю проект?

Видимо, пока я добавлял Yarn-ом webpack-bundle-analyzer, который вдруг куда-то потерялся, потерялись и мои изменения в файле `chart.js`, закомментил его, раскомментил строчки во вьюхе, теперь укладываемся в бюджет и с менее рискованными поправками.

### Теперь настроим CI
Попробуем сделать это через Travis

Написал travis.yml файл (вернее, отредактировал в соответствии с лекцией), вроде на развернутом ngrok тест проходит.

Теперь закоммититься не дает eslint, просит конфигурационного файла, странно, что его нет в репозитории. Тоже не устанавливается, поставим его в false.

И вебпак опять сломался. Прекрасный инструмент.

Очистил package.json, чтобы не мешал мне постигать новые знания. Теперь удалось закоммититься

Travis CI сломался, потому что `The command "eval yarn --frozen-lockfile " failed. Retrying, 2 of 3.`; Я становлюсь фанатом yarn и вебпака. 

Удалось найти в сети способ, как заставить его работать, типа перед скриптом добавить установку yarn. 

Теперь мы можем быть уверены, что выше бюджета не будем пытаться нагрузить клиент пользователя своими js файлами.



================




=================
06.03.2020
Сегодня уперся опять в вебпакер, который никак не хочет компилироваться. Сперва жаловался на CommonsChunkPlugin, потом я удалил версию webpack@4.42 (вроде бы), но с версией webpack@3.12 вылезла другая ошибка:
Compilation failed:
Invalid configuration object. Webpack has been initialised using a configuration object that does not match the API schema.
 - configuration has an unknown property 'mode'. These properties are valid:
Нагуглил вот такой вот ответ
https://stackoverflow.com/questions/45273988/webpack3-jshint-loader-does-not-work/45274620#45274620
плюсом жалуется, что Webpacker can't find manifest.js in /Users/ruslan/thinknetica/rails-optimization-task6/public/packs/manifest.json.

Написал в слак, потому что у самого уже глаза кровоточат, пошагово по инструкции dev.to шел, но все равно не сработало


===================
07.03.2020
Починил вебпакер, снес 4.42 версию, оставил 3.12, отрубил config.webpacker.check_yarn_integrity = false, перепрогнал bin/setup, и bin/startup отработал нормально

Запустил проверку заложенного бюджета, и, как и положено, проверка зафейлилась
ERROR: Failing budget JavaScript Transfer Size for http://host.docker.internal:3000/ with value 1.0 MB max limit 449.2 KB

Теперь при попытке запустить bin/webpack-dev-server возвращает всякие ошибки. Весь день воевал с эти вебпакером, но он не дышит.
Походу, установка этого webpack-bundle-analyzer все поломала мне. Но через докер приложение запускается. Попробую завтра через докер и отчеты формировать

Видимо, пока устанавливал проект через докер, он его корректно переустановил (или доустановил) и вне докеровской среды. И теперь при bin/startup тоже запускается. Правда, для этого пришлось закомментить вставку в deevelopment.js-е webpack-bundle-analyzer. Сейчас попробую его установить не через npm, а через yarn.

Непонятно, проходит ли установка, сыпет много ошибок, но никакого резюмирующего сообщения.
Но теперь команда bin/webpack-dev-server вроде дошла до webpack: Compiled successfully., но на этом и подзависла. Доразберусь завтра.


==================
08.03.2020
Попробовал, как посоветовали в слаке, переустановить все через yarn, а не npm (хотя в документации к dev.to оба варианта установки предлагаются) - все то же самое (хотя установка прошла как по маслу) - webpack-bundle-analyzer просто висит. В слаке подсказали как выйти из положения, заменил код в `development.js` на:

`
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  const environment = require('./environment');
  environment.plugins.append(
    'BundleAnalyzerPlugin',
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../../tmp/report.html',
    }),
  );
  const config = environment.toWebpackConfig();
  // For more information, see https://webpack.js.org/configuration/devtool/#devtool
  config.devtool = 'eval-source-map';
  module.exports = config;
`

, и все завелось! 

Анализ до комментирования `proCharts.js` и после показал такой профит: 
1) Уменшился общий объем загруженных чанков с 3.37 Мб до 2.46 Мб
2) Модуль Vendor из самого большого (1.35 Мб) уменьшился до второго места (448.67 Кб)

Теперь разберемся, в каком месте приложения moment.js используется

Если закомментить весь proChart, но оставить незакомменченной первую строку `import Chart from 'chart.js';`, то результат бандл аналайзера такой же, как если б не был закомменчен весь файл. Но пока неясно где же там вообще подключается библиотека moment.js

proChart.js вызывает chart.js, который вызывает scale.time.js, который уже require-ит moment. Посмотрим, где используются предоставляемые тут функции.


function sorter(a, b)
function arrayUnique(items)
function buildLookupTable(timestamps, min, max, distribution)
function lookup(table, key, value)
function interpolate(table, skey, sval, tkey)
function momentify(value, options)
function parse(input, scale)
function determineStepSize(min, max, unit, capacity)
function determineUnitForAutoTicks(minUnit, min, max, capacity)
function determineUnitForFormatting(ticks, minUnit, min, max)
function determineMajorUnit(unit)
function generate(min, max, capacity, options)
function computeOffsets(table, ticks, min, max, options)
function ticksFromTimestamps(values, majorUnit)


Вообще не нашел ни одного места, где б эти функции вызывались. Запустил проект без профилировщика, вроде нормально отображаются и даты и время, и консоль с отладчиком не жалуются ни на что. Похоже, можно от этого файла отказаться. 

Теперь грузится js файлов на 2.82 Мб, то есть полмегабайта профита. 

Проверим выполнение бюджета, фейлится
with value 729.9 KB max limit 449.2 KB

Нам надо сэкономить еще около 300 Кб.



Присмотримся к Twilio-video, на индексной странице у нас видео нет, поэтмоу наверное вызов этой библиотеки лучше инициировать при загрузке статьи.
Сейчас она импортируется в файле video.jsx
Тот в свою очередь вызывается из chat.jsx

Закомментили оттуда вызов этой библиотеки, теперь у нас js файлов грузится лишь 1.67 Мб

Судя по коду, библиотека чата нам нужна в chat_channels#index экшне, а не на главной. Попробуем включить ее загрузку именно туда.
Выяснилось, что эта библиотека и не подключается на главной, а именно в чатах и вводится в действие. Видимо, bundle-analyzer - это вообще не анализ фронтовой страницы, а анализ всего бандла js целиком. Нам же надо оптимизировать пока фронт страницу.

Восольщзуемся Lighthouse. Ну он просто показал, что мы грузим большие библиотеки и порекомендовал их закэшировать.

Попробуем PWMetrics
Он не устанавливается, требует установить `chrome-launcher`, а тот валится опять с какими-то человеконечитабельными ошибками.

Попробуем задеплоить с ngrok и проанализировать с PageSpeedInsights и WebPageTest

PageSpeedInsights, кроме минификации js файлов не дал конкретных рекомендаций по их оптимизации

На WebPageTest, к сожалению, непонятно, о каких js файлах идет речь

Thinkwithgoogle тоже сказал достаточно общие вещи - кэшируйте статический контент и уменьшите объем js. А какой именно js нам не нужен на главной странице - не сказал.


Какое то непонятное поведение всего этого вебпака, он опять отказывается работать, просто ни с того ни с сего стал загружать еще на 300 Кб больше js и в логах теста стал писать The server responded with a 404 status code for http://host.docker.internal:3000/uploads/user/profile_image/..., в какой то момент перестал воспринимать webpack-bundle-analyzer, пришлось опять его добавлять с помощью yarn add webpack-bundle-analyzer, бред какой-то. вообще все изменения в коде вернул в положение "как было", git status ничего не показывает, а количество js подгружаемого опять изменилось.

Выпилил c index страницы

    <%= javascript_pack_tag "vendor", defer: true %>
    <%= javascript_pack_tag "manifest", defer: true %>

Но ничего в работе сайта с виду не поменялось. Тест прошел. Зачем эти тэги тут, мне тоже неясно, в node_modules много файлов с похожими названиями, но я всегда думал, что javascript_pack_tag должен тянуть файлы из папки javascript/packs/, а там ни манифеста, ни вендора. 

Непонятно, как вообще на системном уровне каком-то определять, что я, удаляя эти пару строчек не завалю проект?

Видимо, пока я добавлял Yarn-ом webpack-bundle-analyzer, который вдруг куда-то потерялся, потерялись и мои изменения в файле `chart.js`, закомментил его, раскомментил строчки во вьюхе, теперь укладываемся в бюджет и с менее рискованными поправками.

Теперь поупражняемся в настройке CI.

Написал travis.yml файл (вернее, отредактировал в соответствии с лекцией), вроде на развернутом ngrok тест проходит.

Теперь закоммититься не дает eslint, просит конфигурационного файла, странно, что его нет в репозитории. Тоже не устанавливается, поставим его в false.

И вебпак опять сломался. Прекрасный инструмент.

Очистил package.json, чтобы не мешал мне постигать новые знания. Теперь удалось закоммититься

Travis CI сломался, потому что `The command "eval yarn --frozen-lockfile " failed. Retrying, 2 of 3.`; Я становлюсь фанатом yarn и вебпака. 

Удалось найти в сети способ, как заставить его работать, типа перед скриптом добавить установку yarn. 




