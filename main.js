import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

await Actor.init();

const startUrls = [
    { url: 'https://www.lg.com/br/business/manual/' }
];

const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page, request, log }) => {
        log.info(`Acessando ${request.url}`);

        // Preencher filtros
        await page.waitForSelector('#country');
        await page.selectOption('#country', 'Brasil');
        await page.selectOption('#manualType', 'Installation Manual');
        await page.selectOption('#language', 'Portuguese');
        await page.fill('#startDate', '2024-06-01');
        await page.fill('#endDate', '2025-06-01');

        // Submeter busca
        await Promise.all([
            page.waitForResponse((res) => res.url().includes('/searchManualList') && res.status() === 200),
            page.click('#searchBtn')
        ]);

        // Aguardar resultados
        await page.waitForSelector('.result-table a[href$=".pdf"]', { timeout: 15000 });

        const manuais = await page.$$eval('.result-table a[href$=".pdf"]', (links) => {
            return links.map(link => ({
                titulo: link.innerText.trim(),
                url: link.href
            }));
        });

        for (const manual of manuais) {
            await Actor.pushData(manual); // Salva no Dataset
        }

        log.info(`Foram encontrados ${manuais.length} manuais.`);
    },
    maxRequestsPerCrawl: 1,
    headless: true,
    maxConcurrency: 1
});

await crawler.run(startUrls);
await Actor.exit();
