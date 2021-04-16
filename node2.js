const puppeteer = require('puppeteer');
const order = [
    // 测试 2012240217077163529529a
    // haier洗衣机
    'https://web.meiduzaixian.com/mall/mall-app/mall-core/index.html#/order/order-confirm?sku=201218203131277401a24ee&productCount=1&productSourceType=1&shopId=null',
    // 电压力锅
    'https://web.meiduzaixian.com/mall/mall-app/mall-core/index.html#/order/order-confirm?sku=2012181243581147ad1e340&productCount=1&productSourceType=1&shopId=null',
    // switch
    'https://web.meiduzaixian.com/mall/mall-app/mall-core/index.html#/order/order-confirm?sku=2012111741446219b3e108c&productCount=1&productSourceType=1&shopId=null',
    // 小天鹅洗衣机
    'https://web.meiduzaixian.com/mall/mall-app/mall-core/index.html#/order/order-confirm?sku=201218204943976e2d77885&productCount=1&productSourceType=1&shopId=null',

];
class NineF {
    constructor() {
    }

    run(orderUrl) {
        (async () => {
            const browser = await puppeteer.launch({ headless: false});

            // await this.loginMall(page);
            const page = await browser.newPage()
            await this.login9f(page);
            await page.goto(orderUrl, {
                waitUntil: [
                    'load',
                    'domcontentloaded',
                    'networkidle0'
                ]
            });
            await this.buyGoods(page);

            // await this.buyGoods(page);
            // await this.confirmOrder(page);
            // await this.submitOrder(page);
        })();

    }

    async buyGoods(page) {

        const buy = async () => {
            try {
                await page.waitForSelector('.btn', {
                    timeout: 2000
                })
                const buy = await page.$('.btn');
                await buy.click();
                await Promise.all([
                    page.waitForResponse(
                        response => response.url() === 'https://mall.meiduzaixian.com/mall/order/trade/doConfirmOrderV2'
                            && response.status() === 200, {
                            timeout: 1000
                        }
                    ),
                    page.waitForResponse(
                        response => response.url() === 'https://mall.meiduzaixian.com/mall/order/cashier/getCashInfo'
                            && response.status() === 200, {
                            timeout: 1000
                        }
                    ),
                    page.waitForResponse(
                        response => response.url() === 'https://mall.meiduzaixian.com/mall/order/notice/list'
                            && response.status() === 200, {
                            timeout: 1000
                        }
                    )
                ]);
            } catch (e) {
                console.error(e);
                const dialog = await page.waitForSelector('.jfm-box-wrapper', {
                    timeout: 1000
                }).then(async () => {
                    await page.$eval('.jfm-box-wrapper', (el) => {
                        el.remove();
                    });
                    await this.buyGoods(page);
                }).catch(async e => {
                    await page.reload({
                        waitUntil: [
                            'load',
                            'domcontentloaded',
                            'networkidle0'
                        ]
                    });
                    await this.buyGoods(page);
                });

            }

        }
        await buy().then(async () => await this.confirmOrder(page));
    }

    async submitOrder(page) {

        const submit = async () => {
            try {

            } catch (e) {
                console.error(e);
            }
        }
        await submit();
    }

    async confirmOrder(page) {
        console.warn('confirmOrder', page.url());
        const confirm = async () => {
            try {
                await page.waitForSelector('.check-out-footer .btn');
                // const submitBtn = await page.click('.check-out-footer .btn');
                await Promise.all([
                    page.click('.check-out-footer .btn'),
                    page.waitForResponse(
                        response => response.url() === 'https://mall.meiduzaixian.com/platform/ui/user/check/set/password'
                            && response.status() === 200
                    ),
                ]);
            } catch (e) {
                console.error(e);
                await page.reload({
                    waitUntil: [
                        'load',
                        'domcontentloaded',
                        'networkidle0'
                    ]
                });
                await this.confirmOrder(page);
            }
        }
        await confirm().then(async () => await this.submitOrder(page));
    }

    async login9f(page) {

        const login = async () => {
            try {
                await page.goto('https://web.meiduzaixian.com//mall/mall-app/mall-web/index.html#/index');
                await page.waitForSelector('.jfm-btn.border.main');
                await page.click('.jfm-btn.border.main');
                await page.waitForNavigation({
                    waitUntil: [
                        'load',
                        'domcontentloaded',
                        'networkidle0'
                    ]
                });
                await page.waitForSelector('.agree');
                await page.click('.agree');
                const loginInputs = await page.$$('input');
                await loginInputs[0].type('18817945128');
                await loginInputs[1].type('dww123321');
                await Promise.all([
                    await page.click('footer button'),
                    await page.waitForNavigation({
                        waitUntil: [
                            'load',
                            'domcontentloaded',
                            'networkidle0'
                        ]
                    })
                ])
            } catch (e) {
                await this.login9f(page);
            }
        }
        await login().then(async() => await this.loginMall(page));

    }

    async loginMall(page) {

        const login = async () => {
            try {
                await page.waitForSelector('img[alt="金豆商城"]');
                const loginMallBtn = await page.$('img[alt="金豆商城"]', );
                await loginMallBtn.click();
                await page.waitForNavigation({
                    waitUntil: [
                        'load',
                        'domcontentloaded',
                        'networkidle0'
                    ]
                });
            } catch (e) {
                await this.loginMall(page);
            }
        }
        await login();
    }

}

order.forEach((orderUrl) => {
    new NineF().run(orderUrl)
})
// const nineF = new NineF();
// nineF.run(order[0]);