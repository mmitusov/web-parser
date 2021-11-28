const Express = require('express');
const puppeteer = require('puppeteer');
const nodemailer = require("nodemailer");
const cron = require('node-cron');
// const cheerio = require('cheerio')
// const axios = require('axios')


// const app = Express();


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
    let namingListToString = namingList.map(i => i.toString()) //ДОБАВИТЬ ЭВЕЙТ?!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    const priceList = await page.$$eval('.product-price-sf', 
      (elem) => elem.map((i) => {
        return i.innerText;
      }))
  //Убираем лишний текст который мы спарсили с сайта и оставляем только число в виде массива строк
    let priceListTrim = priceList.map(i => i.replace(/от|€/g, "").trim());
  //Превращаем строки в числа с плавающей точкой
    var priceListToFloat = priceListTrim.map(i => parseFloat(i))
  //Преобразовуем два массива в один объект (Keys And Values Pair)
  // Стоит заметить, что некоторые ключи в этом объекте будут отображаться как строки
    let namePrice = {}
    for (let i = 0; i<namingList.length; i++) {
      namePrice[namingList[i]] = priceListToFloat[i]
    }
  // При необходимости сделать уникальную копию данных можно преобразовать полученый объект в JSON, а затем назад в JS объект 
  // let namePriceToJson = JSON.parse(JSON.stringify(namePrice));

  // Object.values(namePrice).map(val => val < 1000 ? console.log('Time to buy!') : console.log('Wait for a sale'))
    let props = Object.values(namePrice)[0]
    if (Object.values(namePrice[0] > 10)) {
      sendNotification(props);
      // console.log('Hey!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    }

    await browser.close();
};

async function startTracking() {
  const job = cron.schedule('* * * * *', () => {
    priceChecker();
  });
  job.start();
}

async function sendNotification(props) { 
//По причине того, что Google может блокировать подозрительную активность, Вы пожете получить ошибку о том, что ваш Логин и Пароль не приняты.
//В данном случае, для того чтобы дать доступ подозрительным приложениям к Вашему аккаунту нужно зайти в настройки Google "https://myaccount.google.com/lesssecureapps" и включить ползунок "Allow less secure apps".
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,   
    auth: {
      user: 'newemail.test.ua@gmail.com',
      pass: 'Password12345*'
    },
  });

  const url = 'https://www.hetzner.com/ru/dedicated-rootserver'

  let info = await transporter.sendMail({
    from: '"Hetzner notification" <newemail.test.ua@gmail.com>', // sender address
    to: "mitusov.maxim@gmail.com", // list of receivers
    subject: "Price has changed", // Subject line
    text: `Current price is ${props}. Link to the price page: ${url}`, // plain text body
    // html: `<a href=\"${url}\">Link to the 'hetzner.com'</a>`, // html body
  });

   console.log("Message sent: %s", info.messageId);
}

// async function sendNotification() { //В случае если порт ниже не подходит для gmail, нужно использовать формат порта указанный в примере выше (https://stackoverflow.com/questions/57547536/nodemailer-oauth-gmail-connection-error-connect-etimedout-74-125-140-108465)
//     var transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'newemail.test.ua@gmail.com',
//         pass: 'Password12345*'
//       },
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

// sendNotification()
// priceChecker()
startTracking() 





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



// app.listen(process.env.PORT || 3000, () => {
//   console.log(`App is running on port ${process.env.PORT}`)
// })