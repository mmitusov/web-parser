// import express from 'express'
const puppeteer = require('puppeteer');
const CronJob = require('cron').CronJob;
const nodemailer = require("nodemailer");
// const cheerio = require('cheerio')
// const axios = require('axios')
const url = 'https://ru.reactjs.org/docs/conditional-rendering.html'

// ----------------------------------------------------------------------------------------> Puppeteer method (for dynamic pages)
// ----- Method #1 -----
// Открываем виртуальный Хром браузер > переходим на интересующею нас страницу > и ждем пока подгрузится вся страница (весь ее DOM)
async function priceChecker() {
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
// // При необходимости можно преобразовать полученый объект в JSON объект 
// let namePriceToJson = JSON.stringify(namePrice);

Object.values(namePrice).map(val => val < 1000 ? console.log('Time to buy!') : console.log('Wait for a sale'))
// Object.values(namePrice).forEach(val => val < 1000 ? sendNotification(namePrice) : console.log('False'))
// if (Object.values(namePrice[0] > 40)) {
//   console.log('Nice!');
// }

  await browser.close();
};

// async function startTraking() {
//   let job = new CronJob('*/15*****', function() {
//     priceChecker()
//   }, null, true, 'America/Los_Angeles')
//   job.start();
// }
// startTraking()

// async function sendNotification(price) { //Google может блокировать подозрительную активность, для того чтобы включить доступ подозрительным приложениям к аккаунту нужно изменить настройки в "https://myaccount.google.com/lesssecureapps and turn on Allow less secure apps".
//   let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'newemail.test.ua@gmail.com',
//       pass: 'Password12345*'
//     },
//   });

//   let textToSend = `Current prices are ${price}`;
//   let htmlText = `<a href=\"${url}\">Link</a>`

//   let info = await transporter.sendMail({
//     from: 'newemail.test.ua@gmail.com', // sender address
//     to: "mitusov.maxim@gmail.com", // list of receivers
//     subject: "Price has changed", // Subject line
//     text: textToSend, // plain text body
//     html: htmlText, // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>  
// }

// async function sendNotification() {
//     var transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'newemail.test.ua@gmail.com',
//         pass: 'Password12345*'
//       }
//     });

//     var mailOptions = {
//       from: 'newemail.test.ua@gmail.com',
//       to: 'mitusov.maxim@gmail.com',
//       subject: 'Sending Email using Node.js',
//       text: 'That was easy!'
//     };

//     transporter.sendMail(mailOptions, function(error, info){
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
//     });
// }

priceChecker()

// ----- Method #2 -----
// async function start() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://www.hetzner.com/ru/dedicated-rootserver');
  
//   await page.waitForSelector('#app_main > div > div > div:nth-child(2) > div > ul > li:nth-child(1) > div > div > div:nth-child(4) > div > div.product-price-sf')
//   const html = await page.$eval('#app_main > div > div > div:nth-child(2) > div > ul > li:nth-child(1) > div > div > div:nth-child(4) > div > div.product-price-sf', 
//    (el) => el.innerText)  

//   console.log(html)

//   await browser.close();
// };
// start()

// ----- Method #3 -----
// async function start() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://www.hetzner.com/ru/dedicated-rootserver');
  
//   await page.waitForSelector('#app_main > div > div > div:nth-child(2) > div > ul > li:nth-child(1) > div > div > div:nth-child(4) > div > div.product-price-sf')
//   const html = await page.$$eval('#app_main > div > div > div:nth-child(2) > div > ul > li:nth-child(1) > div > div > div:nth-child(4) > div > div.product-price-sf', 
//    (elem) => elem.map((i) => {
//      return i.innerText;
//    }))

//   console.log(html)

//   await browser.close();
// };
// start()

// ----- Method #4 -----
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://www.hetzner.com/ru/');

//   const html = await page.evaluate(() => {
//    let productPrices = document.querySelectorAll(".price")
//    const priceList = [...productPrices]
//    return priceList.map(prices => prices.innerText)
//   })
  
//   console.log(html)

//   await browser.close();
// })();

// ----------------------------------------------------------------------------------------> Cheerio/axios method (static)
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
