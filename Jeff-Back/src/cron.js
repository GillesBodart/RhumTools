const cron = require("node-cron")
const telenet = require("./crawlers/telenet")
const dayjs = require("dayjs");


//           ┌────────────── second (optional)
//           │ ┌──────────── minute
//           │ │ ┌────────── hour
//           │ │ │ ┌──────── day of month
//           │ │ │ │ ┌────── month
//           │ │ │ │ │ ┌──── day of week
//           │ │ │ │ │ │
//           │ │ │ │ │ │
//           * * * * * *

CRON_RULE = "0 0 0 * *"

cron.schedule(CRON_RULE, () => {
    telenet.crawl(0)
});

