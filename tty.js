import chalk from "chalk";
import boxen from "boxen";
import readline from "readline";

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
    process.stdin.setRawMode(true);


const homeMenuOptions = [
    "Balance",
    "Orders",
    "Positions",
    "Trade",
    "Space. Start bot",
]

const tradeMenuOptions = [
    "Spot",
    "Futures",
    "Back"
]

const buySellMenuOptions = [
    "Buy",
    "Sell",
    "Back"
]
const marketLimitMenuOptions = [
    "Market",
    "Limit",
    "Back"
]

export function printMenu(mode, n, bot) {
    console.clear();
    console.log( chalk.greenBright.italic(mode, n));

    let title_text
    let options_text = "";
    

    if(bot && bot.online)
        title_text = chalk.greenBright.bold(" MEAN REVERSION BOT ( ͡° ͜ʖ ͡°) v1.0");
    else
        title_text = chalk.redBright.bold(" MEAN REVERSION BOT (╬ ಠ益ಠ) v1.0");


    if (mode === "home") 
        buildMenu(homeMenuOptions)
    else if (mode === "trade")
        buildMenu(tradeMenuOptions)
    else if (mode === "spot")
        buildMenu(buySellMenuOptions)
    else if (mode === "futures")
        buildMenu(buySellMenuOptions)
    
        
    function buildMenu(options) {
        for (let i = 0; i < options.length; i++) {
            let _o = chalk.white.bold(options[i])

            if (i > 0 && i < 4)
                options_text += '\n'
            else if (i===4)
                options_text += '\n\n'

            if (i === n)
                _o = " > " + _o
            else
                _o = " " + _o

            options_text += _o 
        }

        let status_color = "red"

        if(bot.online)
            status_color = "green"

        const boxenMenuOptions = {
            padding: 1,
            margin: 0,
            borderStyle: "round",
            borderColor: status_color,
            backgroundColor: "#333"
        };
        const boxenOptionsOptions = {
            padding: 1,
            margin: 0,
            borderStyle: "round",
            borderColor: status_color,
            backgroundColor: "#333"
        };
       

        const msgBox = boxen(title_text, boxenMenuOptions);
        const optionsBox = boxen(options_text, boxenOptionsOptions);
        
        console.log(msgBox);
        console.log(optionsBox);

        if(bot.online) {
            
            printStatus(bot, status_color)

        }
    }

}

function printStatus(bot, status_color) {

    let str = ""
    str += `status: ${bot.status}\n`
    str += `doing: ${bot.doing}\n` 
    str += `profit: ${bot.profit}`

    const boxenBotOptions = {
        padding: 1,
        margin: 0,
        borderStyle: "round",
        borderColor: status_color,
        backgroundColor: "#333"
    };
    const botBox = boxen(str, boxenBotOptions);

    console.log(botBox)
}

export function printTA(bot, status_color) {
    const boxenBotOptions = {
        padding: 1,
        margin: 0,
        borderStyle: "round",
        borderColor: status_color,
        backgroundColor: "#333"
    };

    let entries = Object.entries(bot.trends)

    let str = `Starting analysis cycle of ${bot.symbol} @ ${parseTimestamp( Date.now() )}`

    if(bot.status === 'ta') {
        
        str = ""

        entries.forEach( symbol => {
     
            Object.keys(symbol[1]).forEach( tf => {
                
                let obj = symbol[1][tf] 

                let trend_direction = obj.TREND === "uptrend" ?
                chalk.bold.greenBright(obj.TREND) :
                chalk.bold.redBright(obj.TREND)
                
                let RSI_text = chalk.bold.white(obj.RSI.toFixed(2))
                
                str += `\n/ ${tf} Trend Analysis /\n`
                str += `RSI: ${RSI_text}\n`
                str += `trend: ${trend_direction}\n` 

            })
            
        })
    }
    
    const taBox = boxen(str, boxenBotOptions);

    console.log(taBox)
}

function parseTimestamp(now) {
    let date = new Date( now )
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}