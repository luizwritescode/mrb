#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'
import Binance from 'node-binance-api'

import { printMenu, printTA } from "./tty.js"
import Bot from './bot.js'
import TradingView from './tradingview.js'

import app from './server.js'
import Puppet from './master.js'

import chalk from 'chalk'
const log = console.log;

import binance, { prices, getBalance, getOpenOrders, getFuturesPositions} from './binance.js'

var current = 0;
var context = "home"
var online = false

const bot = new Bot();

console.log(process.env.BINANCE_API_KEY)

if(binance)
    init()
else
    log("could not communicate with binance")

const endpoint = "https://dapi.binance.com"

// const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout
//         })

async function start_bot() {
    
    bot.start()
    online = true;
    
    //printMenu(context,current, bot)

    let now = new Date(Date.now())

    log(`Initializing bot @ ${now} ...`)

    //STARTING TRADINGVIEW INDICATORS
    //await TradingView.authorize()
    //const pup = new Puppet()

    //await pup.open()
    
    
}

async function bot_cycle()  {

    bot.set_status("fetching")

    printMenu(context, current, bot)
    
    bot.set_trend(bot.symbol, '1M', await bot.get_trend(bot.symbol, '1M'))
    bot.set_trend(bot.symbol, '1w', await bot.get_trend(bot.symbol, '1w'))
    bot.set_trend(bot.symbol, '1d', await bot.get_trend(bot.symbol, '1d'))
    bot.set_trend(bot.symbol, '4h', await bot.get_trend(bot.symbol, '4h'))
    bot.set_trend(bot.symbol, '1h', await bot.get_trend(bot.symbol, '1h'))
    bot.set_trend(bot.symbol, '5m', await bot.get_trend(bot.symbol, '5m'))
    
    bot.set_status("ta")

    printMenu( context, current, bot)
    printTA(bot, "yellowBright")

    if(bot.trends[bot.symbol]['1M'].TREND === "uptrend" && bot.trends[bot.symbol]['1w'].TREND === "uptrend")
    {
        if(bot.trends[bot.symbol]['1h'].RSI < 35)
        {
            log( chalk.bold.magentaBright(`[!] buy window found for symbol ${bot.symbol}`), symbol)
        }
    }

}

function stop_bot(){
    bot.stop()
    
    printMenu(context,current, bot)
    log("shutting down ...")
}

function saveJson(data, tf = "") {

    var stringified = JSON.stringify(data)
    
    fs.writeFile(`public/candles_${tf}.json`, stringified, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing candlestick JSON Object to File.");
            return console.log(err);
        }
    })
}

function loadJson(filename) {

    const raw = fs.readFileSync(filename)
    let data = JSON.parse(raw)
    log(data)
    return data
}


function bindKeys() {
  
    process.stdin.on('keypress', (str, key) => {
        
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else if (key.name === "down" && current < 3) {
            printMenu(context, ++current, bot)
        } else if (key.name === "down" && current == 3) {
            printMenu(context, current, bot)
        } else if (key.name === "up" && current > 0) {
            printMenu(context,--current, bot)
        } else if (key.name === "up" && current == 0) {
            printMenu(context,current, bot)
        } else if (key.name === "space" && context === "home" && !bot.online) {
            start_bot()
        } else if (key.name === "space" && context === "home" && bot.online) {
            stop_bot()
        } else if (key.name === "right" && context === "home") {
            if (current === 0)
                getBalance()
            else if (current === 1)
                getOpenOrders()
            else if (current === 2)
                getFuturesPositions()
            else if (current === 3)
                Trade()
        } else if (key.name === "right" && context === "trade") {
            if (current === 0)
                SpotTrade()
            else if (current === 1)
                FuturesTrade()
            else if (current === 2) {
                Home()
            }
        }  else if (key.name === "right" && context === "spot") {
            if (current === 0)
                log("buy")
            else if (current === 1)
                log("sell")
            else if (current === 2) {
                Trade()
            }
        }  else if (key.name === "right" && context === "futures") {
            if (current === 0)
                log("buy")
            else if (current === 1)
                log("sell")
            else if (current === 2) {
                Trade()
            }
        }
    });
}

    
function init() 
{
    bindKeys()
    printMenu("home", 0, bot)
}

// CONTEXT CHANGERS
function Trade() {
    current = 0
    context = "trade"
    printMenu(context, current, bot)
}

function FuturesTrade() {
    current = 0
    context = "futures"
    printMenu(context, current, bot)
}

function SpotTrade() {
    current = 0
    context = "spot"
    printMenu(context, current, bot)
}

function Home() {
    current = 0
    context = "home"
    printMenu(context, current, bot)
}

async function marketBuy()
{

}

// function getEndpoint() {
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     })
//     var params = {
//         "timestamp": Date.now(),
//         "recvWindow": 99999,
//     }

//     const sig = getSignature(params)
//     params["signature"] = sig

//     rl.question('endpoint: ', (ep) => {
//         axios({
//                 "method": "GET",
//                 "url": "https://dapi.binance.com" + ep,
//                 "headers": {
//                     "X-MBX-APIKEY": API_KEY,
//                 },
//                 "params": params
//             })
//             .then((response) => {
//                 console.log("data :" + response.data);
//             })
//             .catch(e => console.log(e))

//             rl.close()
//     })

    
// }

// function getSignature(params) {
//     const queryString = Object.keys(params)
//     .map((key) => `${key}=${params[key]}`)
//     .join("&");

//     const sig = createHmac("sha256", SECRET_KEY)
//         .update(queryString)
//         .digest("hex");

//     return sig ;
    
// }