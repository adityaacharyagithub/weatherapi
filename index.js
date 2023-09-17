const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function run() {
  try {
    const response = await axios.get('https://www.accuweather.com/en/in/noida/3146227/daily-weather-forecast/3146227');

    const $ = cheerio.load(response.data);

    const title = 'Today\'s Weather';
    const day = $('body > div > div.two-column-page-content > div.page-column-1 > div.page-content.content-module > div:nth-child(2) > a > div.info > h2 > span.module-header.dow.date').text();
    const date = $('body > div > div.two-column-page-content > div.page-column-1 > div.page-content.content-module > div:nth-child(2) > a > div.info > h2 > span.module-header.sub.date').text();
    const high = $('body > div > div.two-column-page-content > div.page-column-1 > div.page-content.content-module > div:nth-child(2) > a > div.info > div > span.high').text();
    const low_query = $('body > div > div.two-column-page-content > div.page-column-1 > div.page-content.content-module > div:nth-child(2) > a > div.info > div > span.low').text();
    var input = "/27°";
    var match = low_query.match(/\d+°/);
    var low = match[0];
    const details_query = $('body > div > div.two-column-page-content > div.page-column-1 > div.page-content.content-module > div:nth-child(2) > div > div.phrase').text();
    var details = details_query.replace(/;\s+/g, ', ');

    const information = { title, day, date, high, low, details };

    console.log(information);

    fs.writeFile('weather.json', JSON.stringify(information, null, 2), (err) => {
      if (err) throw err;
      console.log('File saved');
    });
    const reloadInterval = 1 * 60 * 60 * 1000; 
    setTimeout(run, reloadInterval);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
