import express from 'express'
import { Server } from 'http'
import path from 'path'
import Bot from './bot.js'
import { prices } from './binance.js'

const app = express()
const port = 1337

const __dirname = path.resolve()

app.set('view engine', 'ejs')

app.use(express.json())

app.use(express.static('public'))

app.get('/chart', (req, res) => {
    res.render( __dirname + '/public/chart')

})

app.get('/markets', markets, (req, res) => {
    res.render( __dirname + '/public/markets', {markets: req.markets})
})

async function markets(req, res, next) {

    let bot = new Bot()
    
    let market = "BTC"

    await prices()
    .then( async tickers => {
        for (const symbol in tickers) {
            if (Object.hasOwnProperty.call(tickers, symbol)) {
                const price = tickers[symbol];

                if (symbol.indexOf(market) >= 3 )
                {
                    await poll(bot, symbol)
                }
         
            }
        }
        req.markets = bot.trends
    } )


    next()
}

async function poll(bot, symbol) {

    bot.set_status("fetching")
    bot.set_symbol(symbol)

    bot.set_trend(bot.symbol, '1M', await bot.get_trend(bot.symbol, '1M'))
    bot.set_trend(bot.symbol, '1w', await bot.get_trend(bot.symbol, '1w'))
    bot.set_trend(bot.symbol, '1d', await bot.get_trend(bot.symbol, '1d'))
    bot.set_trend(bot.symbol, '4h', await bot.get_trend(bot.symbol, '4h'))
    bot.set_trend(bot.symbol, '1h', await bot.get_trend(bot.symbol, '1h'))
    bot.set_trend(bot.symbol, '5m', await bot.get_trend(bot.symbol, '5m'))

    bot.set_status("ta")
}

const server = app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`)
  })

  process.on("SIGTERM", shutDown)
  process.on("SIGINT", shutDown)


  function shutDown() {
      console.log("[*] shutting down server...");

        server.close( () => {
            process.exit(0)
        })
  }
  export default app