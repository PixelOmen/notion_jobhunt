# Notion Job Hunt

Extract job information from a screenshot with OpenAI and record an application in a Notion database.

## Setup

1. Install Node.js and run `npm install` in the project root.
2. Copy `src/.env.example` to `src/.env` and fill in your Notion API key, Notion database ID, and OpenAI API key. Keep this file private.
3. Give your Notion integration access to the database.
4. Configure the database properties listed below.
5. Review the resume version constants in `src/main.ts` to match your own resumes.

## Notion database properties

| Property | Type | Values |
| --- | --- | --- |
| Company | Title | Company name |
| Position | Rich text | Job title |
| Industry | Multi-select | Software Development, Post-Production, Systems Engineer, IT Support |
| Status | Select | Applied |
| Application Link | URL | Job listing URL |
| Date Applied / Contacted | Date | Application date |
| Resume Version | Number | Resume version number |

## Run

The source uses TypeScript, but the project does not currently include a TypeScript runner or a start script. With `tsx` available, run from the `src` directory:

```powershell
cd src
npx tsx main.ts
```

The program reads `.env` and watches `screenshot.jpg` relative to the current working directory. Save or replace `src/screenshot.jpg` while the program is running, then enter the job listing URL when prompted. The program analyzes the image and creates a Notion entry with status Applied. Running it uses your OpenAI account.

The resized image is generated automatically. Screenshots, credentials, installed dependencies, logs, and scratch output are excluded from Git; keep `package-lock.json` committed.
