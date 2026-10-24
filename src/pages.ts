import type { Client } from "@notionhq/client";
import type { VisionResponse } from "./vision";

interface PageInput {
    response: VisionResponse;
    link: string;
    resumeVersion: number;
}

export interface PageData {
    company: string;
    position: string;
    industry: string;
    status: string;
    link: string;
    date: string;
    resumeVersion: number;
}

export async function createPageData({
    response,
    link,
    resumeVersion
}: PageInput): Promise<PageData> {
    return {
        company: response.company,
        position: response.position,
        industry: response.industry,
        link,
        status: "Applied",
        date: new Date().toISOString().split('T')[0],
        resumeVersion: resumeVersion,
    };

}


export async function createPage(client: Client, database_id: string, data: PageData) {
    const response = await client.pages.create({
        parent: {
            type: "database_id",
            database_id: database_id,
        },
        properties: {
            "Company": {
                title: [
                    {
                        text: {
                            content: data.company,
                        },
                    },
                ],
            },
            "Position": {
                "rich_text": [
                    {
                        text: {
                            content: data.position,
                        },
                    },
                ],
            },
            "Industry": {
                "multi_select": [
                    {
                        name: data.industry,
                    },
                ],
            },
            "Status": {
                "select": {
                    "name": "Applied"
                }

            },
            "Application Link": {
                "url": data.link,
            },
            "Date Applied / Contacted": {
                "date": {
                    "start": data.date,
                },
            },
            "Resume Version": {
                "number": data.resumeVersion,
            },
        },
    });
    return response;
}