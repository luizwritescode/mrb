import express from 'express'
import { Server } from 'http'
import path from 'path'
import Bot from './bot.js'
import binance, { prices, getBalance, getTrades } from './binance.js'
import { db } from './firebase.js'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore/lite'

const app = express()
const port = 1337

const __dirname = path.resolve()

app.use(express.json())


app.get('/', async (req,res) => {

    res.send(binance)
})
app.get('/balances', async (req, res) => {
        
    getBalance()
        .then( balance => {
            res.send(balance)
         })
         .catch( error =>
            res.send(error)
        )

})

app.get('/trades', async (req, res) => {

    let balance = await getBalance()

    let trades = {}

    Object.keys(balance).map( async key => {
        if( key != "total") {

            if( key == "BTC" || key == "USDT" || key == "BRL") {
                trades["BTCBRL"] = await getTrades("BTCBRL")
                trades["BTCUSDT"] = await getTrades("BTCUSDT")

            } else {
                trades[key + "BTC"] = await getTrades(key + "BTC")
            }

        }
    })


    res.send( trades )
})

app.post("/trades/update",  async (req, res) => {

    const balances = await getBalance()

    let trades = {}

    trades["BTCBRL"] = await getTrades("BTCBRL")
    trades["BTCUSDT"] = await getTrades("BTCUSDT")

    Object.keys(balances).map( async key => {
        if ( key != "total") {

            if( (key != "BTC" && key != "USDT" && key != "BRL" )) {

                trades[key + "BTC"] = await getTrades(key + "BTC")
            }
        }
    })


    Object.keys(trades).map( async key => {
        await setDoc( doc( db, "trades", key), {"trades": trades[key]} )
            .then( sent => {
                res.status(200).send(trades)
            })
    })
    

    // const docRef = doc(db, collection, doc )
    // const docSnap = await getDoc(docRef)


    // if(docSnap.exists()) {
    //     res.send(trades)
    // } else {
    //     res.status(404).send("No such document!")
    // }


})


app.get('/tickers', (req, res) => {

    prices()
        .then( tickers => res.status(200).send(tickers))
        .catch( err => res.status(400).send(err))

    
})


export function startServer() {
    
    const server = app.listen(port, () => {
        console.log(`[*] Express server listening at http://localhost:${port}`)
      })
    
      process.on("SIGTERM", shutDown)
      process.on("SIGINT", shutDown)
    
    
      function shutDown() {
          console.log("[*] shutting down server...");
    
        server.close( () => {
            process.exit(0)
        })
      }

}


export default app