const Express = require('express');
const puppeteer = require('puppeteer');
const nodemailer = require("nodemailer");
const cron = require('node-cron');



const app = Express();



  console.log('Test: Logs are visible')

  let newNamePrice = {};
  let memoryNamePrice = {};

// Открываем виртуальный Хром браузер > переходим на интересующею нас страницу > и ждем пока подгрузится вся страница (весь ее DOM)
  async function priceChecker() {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
      });
      const page = await browser.newPage();
      await page.goto('https://www.hetzner.com/ru/dedicated-rootserver');
      await page.waitForSelector('.product-price-sf')

//Вытягиваем данные которые привязаны к имени класса интересующего нас елемента 
      const namingList = await page.$$eval('.product-name-sf', 
        (elem) => elem.map((i) => {
          return i.innerText;
        }))
      let namingListToString = await namingList.map(i => i.toString())    
      const priceList = await page.$$eval('.product-price-sf', 
        (elem) => elem.map((i) => {
          return i.innerText;
        }))

//Убираем лишний текст который мы спарсили с сайта и оставляем только число в виде массива строк. P.S. Лучше убирать как русcкие так и английские слова так как не известно в какой стране находиться сервер и язык сайта который парсят может менятся
      let priceListTrim = priceList.map(i => i.replace(/from|от|€/g, "").trim());
//Превращаем строки в числа с плавающей точкой
      let priceListToFloat = priceListTrim.map(i => parseFloat(i))
//Преобразовуем два массива в новый объект newNamePrice (Keys And Values Pair)
      for (let i = 0; i<namingList.length; i++) {
        newNamePrice[namingList[i]] = priceListToFloat[i]
      }

// Обновляем объект memoryNamePrice если он пуст
      if (Object.keys(memoryNamePrice).length === 0 && memoryNamePrice.constructor === Object) {
        memoryNamePrice = {...newNamePrice}
      }

//Проверяем объекты memoryNamePrice и newNamePrice на сходство. При наявности изменений выводим разниц, и отправляем ее на почту.
     if (Object.keys(memoryNamePrice).length > 0) {
        let diff = Object.keys(newNamePrice).reduce((diff, key) => {
          if (memoryNamePrice[key] === newNamePrice[key]) return diff
          return {
            ...diff,
            [key]: newNamePrice[key]
          }
        }, {})
        Object.entries(diff).map(([key, value]) => sendNotification(key, value))
      }

//Обновляем память перед началом следующего цикла
      for (var pair in memoryNamePrice) delete memoryNamePrice[pair];
      memoryNamePrice = {...newNamePrice}
      for (var pair in newNamePrice) delete newNamePrice[pair];

      await browser.close();
  };


//С логикой настройки времени можно ознакомиться на сайте - https://crontab.guru
//При данных настройках программа будет запускаться сразу при наступлении каждого нового часа
async function startTracking() {
  const job = cron.schedule('0 */1 * * *', () => {
    priceChecker();
  });
  job.start();
}


//Ссылка на официальную документацию - https://nodemailer.com/smtp/oauth2/#example-2
async function sendNotification(key, value) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,   
    auth: {
      user: 'your.email@gmail.com',
      pass: '***your.email.password***'
    },
  });

  const url = 'https://www.hetzner.com/ru/dedicated-rootserver';

  let mailOptions = await transporter.sendMail({
    from: '"Hetzner notification" <your.email@gmail.com>', // sender address
    to: "receivers.email@gmail.com", // list of receivers
    subject: "Hetzner обновленные цены", // Subject line
    text: `Ценовое предложение для ${key} теперь составляет ${value} EUR. С новым передложением можно сознакомиться на официальном вебсайте: ${url}.`, // plain text body
  });   
  const checker = (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + mailOptions.response + ', ' +  mailOptions.messageId);
    }
  };
  checker();
}

startTracking() 



app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT}`)
})