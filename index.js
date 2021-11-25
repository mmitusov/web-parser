// import express from 'express'
const puppeteer = require('puppeteer');
// const cheerio = require('cheerio')
// const axios = require('axios')

// ------------------------> Cheerio/axios method (static)
// axios.get('https://www.hetzner.com/ru/').then(htmlDom => {
// 	const $ = cheerio.load(htmlDom.data)
// 	let text = ''
// 	$('body > div > div > div.col-lg-9.col-md-9 > ul > li:nth-child(2) > a > div > div')
// 	.each((i, elem) => {
// 		text += `${$(elem).text()}\n`
// 	})
// 	console.log(text)
// })

// const parse = async () => {
// 	const getHtml = async (url) => {
// 		const { data } = await axios.get(url)
// 		return cheerio.load(data)
// 	}

// 	const $ = await getHtml('https://rozetka.com.ua/search/?price=700-1100&producer=bagsmart&text=Bagsmart+')
// 	console.log($.html())
// }

// parse()



// ------------------------> Puppeteer method (dynamic)
// async function start() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://www.hetzner.com/ru/dedicated-rootserver');
  
//   await page.waitForSelector('#app_main > div > div > div:nth-child(2) > div > ul > li:nth-child(1) > div > div > div:nth-child(4) > div > div.product-price-sf')
//   const html = await page.$eval('#app_main > div > div > div:nth-child(2) > div > ul > li:nth-child(1) > div > div > div:nth-child(4) > div > div.product-price-sf', 
//   	(el) => el.innerText)  

//   console.log(html)

//   await browser.close();
// };
// start()

// async function start() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://www.hetzner.com/ru/dedicated-rootserver');
  
//   await page.waitForSelector('#app_main > div > div > div:nth-child(2) > div > ul > li:nth-child(1) > div > div > div:nth-child(4) > div > div.product-price-sf')
//   const html = await page.$$eval('#app_main > div > div > div:nth-child(2) > div > ul > li:nth-child(1) > div > div > div:nth-child(4) > div > div.product-price-sf', 
//   	(elem) => elem.map((i) => {
//   		return i.innerText;
//   	}))

//   console.log(html)

//   await browser.close();
// };
// start()

async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.hetzner.com/ru/dedicated-rootserver');
  
  await page.waitForSelector('.product-price-sf')
  const html = await page.$$eval('.product-price-sf', 
  	(elem) => elem.map((i) => {
  		return i.innerText;
  	}))

  console.log(html)

  await browser.close();
};
start()

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://www.hetzner.com/ru/');

//   const html = await page.evaluate(() => {
//   	let productPrices = document.querySelectorAll(".price")
//   	const priceList = [...productPrices]
//   	return priceList.map(prices => prices.innerText)
//   })
  
//   console.log(html)

//   await browser.close();
// })();
