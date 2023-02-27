import playwright, { selectors, Page } from "playwright";
import { getTitle, getImages, getContacts, getAddress, getUsefulInformation, getServices, getActivities } from "./scraping";
import Queue from "queue-promise";
import * as dotenv from 'dotenv';
import fs from "fs";

dotenv.config({ path: __dirname + '/.env' });

const queue = new Queue({
	concurrent: 1,
	interval: 1000,
	start: true,
});

const BASE_URL = process.env.BASE_URL;

async function main(id = "371964") {
	const data = [];
	const browser = await playwright.chromium.launch({
		headless: false // setting this to true will not run the UI
	});

	const context = await browser.newContext({ storageState: 'storageState.json' });
	const page = await context.newPage();


	await page.goto(`${BASE_URL}/lieu/${id}/`, { waitUntil: 'networkidle' });

	queue.enqueue(async () => {
		data.push(await getTitle(page));
	});
	queue.enqueue(async () => {
		data.push(await getImages(page));
	});
	queue.enqueue(async () => {
		data.push(await getContacts(page));
	});
	queue.enqueue(async () => {
		data.push(await getAddress(page));
	});

	// PRIVATE AREA
	queue.enqueue(async () => {
		await page.goto(`${BASE_URL}/edition/${id}/`, { waitUntil: 'networkidle' });
	});
	queue.enqueue(() => {
		return getUsefulInformation(page);
	});
	queue.enqueue(() => {
		return getServices(page);
	})
	queue.enqueue(() => {
		return getActivities(page);
	})

	queue.enqueue(async () => {
		await browser.close();
	});


	// fs.writeFileSync("test.json", JSON.stringify({ title, images }));
}

main();