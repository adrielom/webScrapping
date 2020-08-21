const puppeteer = require('puppeteer');
const express = require('express')

const app = express()
const PORT = 5600


app.get('/', async (req, res) => {

    let address1 = 'Av A 902 Conjunto Ceará Fortaleza - CE';
    let address2 = 'Rua Belo Horizonte 2830';
    address1 = address1 !== req.query.address1 ? address1 : req.query.address1
    address2 = req.query.address2

    let obj
    try {
        await CalculateDelivery(address1, address2).then(json => {
            obj = json
        })
    } catch (error) {
        console.log(error)
    }
    res.json(obj)
})


app.listen(PORT, () => {
    console.log('listening to port ' + PORT)
})

async function CalculateDelivery(address1, address2) {
    try {
        const browser = await puppeteer.launch(/*{ headless: false }   this opens up a browser*/);
        const page = await browser.newPage();

        await page.goto('https://ligmototaxi.com.br/simulacao?tipo=M');

        await page.evaluate(({ address1, address2 }) => {
            document.querySelector("#txtEnderecoE1").value = address1
            aw = document.querySelector('#txtEnderecoE1').value
            document.querySelector("#txtEnderecoE2").value = address2
        }, { address1, address2 })

        await page.click('.divPacote > button[data-id="1"]')
        await page.click('.divPacote > button[data-id="2"]')
        await page.waitFor(1000)

        await page.click('#divBotaoCalcularFreteUniversal > .botao1')

        await page.waitForSelector('#divValorFreteAltP')
        const getValue = await page.$$eval('#divValorFreteAltP', rests => rests.map(res => res.innerHTML));
        await page.waitForSelector('.n20distancia ~ h5')
        const getDist = await page.$$eval('.n20distancia ~ h5', rests => rests.map(res => res.innerHTML));
        await page.waitForSelector('.n20tempo ~ h5')
        const getTime = await page.$$eval('.n20tempo ~ h5', rests => rests.map(res => res.innerHTML));

        await browser.close();
        const retObj = { value: getValue.toString().replace('\n', '').trim(), distance: getDist.toString().replace('\n', '').trim(), time: getTime.toString().replace('\n', '').trim() }
        return retObj

    } catch (err) {
        return { err: err, msg: 'Por favor, cheque os campos de endereço' }

    }

};

