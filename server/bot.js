import { log } from 'console'
import fs from 'fs'
import { getCandlesticks } from "./binance.js"

export default class Bot {
    constructor() {
        this.status = "offline"
        this.doing = "turned off"
        this.profit = 0
        this.online = false
        this.candles = []
        this.trends = {}
        this.markets = {}
        this.symbol = ""
    }

    start()
    {
        this.online = true
        this.status = "online"
    }

    stop()
    {   
        this.online = false
        this.status = "offline"
    }

    EMA(candles, tf)
    {   
        var k = 2 / (tf+1)

        let ema = [candles[0].close]

        for( var i = 1; i < candles.length; i++) {
            ema.push(candles[i].close * k + ema[i-1] * (1-k))
        }

        return ema
    }

    RSI(candles, tf)
    {
        let ups = []
        let downs = []
        for( let i = 1; i < candles.length ; i++) {
           let change = candles[i].close - candles[i - 1].close

           if( change >= 0) {
                ups.push(change)
           } else if(change < 0) {
               downs.push(Math.abs(change))
           }
        }
        
        let AvgU = ups.reduce( (prev, curr, i) => prev + curr) / tf
        let AvgD = downs.reduce( (prev, curr) => prev + curr) / tf

        let RS = AvgU / AvgD

        return 100 - 100 / ( 1 + RS )

    }

    set_candles(candles)
    {
        this.candles = candles
    }

    set_symbol(symbol)
    {
        this.symbol = symbol
    }
    set_status(status)
    {
        this.status = status

        switch(status) {
            case 'fetching': 
                this.doing = `fetching candle data on ${this.symbol}`
                break
            case 'ta': 
                this.doing = `technical analysis on ${this.symbol}`
                break
            case 'idle': 
                this.doing = `waiting on next cycle (default: 1min)`
        }
    }
    set_trend(symbol, tf, data)
    {
        
        if(this.trends[symbol]){
            this.trends[symbol][tf] = data
        } else {
            let symbolObj = {}
            symbolObj[tf] = data
            this.trends[symbol] = symbolObj
        }
    }

    set_market(market, data) {
        this.markets[market] = data 
    }
    async get_trend(symbol, tf) {

        log('getting trends for symbol ', symbol, ' ... ')
        const candles = await getCandlesticks(symbol, tf)

        const start_price = candles[0].open;
        const end_price = candles[ candles.length - 1].close

        const change_percent = (start_price / end_price ) * 100

        const RSI14 = this.RSI( candles , 14)
        const EMA12 = this.EMA( candles, 12)
        const EMA26 = this.EMA( candles, 26)
        
        let emaShort = EMA12[EMA12.length - 1]
        let emaLong = EMA26[EMA26.length - 1]
        // console.log(`\n/ ${tf} Trend Analysis /\n`)    
        // console.log('RSI(14): ', RSI14.toFixed(2))
        // console.log('EMA(12): ', emaShort.toFixed(2))
        // console.log('EMA(26): ', emaLong.toFixed(2))
        
        let emaTrend = emaShort > emaLong ? "uptrend" : "downtrend"
        
        // console.log(`trend(${tf}): `, emaTrend)
        // console.log()
    
        await saveCsv(candles, tf)
    
        return {RSI: RSI14, EMASHORT: EMA12, EMALONG: EMA26, TREND: emaTrend, PERCENT: change_percent}
    }

    async poll(symbol) {

        this.set_status("fetching")
        this.set_symbol(symbol)
    
        this.set_trend(this.symbol, '1M', await this.get_trend(this.symbol, '1M'))
        this.set_trend(this.symbol, '1w', await this.get_trend(this.symbol, '1w'))
        this.set_trend(this.symbol, '1d', await this.get_trend(this.symbol, '1d'))
        this.set_trend(this.symbol, '4h', await this.get_trend(this.symbol, '4h'))
        this.set_trend(this.symbol, '1h', await this.get_trend(this.symbol, '1h'))
        this.set_trend(this.symbol, '5m', await this.get_trend(this.symbol, '5m'))
    
        this.set_status("ta")
    }

    get_symbol()
    {
        return this.symbol
    }
    cycle( cb = () => {}, interval = 60000) {
        
        if(this.online) {
            cb()
            this.set_status("idle")
            setTimeout(() => this.cycle(cb, interval), interval)
        }
    }
}

async function saveCsv(data,tf = "") {

    var stringified = ""

    data.forEach( candle => {
        stringified += `"${candle.openTime}","${candle.open}","${candle.close}","${candle.high}","${candle.low}"\n`
    })

    fs.writeFile(`public/candles_${tf}.csv`, stringified, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing candlestick JSON Object to File.");
            return console.log(err);
        }
    
        //console.log("Candlestick CSV file has been saved.");
    })
}