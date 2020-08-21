const puppeteer = require('puppeteer');
const express = require('express')

const app = express()
const PORT = process.env.PORT || 5600


app.get('/', async (req, res) => {

    let address1 = 'Av A 902 Conjunto Ceará Fortaleza - CE';
    let address2 = 'Rua Belo Horizonte 2830';
    address1 = address1 !== req.query.address1 ? address1 : req.query.address1
    address2 = req.query.address2
    console.log('testing 2')
    let obj
    try {
        console.log('testing 3')
        await CalculateDelivery(address1, address2).then(json => {
            obj = json
        })
    } catch (error) {
        console.log(error)
    }
    console.log('testing 4')
    res.json(obj)
})


app.listen(PORT, () => {
    console.log('listening to port ' + PORT)
})

async function CalculateDelivery(address1, address2) {
    console.log('calculate')
    try {
        console.log('production testing')
        const browser = await puppeteer.launch({
            'args': [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });

        console.log('launched')
        const page = await browser.newPage();

        await page.goto('https://ligmototaxi.com.br/simulacao?tipo=M');
        console.log('page')

        await page.evaluate(({ address1, address2 }) => {
            document.querySelector("#txtEnderecoE1").value = address1
            aw = document.querySelector('#txtEnderecoE1').value
            document.querySelector("#txtEnderecoE2").value = address2
        }, { address1, address2 })

        console.log('eval')
        await page.click('.divPacote > button[data-id="1"]')
        await page.click('.divPacote > button[data-id="2"]')
        await page.waitFor(1000)

        console.log('before click')
        await page.click('#divBotaoCalcularFreteUniversal > .botao1')

        console.log('after click')
        await page.waitForSelector('#divValorFreteAltP')
        const getValue = await page.$$eval('#divValorFreteAltP', rests => rests.map(res => res.innerHTML));
        await page.waitForSelector('.n20distancia ~ h5')
        const getDist = await page.$$eval('.n20distancia ~ h5', rests => rests.map(res => res.innerHTML));
        await page.waitForSelector('.n20tempo ~ h5')
        const getTime = await page.$$eval('.n20tempo ~ h5', rests => rests.map(res => res.innerHTML));

        await browser.close();
        const retObj = { value: getValue.toString().replace('\n', '').trim(), distance: getDist.toString().replace('\n', '').trim(), time: getTime.toString().replace('\n', '').trim() }
        console.log('testing 5 ' + retObj)
        return retObj

    } catch (err) {
        return { err: err, msg: 'Por favor, cheque os campos de endereço' }
    }

};

