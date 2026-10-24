import type { Client } from "@notionhq/client";

const DB_ID = process.env.DATABASE_ID;

export function getDBID(): string {
    if (!DB_ID) {
        throw new Error("DATABASE_ID is not set in .env");
    }
    return DB_ID;
}

export async function getDB(client: Client) {
    const response = await client.databases.retrieve({ database_id: getDBID() });
    return response;
}

export async function getDBEntries(client: Client, query?: any) {
    if (!query) {
        query = { database_id: getDBID() };
    }
    const response = await client.databases.query(query);
    return response;
}