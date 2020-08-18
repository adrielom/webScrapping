const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://ligmototaxi.com.br/simulacao?tipo=M');

    // example: get innerHTML of an element
    await page.evaluate(() => {
        document.querySelector("#txtEnderecoE1").value = 'Av A 902 Conjunto Ceará Fortaleza - CE'
        document.querySelector("#txtEnderecoE2").value = 'Av Doutor Silas Munguba 4410 Fortaleza - CE'
    })

    await page.click('.divPacote > button[data-id="1"]')
    await page.click('.divPacote > button[data-id="2"]')
    await page.waitFor(500)
    await page.evaluate(() => {
        console.log(document.querySelector('#divBotaoCalcularFreteUniversal > .botao1').value)
    })
    await page.click('#divBotaoCalcularFreteUniversal > .botao1')

    await page.waitForSelector('#divValorFreteAltP')
    console.log('hey')
    await page.waitFor(500)
    await page.evaluate(() => {
        console.log(document.querySelector('#divValorFreteAltP').value)
    })

    await browser.waitForTarget(() => false)
    await browser.close();
})();