import Binance from 'node-binance-api'
const log = console.log;

import dotenv from 'dotenv'
dotenv.config()

if(!process.env.BINANCE_API_KEY)
    log("[!] Invalid API KEY" )

const binance = new Binance().options({
    APIKEY: process.env.BINANCE_API_KEY,
    APISECRET: process.env.BINANCE_SECRET,
    useServerTime: true,
    recvWindow: 59999
})

export async function prices() {
    log("[!] getting price tickers ...")

    let tickers = {}
    await binance.prices()
        .then( p => {
            tickers = p
        })
    return tickers
}



export async function getCandlesticks(market, tf) {

    let ret = []

    await binance.candlesticks(market, tf)
        .then( data => {
        
            data.map( d => {
                let candle = {}
                candle['openTime'] = d[0];
                candle['open'] = d[1];
                candle['high'] = d[2];
                candle['low'] = d[3];
                candle['close'] = d[4];
                candle['volume'] = d[5];
                candle['closeTime'] = d[6];
                candle['assetVolume'] = d[7];
                candle['numberOfTrades'] = d[8];
                candle['TakerBuyBaseAssetVolume'] = d[9];
                candle['TakerBuyQuoteAssetVolume'] = d[10];

                ret.push(candle)
            })
        })

    return ret
}


export async function getBalance() {
    let ticker = await binance.prices()
    
    log( "[!] getting balances ... \n")
    
    let balance = {total: 0}

    let promise = new Promise(async function (resolve, reject) {

        await binance.balance( (e, b) => {
            if (e) return reject(e);
            
            log ("balance: " )
            
            let total = 0
            Object.entries(b).map( coin => {
                let avail = parseFloat(coin[1].available).toFixed(4);
                if( avail > 0.0) {
                    
                    let price
                    if(coin[0] == 'USDT')
                    price = avail
                    else
                    price = ticker[coin[0] + 'USDT'] || ticker['USDT' + coin[0]]
                    
                    
                    let dolar_price =  parseFloat(price * avail).toFixed(2)
                    
                    log ( coin[0] + ": " + avail + '\t$ ' + dolar_price)
                    
                    balance[coin[0]] = {amount: avail, price: price, total: dolar_price}
                    
                    balance["total"] += parseFloat(dolar_price)
                    
                }
            })

            resolve(balance)
        })
    })

    return promise
        
}


export async function getFuturesBalance() {
    let ticker = await binance.prices()

    log( "getting futures balance ... \n")
    await binance.deliveryBalance().then( (b) => {

        let isempty = true
        
        log ("balance: \n" )

        let total = 0
        Object.values(b).map( coin => {
            log(coin.asset, coin.balance)
            let avail = parseFloat(coin.balance).toFixed(4);
            if( avail > 0.0) {

            isempty = false

            let price
            if(coin.asset == 'USDT')
                price = avail
            else
                price = ticker[coin.asset + 'USDT'] || ticker['USDT' + coin.asset]


            let dolar_price =  parseFloat(price * avail).toFixed(2)

            log ( coin.asset + ": " + avail + '\t$ ' + dolar_price)

            total += parseFloat(dolar_price)
            }
            
        })

        if(isempty)
            log("no assets")
    })
}

export async function getFuturesPositions() {
    log("getting all position risks ... \n")
    await binance.futuresPositionRisk()
        .then( p => {
            let isempty = true
            Object.values(p).map( coin => {
                let avail = parseFloat(coin.positionAmt).toFixed(4);
                if( avail > 0.0) {
                    log ( coin.asset + ": " + avail )
                    isempty = false
                }

            })
            if (isempty) {
                log("no open positions")
            }
        })
}

export async function getOpenOrders() {
    log( "getting open orders ... \n")
    await binance.futuresOpenOrders().then( (b) => {
        
        log ("orders: \n" )

        b = Object.values(b)

        b.map( coin => {
           log(coin)
        })

        if( b.length == 0 )
            log("no orders")
    })
}

export async function getTrades(symbol) {
    
    process.stdout.write(`[*] getting trades for symbol  ${symbol}  ... `)
    async function executor(resolve, reject) {

            await binance.trades(symbol, (e, t, symb) => {
                if (e) {
                    let body = JSON.parse( e.body )
                    console.log("[!] BINANCE ERROR ", body.code, " : ", body.msg, " ", symbol)
                    reject(e)        
                } else {
                    process.stdout.write("done.\n")
                    resolve( t )
                }

            })
    }     

    return new Promise(executor)
}


export default binance