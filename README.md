# Setup через docker, docker-compose и dip

После успешного запуска проекта в 4м задании с сетапом тут должно уже быть легко.

# Работа через docker, docker-compose и dip (дублирую на всякий случай)

- .ruby_version <- ваша версия `ruby`
- скопировать файл `.dev_to/.env` со своими ключами от Algolia из 4го задания
- cd .dev_to
- docker-compose build
- dip provision
- docker-compose up
- open localhost:3000 in your browser

After setup you can

- dip bash - to do any other commands or just to peek around
- dip bundle - to bundle install after adding gems
- dip setup - to rerun bin/setup

# Задание №6

## Оптимизация загрузки js на dev.to и настройка `CI`

На всех страницах `dev.to` загружается файл `vendor.js`.

Анализ показывает, что этот файл содержит библиотеку `moment.js`, печально известную своим большим размером.

## Бюджет

Давайте начнём с того, что зададимся бюджетом на объём `js` на главной странице.

Создайте бюджет для `sitespeed.io` в файле `homeBudget.json`

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

## Идея оптимизации

### Я уже сделал, см свежие коммиты

- Включим в процесс сборки `webpack` плагин `webpack-bundle-analyzer` (`yarn add -D webpack-bundle-analyzer` из `dip bash`)
- Добавим команду `dip report`, которая открывает отчёт `webpack-bundle-analyzer`

### Ваш ход

- Выполните анализ исходной версии приложения с помощью `webpack-bundle-analyzer` (`dip report`)
- убедитесь, что `moment.js` входит в сборку `vendor`
- Закомментируйте всё содержимое файла `proCharts.js`
- Выполните анализ изменённой версии в `webpack-bundle-analyzer` - `moment` должен пропасть из `vendor` и бюджет должен сойтись - profit!

### Cleanup

Надо теперь разобраться как всё сделать корректно,

- раскомментировать `proCharts.js`, посмотреть где он используется и как он связан с `moment.js`
- при этом чтобы `moment.js` не было в `vendor.js`, а только там где он нужен (см `CommonsChunkPlugin` в `environment.js`)
- проверить что бюджет `homeBudget` на главной странице соблюдается
- **hint!** если в бюджет немного не влезаете, то проверьте, не осталось ли в `vendor.js` каких-то *зависимостей* `chart.js` (см `yarn.lock`, `dip report`)
- **hint** мб просто поставить для `vendor.js` настройку `minChunks: 2` в `CommonsChunkPlugin`?

## Защита от деградации с помощью CI

Мы сократили объём загружаемого `js` на большинстве страниц сайта!

Теперь проверка бюджета на главной странице должна пройти успешно, давайте настроим CI, чтобы не допустить дальнейшей деградации.

Настроим `CI Github Actions`.

Шаги:
- выставить текущую версию приложения в интернет с помощью `ngrok`
- запушить урл `ngrok` в конфиг `CI` в `Github` и тем самым триггернуть билд
- билд должен проверять ваше приложение по урлу `ngrok` с помощью `sitespeed.io` на соблюдение бюджета
- после проверки `ngrok` можно выключать

## Как сдать задание

Сделать `PR` в этот репозиторий, содержащий:

- изменения кода
- case-study в свободной форме
- скриншоты `bundle-analyzer` до и после оптимизации
- настроенный `CI` на `Github Actions`


<div align="center">
  <br>
  <img
    alt="DEV"
    src="https://thepracticaldev.s3.amazonaws.com/i/ro3538by3b2fupbs63sr.png"
    width=500px
  />
  <h1>DEV Community 👩‍💻👨‍💻</h1>
  <strong>The Human Layer of the Stack</strong>
</div>
<br/>
<p align="center">
  <a href="https://www.ruby-lang.org/en/">
    <img src="https://img.shields.io/badge/Ruby-v2.6.1-green.svg" alt="ruby version"/>
  </a>
  <a href="http://rubyonrails.org/">
    <img src="https://img.shields.io/badge/Rails-v5.1.6-brightgreen.svg" alt="rails version"/>
  </a>
  <a href="https://travis-ci.com/thepracticaldev/dev.to">
    <img src="https://travis-ci.com/thepracticaldev/dev.to.svg?branch=master" alt="Travis Status for thepracticaldev/dev.to"/>
  </a>
  <a href="https://codeclimate.com/github/thepracticaldev/dev.to/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/ce45bf63293073364bcb/maintainability" />
  </a>
  <a href="https://codeclimate.com/github/thepracticaldev/dev.to/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/ce45bf63293073364bcb/test_coverage" />
  </a>
  <a href="https://oss.skylight.io/app/applications/K9H5IV3RqKGu">
    <img src="https://badges.skylight.io/status/K9H5IV3RqKGu.svg?token=Ofd-9PTSyus3BqEZZZbM1cWKJ94nHWaPiTphGsWJMAY" alt="Skylight badge" />
  </a>
  <a href="https://www.codetriage.com/thepracticaldev/dev.to">
    <img src="https://www.codetriage.com/thepracticaldev/dev.to/badges/users.svg" alt="CodeTriage badge" />
  </a>
