GNU nano 6.2                                                                                          index.js
const express = require('express');
const app = express();
// const port = 3000;
// const port = process.env.PORT || 5000;
const puppeteer = require('puppeteer');
const cors = require('cors');
var serverPort = 3000;
var port = process.env.PORT || serverPort;
app.use(cors()); // Enable CORS for all routes

app.get('/car/:vin', async (req, res) => {
  const vin = req.params.vin;

  const browser = await puppeteer.launch({
    headless: 'new', // Set to true for production use
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for running in Docker
    waitUntil: 'networkidle0'
  });
  const page = await browser.newPage();

  await page.goto('https://carbuy.ee');

  const response = await page.evaluate(async (vin) => {
    vin = vin.toUpperCase().trim();
    const requestUrl = `https://mnt.salesmodul.com/api/v1/data/${vin}`;
    const fetchResponse = await fetch(requestUrl);
    return fetchResponse.json();
  }, vin);

  await browser.close();

  res.json(response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// http://localhost:8080/car/807HLC