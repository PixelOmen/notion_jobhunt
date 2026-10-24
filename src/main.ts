require("dotenv").config();

import fs from "fs";
import readline from "readline";
import { Client } from "@notionhq/client";

import * as db from "./db";
import * as pages from "./pages";
import * as vision from "./vision";
import type { PageData } from "./pages";

const CURRENT_DEV_RESUME = 6;
const CURRENT_PROD_RESUME = 5;
const CURRENT_IT_RESUME = 1;
const CURRENT_SE_RESUME = 2;
const NOTIONCLIENT = new Client({
    auth: process.env.NOTION_API_KEY,
});


async function analyzeImage(): Promise<vision.VisionResponse>  {
    const result = await vision.analyzeImage('./screenshot.jpg');
    if (result.error) {
        throw new Error(result.error);
    }
    return result;
}

async function createPageData(url: string): Promise<PageData | undefined> {
    if (!url) {
        console.log("No URL provided, aborting");
        return;
    }

    const result = await analyzeImage();
    if (result.error) {
        console.log(result.error);
        return;
    }
    console.log(result);

    let resumeVersion = 0;
    switch (result.industry) {
        case "Software Development":
            resumeVersion = CURRENT_DEV_RESUME;
            break;
        case "Post-Production":
            resumeVersion = CURRENT_PROD_RESUME;
            break;
        case "Systems Engineer":
            resumeVersion = CURRENT_SE_RESUME;
            break;
        case "IT Support":
            resumeVersion = CURRENT_IT_RESUME;
            break;
        default:
            throw new Error(`Invalid industry: ${result.industry}`);
    }

    const data = {
        response: result,
        link: url,
        resumeVersion: resumeVersion,
    };
    return await pages.createPageData(data);
}

function main() {
    fs.watchFile("./screenshot.jpg", { interval: 1000 }, async (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
            console.log(`File ${"screenshot.jpg"} has been changed at ${curr.mtime}`);
            const userInput = readline.createInterface({
              input: process.stdin,
              output: process.stdout
            });
            userInput.question("Enter URL: ", async (url) => {
                userInput.close();
                const pageData = await createPageData(url);
                if (!pageData) return;
                console.log(pageData);
                const pageresponse = await pages.createPage(NOTIONCLIENT, db.getDBID(), pageData);
                console.log(pageresponse);
            });
        }
    });
}

main();
