const express = require("express");
const TelegramBot = require('node-telegram-bot-api')
const fs = require('fs')

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true })
const app = express()

fs.readFile('./scores.json', 'utf8', (err, data) => {
  const scores = JSON.parse(data)
})
let obj = {}
const setMessage = data => {
  const obj = data
  const message = `
  <code style="color:green">
  -----------------------
  |   FAIZ   |  SHREYAS |
  |          |          |
  |    ${obj.faiz < 10 ? "0" + obj.faiz : obj.faiz}    |    ${obj.shreyas < 10 ? "0" + obj.shreyas : obj.shreyas}    |
  |          |          |
  ----------------------
  </code>
  `;
  return message
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
const port = 3000;


const read = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./scores.json', 'utf8', (err, data) => {
      if (err) reject(err)
      resolve(JSON.parse(data))
    })
  })
}
const write = (resource) => {
  return new Promise((resolve, reject) => {
    fs.writeFile('./scores.json', JSON.stringify(resource), (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

bot.onText(/\/score (.+)/, (msg, match) => {
  console.log("recieved an echo request");
  const params = match[1].split(" ")
  if ((params[0] === 'add' || params[0] == 'del') && params[1]) {
    read().then((data) => {
      obj = data
      params[0] === 'add' ? obj[params[1]]++ : obj[params[1]]--;
      return write(obj)
    }).then((data) => {
      const message = setMessage(obj)
      bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" })
    }).catch((err) => {
      console.log(err)
    })
  }
  if (params[0] === 'display') {
    read().then((data) => {
      const message = setMessage(data)
      bot.sendMessage(msg.chat.id, message, { parse_mode: "HTML" })
    }).catch((err) => {
      console.log(err)
    })
  }
});


