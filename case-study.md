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

docker run --privileged --rm --network host -v "\$(pwd)":/sitespeed.io sitespeedio/sitespeed.io https://localhost/ -n 1 --budget.configPath homeBudget.json

Google Chrome 79.0.3945.79
Mozilla Firefox 71.0
[2020-03-16 20:53:48] INFO: Versions OS: linux 5.4.0-14-generic nodejs: v12.13.0 sitespeed.io: 11.9.3 browsertime: 7.8.3 coach: 4.3.0
[2020-03-16 20:53:48] INFO: Running tests using Chrome - 1 iteration(s)
[2020-03-16 20:53:51] INFO: Testing url https://localhost/ iteration 1
[2020-03-16 20:54:13] INFO: https://localhost/ 43 requests, backEndTime: 340ms, firstPaint: 863ms, firstVisualChange: 866ms, DOMContentLoaded: 1.20s, Load: 1.61s, speedIndex: 906, visualComplete85: 1.03s, lastVisualChange: 1.03s, rumSpeedIndex: 863
[2020-03-16 20:54:13] INFO: Budget: 1 working and 0 failing tests
[2020-03-16 20:54:15] INFO: HTML stored in /sitespeed.io/sitespeed-result/localhost/2020-03-16-20-53-48

├─ chart.js@2.7.3
│ ├─ chartjs-color@^2.1.0
│ └─ moment@^2.10.2
