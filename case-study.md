проверил что бюджет не проходит

### step 1

Failing budget JavaScript Transfer Size for http://localhost:3000/ with value 1.0 MB max limit 449.2 KB

### step 2

webpack-bundle-analyzer показал, что moment.js входит в vendor-bundle

### Step 3

закомментировал proCharts.js, moment.js больше не входит в vendor

бюджет проходит
Budget: 445.8kb

### Step 4

Настроил github actions

### result

до оптимизации: https://i.imgur.com/CjuiL5x.png
после оптимизации: https://i.imgur.com/atn1TG1.png