</p>

Welcome to the [dev.to](https://dev.to) codebase. We are so excited to have you. With your help, we can build out DEV to be more stable and better serve our community.

## What is dev.to?

[dev.to](https://dev.to) (or just DEV) is a platform where software developers write articles, take part in discussions, and build their professional profiles. We value supportive and constructive dialogue in the pursuit of great code and career growth for all members. The ecosystem spans from beginner to advanced developers, and all are welcome to find their place within our community. ❤️

## Table of Contents

- [Contributing](#contributing)
- [Codebase](#codebase)
  - [The stack](#the-stack)
  - [Engineering standards](#engineering-standards)
    - [Style guide](#style-guide)
    - [Husky hooks](#husky-hooks)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Standard Installation](#standard-installation)
  - [Docker Installation (BETA)](#docker-installation-beta)
  - [Starting the application](#starting-the-application)
  - [Suggested Workflow](#suggested-workflow)
- [Additional docs](#additional-docs)
- [Product Roadmap](#product-roadmap)
- [Core Team Members](#core-team)
- [License](#license)

## Contributing

We encourage you to contribute to dev.to! Please check out the [Contributing to dev.to guide](CONTRIBUTING.md) for guidelines about how to proceed.

We expect contributors to abide by our underlying [code of conduct](CODE_OF_CONDUCT.md). All conversations and discussions on GitHub (issues, pull requests) and across dev.to must be respectful and harassment-free.

### Where to contribute

All [issues](https://github.com/thepracticaldev/dev.to/issues) labeled with `approved` are up for grabs. For clarification on how we label issues, check out their definitions [here](https://github.com/thepracticaldev/dev.to/labels).

When in doubt, ask a [core team member](#core-team)! You can mention us in any issues or ask on the [DEV Contributor thread](https://dev.to/devteam/devto-open-source-helpdiscussion-thread-v0-1l45). Any issue with the `good first issue` tag is typically a good place to start for anyone new to the project. For newer developers, try 'entry-level' issues.

**Refactoring** code, e.g. improving the code without modifying the behavior is an area that can probably be done based on intuition and may not require much communication to be merged.

**Fixing bugs** may also not require a lot of communication, but the more the better. Please surround bug fixes with ample tests. Bugs are magnets for other bugs. Write tests near bugs!

**Building features** is the area which will require the most communication and/or negotiation. Every feature is subjective and open for debate. The [product roadmap](https://github.com/thepracticaldev/dev.to/projects) should be a good guide to follow. As always, when in doubt, ask!

### How to contribute

1.  Fork the project & clone locally. Follow the initial setup [here](#getting-started).
2.  Create a branch, naming it either a feature or bug: `git checkout -b feature/that-new-feature` or `bug/fixing-that-bug`
3.  Code and commit your changes. Bonus points if you write a [good commit message](https://chris.beams.io/posts/git-commit/): `git commit -m 'Add some feature'`
4.  Push to the branch: `git push origin feature/that-new-feature`
5.  [Create a pull request](#create-a-pull-request) for your branch 🎉

Note: be sure to [maintain your fork](https://docs.dev.to/maintaining-your-fork)!

## Contribution guideline

### Create an issue

Nobody's perfect. Something doesn't work? Or could be done better? Let us know by creating an issue.

PS: a clear and detailed issue gets lots of love, all you have to do is follow the issue template!

#### Clean code with tests

Some existing code may be poorly written or untested, so we must have more scrutiny going forward. We test with [rspec](http://rspec.info/), let us know if you have any questions about this!

#### Create a pull request

- Try to keep the pull requests small. A pull request should try its very best to address only a single concern.
- Make sure all tests pass and add additional tests for the code you submit. [More info here](https://docs.dev.to/testing/)
- Document your reasoning behind the changes. Explain why you wrote the code in the way you did. The code should explain what it does.
- If there's an existing issue related to the pull request, reference to it by adding something like `References/Closes/Fixes/Resolves #305`, where 305 is the issue number. [More info here](https://github.com/blog/1506-closing-issues-via-pull-requests)
- If you follow the pull request template, you can't go wrong.

_Please note: all commits in a pull request will be squashed when merged, but when your PR is approved and passes our CI, it will be live on production!_

### How to get help

Whether you are stuck with feature implementation, first-time setup, or you just want to tell us something could be done better, check out our [OSS thread](https://dev.to/devteam/devto-open-source-helpdiscussion-thread-v0-1l45) or create an issue. You can also mention any [core team member](#core-team) in an issue and we'll respond as soon as possible.

### 👉 [OSS Help/Discussion Thread](https://dev.to/devteam/devto-open-source-helpdiscussion-thread-v0-1l45) 👈

### The bottom line

We are all humans trying to work together to improve the community. Always be kind and appreciate the need for tradeoffs. ❤️

## Codebase

### The stack

We run on a Rails backend with mostly vanilla JavaScript on the front end, and some Preact sprinkled in. One of our goals is to move to mostly Preact for our front end.

Additional technologies and services are listed on [our docs](https://docs.dev.to).

### Engineering standards

#### Style Guide

This project follows [thoughtbot's Ruby Style Guide](https://github.com/thoughtbot/guides/blob/master/style/ruby/.rubocop.yml), using [Rubocop](https://github.com/bbatsov/rubocop) along with [Rubocop-Rspec](https://github.com/backus/rubocop-rspec) as the code analyzer. If you have Rubocop installed with your text editor of choice, you should be up and running.

For Javascript, we follow [Airbnb's JS Style Guide](https://github.com/airbnb/javascript), using [ESLint](https://eslint.org) and [prettier](https://github.com/prettier/prettier). If you have ESLint installed with your text editor of choice, you should be up and running.

#### Husky hooks

When commits are made, a git precommit hook runs via [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged). ESLint, prettier, and Rubocop will run on your code before it's committed. If there are linting errors that can't be automatically fixed, the commit will not happen. You will need to fix the issue manually then attempt to commit again.

Note: if you've already installed the [husky](https://github.com/typicode/husky) package at least once (used for precommit npm script), you will need to run `yarn --force` or `npm install --no-cache`. For some reason, the post-install script of husky does not run when the package is pulled from yarn or npm's cache. This is not husky specific, but rather a cached package issue.

## Getting Started

This section provides a high-level requirement & quick start guide. For detailed installations, please check out our [docs](http://docs.dev.to/installation).

### Prerequisites

- [Ruby](https://www.ruby-lang.org/en/): we recommend using [rbenv](https://github.com/rbenv/rbenv) to install the Ruby version listed on the badge.
- [Yarn](https://yarnpkg.com/): please refer to their [installation guide](https://yarnpkg.com/en/docs/install).
- [PostgreSQL](https://www.postgresql.org/) 9.4 or higher.

### Standard Installation

0.  Make sure all the prerequisites are installed.
1.  Fork dev.to repository, ie. https://github.com/thepracticaldev/dev.to/fork
1.  Clone your forked repository, ie. `git clone https://github.com/<your-username>/dev.to.git`
1.  `gem install foreman`
1.  Setup your database
    - Create `config/database.yml` by copying from the provided template (i.e. `cp config/database.yml.sample config/database.yml`)
    - Update the `config/database.yml` file if needed.
1.  Set up your environment variables/secrets
    - Take a look at `Envfile`. This file lists all the `ENV` variables we use and provides a fake default for any missing keys. You'll need to get your own free [Algolia credentials](http://docs.dev.to/get-api-keys-dev-env/#algolia) to get your development environment running.
    - This [guide](http://docs.dev.to/get-api-keys-dev-env/) will show you how to get free API keys for additional services that may be required to run certain parts of the app.
    - For any key that you wish to enter/replace:
      1.  Create `config/application.yml` by copying from the provided template (ie. with bash: `cp config/sample_application.yml config/application.yml`). This is a personal file that is ignored in git.
      2.  Obtain the development variable and apply the key you wish to enter/replace. ie:
      ```
      GITHUB_KEY: "SOME_REAL_SECURE_KEY_HERE"
      GITHUB_SECRET: "ANOTHER_REAL_SECURE_KEY_HERE"
      ```
    - If you are missing `ENV` variables on bootup, `envied` gem will alert you with messages similar to `'error_on_missing_variables!': The following environment variables should be set: A_MISSING_KEY.`.
    - You do not need "real" keys for basic development. Some features require certain keys, so you may be able to add them as you go.
1.  Run `bin/setup`
1.  That's it! Run `bin/startup` to start the application and head to `http://localhost:3000/`

[View Full Installation Documentation](https://docs.dev.to/installation/)

### Docker Installation (BETA)

Our docker implementation is incomplete and may not work smoothly. Please kindly report any issues and any contribution is welcomed!

1. Install `docker` and `docker-compose`
1. `git clone git@github.com:thepracticaldev/dev.to.git`
1. Set environment variables above as described in the "Basic Installation"
1. run `docker-compose build`
1. run `docker-compose run web rails db:setup`
1. run `docker-compose run web yarn install`
1. run `docker-compose up`
1. That's it! Navigate to `localhost:3000`

#### Starting the application

We're mostly a Rails app, with a bit of Webpack sprinkled in. **For most cases, simply running `bin/rails server` will do.** If you're working with Webpack though, you'll need to run the following:

- Run **`bin/startup`** to start the server, Webpack, and our job runner `delayed_job`. `bin/startup` runs `foreman start -f Procfile.dev` under the hood.
- `alias start="bin/startup"` makes this even faster. 😊
- If you're using **`pry`** for debugging in Rails, note that using `foreman` and `pry` together works, but it's not as clean as `bin/rails server`.

Here are some singleton commands you may need, usually in a separate instance/tab of your shell.

- Running the job server (if using `bin/rails server`) -- this is mostly for notifications and emails: **`bin/rails jobs:work`**
- Clearing jobs (in case you don't want to wait for the backlog of jobs): **`bin/rails jobs:clear`**

Current gotchas: potential environment issues with external services need to be worked out.

#### Suggested Workflow

We use [Spring](https://github.com/rails/spring) and it is already included in the project.

1.  Use the provided bin stubs to automatically start Spring, i.e. `bin/rails server`, `bin/rspec spec/models/`, `bin/rake db:migrate`.
2.  If Spring isn't picking up on new changes, use `spring stop`. For example, Spring should always be restarted if there's a change in environment key.
3.  Check Spring's status whenever with `spring status`.

Caveat: `bin/rspec` is not equipped with Spring because it affects Simplecov's result. Instead use `bin/spring rspec`.

## Additional docs

[Check out our dedicated docs page for more technical documentation.](https://docs.dev.to)

## Product Roadmap

Our new product roadmap can be found [here](https://github.com/thepracticaldev/dev.to/projects/1). Many notes need to be converted to issues but this should provide an overview of features we plan to work on, as well as features we are considering.

Core team members will move issues along the project board as they progress.

- Ideas & Requests: features up for discussion.
- Needs Owners: features in need of an owner.
- Committed: features we're committed to building -- free for contributors to work on, but please communicate with the owner beforehand.
- In Progress (early stage): work has begun on feature.
- In Progress (late stage): feature is near completion.

## Core team

- [@benhalpern](https://dev.to/ben)
- [@jessleenyc](https://dev.to/jess)
- [@peterkimfrank](https://dev.to/peter)
- [@maestromac](https://dev.to/maestromac)
- [@zhao-andy](https://dev.to/andy)
- [@aspittel](https://dev.to/aspittel)

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. Please see the [LICENSE](./LICENSE.md) file in our repository for the full text.

Like many open source projects, we require that contributors provide us with a Contributor License Agreement (CLA). By submitting code to the DEV project, you are granting us a right to use that code under the terms of the CLA.

Our version of the CLA was adapted from the Microsoft Contributor License Agreement, which they generously made available to the public domain under Creative Commons CC0 1.0 Universal.

Any questions, please refer to our [license FAQ](http://docs.dev.to/license-faq/) doc or email yo@dev.to

<br/>

<p align="center">
  <img
    alt="sloan"
    width=250px
    src="https://thepracticaldev.s3.amazonaws.com/uploads/user/profile_image/31047/af153cd6-9994-4a68-83f4-8ddf3e13f0bf.jpg"
  />
  <br/>
  <strong>Happy Coding</strong> ❤️
</p>
