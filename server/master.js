import puppeteer from 'puppeteer'

export default class Puppet {
    
    constructor() {
        this.HEADLESS = true

    }
    async init() {
        
        const args =  [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
        ]
    
        const browser = await puppeteer.launch({
            args: args,
            headless: this.HEADLESS,
            ignoreHTTPSErrors: true,
        });

        return browser

    }
    async open()
    {
        this.browser = await this.init()

        this.page = await this.browser.newPage()
        
        const tradingview = "https://tradingview.com"
        
        this.page.goto(tradingview)
        
        console.log('page opened.');
    }
    
        
}