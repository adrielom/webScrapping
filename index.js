const puppeteer = require('puppeteer');

async function CalculateDelivery(address1, address2) {
    try {
        const browser = await puppeteer.launch({ headless: false }   /*this opens up a browser*/);
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

const address1 = 'Av A 902 Conjunto Ceará Fortaleza - CE';
const address2 = 'Belo Horizonte 2000';


let obj;

CalculateDelivery(address1, address2).then(r => {

    const json = JSON.stringify(r);
    obj = json
    console.log(json)
})
