// import express from 'express'
const puppeteer = require('puppeteer');
// const cheerio = require('cheerio')
// const axios = require('axios')

// ------------------------> Cheerio/axios method (static)
// ----- Method #1 -----
// axios.get('https://www.hetzner.com/ru/').then(htmlDom => {
// 	const $ = cheerio.load(htmlDom.data)
// 	let text = ''
// 	$('body > div > div > div.col-lg-9.col-md-9 > ul > li:nth-child(2) > a > div > div')
// 	.each((i, elem) => {
// 		text += `${$(elem).text()}\n`
// 	})
// 	console.log(text)
// })

// ----- Method #1 -----
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
// ----- Method #1 -----
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

// ----- Method #1 -----
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

// ----- Method #3 -----
// Открываем виртуальный Хром браузер > переходим на интересующею нас страницу > и ждем пока подгрузится вся страница (весь ее DOM)
async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.hetzner.com/ru/dedicated-rootserver');
  await page.waitForSelector('.product-price-sf')

//Вытягиваем данные которые привязаны к имени класса интересующего нас елемента 
  const namingList = await page.$$eval('.product-name-sf', 
    (elem) => elem.map((i) => {
      return i.innerText;
    }))
  let namingListToString = namingList.map(i => i.toString())
  
  const priceList = await page.$$eval('.product-price-sf', 
    (elem) => elem.map((i) => {
      return i.innerText;
    }))
//Убираем лишний текст который мы спарсили с сайта и оставляем только число в виде массива строк
  let priceListTrim = priceList.map(i => i.replace(/от|€/g, "").trim());
//Превращаем строки в числа с плавающей точкой
  var priceListToFloat = priceListTrim.map(i => parseFloat(i))
//Преобразовуем два массива в один объект (Keys And Values Pair)
// Стоит заметить, что некоторые ключи в этомобъекте будут отображаться как строки
  let namePrice = {}
  for (let i = 0; i<namingList.length; i++) {
    namePrice[namingList[i]] = priceListToFloat[i]
  }
// Чтобы все ключи были в одинаковом формате (строк), преобразуем имеющейся объект в JSON объект 
let namePriceToJson = JSON.stringify(namePrice);
console.log(namePriceToJson)

namePriceToJson.map()
if (Object.values(namePriceToJson).forEach(val => return val) < 1000) {
  console.log('Yooooooooooooooo!');
};
// if (Object.values(namePriceToJson[0] > 40)) {
//   console.log('Yooooooooooooooo!');
// }


  await browser.close();
};
start()

// ----- Method #4 -----
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


                                                /*Notes & Examples of code that you can use for your specific purposes*/
// -----------------------------------------------------------------------------------------------------------
  /*  Looping & Array slicing  */ 
// const stories = await page.$$eval('a.storylink', anchors => { return anchors.map(anchor => anchor.textContent).slice(0, 10) })
// Метод slice() возвращает новый массив, содержащий копию части исходного массива.
// -----------------------------------------------------------------------------------------------------------
  /*  Looping & Getting value  */ 
// const selectOptions = await page.$$eval('.bd-example > select.custom-select.custom-select-lg.mb-3 > option', options => { return options.map(option => option.value) })
// console.log(selectOptions)
// -----------------------------------------------------------------------------------------------------------
  /*  Looping & Adding data to object  */ 
// let totalSearchResults = Array.from(document.querySelectorAll('div[data-cel-widget^="search_result_"]')).length;
// for (let i = 1; i < totalSearchResults - 1; i++) {
//     let product = {
//         brand: '',
//         product: '',
//     };
// -----------------------------------------------------------------------------------------------------------
  /*  Looping & Adding data to object  */ 
// let pagePromise = (link) => new Promise(async(resolve, reject) => {
//     let dataObj = {};
//     let newPage = await browser.newPage();
//     await newPage.goto(link);
//     dataObj['bookTitle'] = await newPage.$eval('.product_main > h1', text => text.textContent);
//     dataObj['bookPrice'] = await newPage.$eval('.price_color', text => text.textContent);
//     dataObj['noAvailable'] = await newPage.$eval('.instock.availability', text => {
//         // Strip new line and tab spaces
//         text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
//         // Get the number of stock available
//         let regexp = /^.*\((.*)\).*$/i;
//         let stockAvailable = regexp.exec(text)[1].split(' ')[0];
//         return stockAvailable;
//     });
//     dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', img => img.src);
//     dataObj['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
//     dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);
//     resolve(dataObj);
//     await newPage.close();
// });
// -----------------------------------------------------------------------------------------------------------
