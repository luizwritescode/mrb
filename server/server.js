import express from 'express'
import { Server } from 'http'
import path from 'path'
import Bot from './bot.js'
import binance, { prices, getBalance, getTrades } from './binance.js'

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

           trades[key] = await getTrades(key)
        }
    })


    res.send( trades )
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