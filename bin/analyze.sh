#!/bin/bash

bin/webpack --profile --json > tmp/webpack-stats.json
node_modules/.bin/webpack-bundle-analyzer tmp/webpack-stats.json

