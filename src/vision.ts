import sharp from "sharp";
import OpenAI from "openai";


export interface VisionResponse {
    error: string;
    position: string;
    company: string;
    industry: string;
}

export async function resizeImg(path: string, width: number): Promise<string> {
    const image = sharp(path);
    await image.resize({ width: width }).toFile(path + "-resized.png");
    const resizedBuffer = await image.resize({ width: width }).toBuffer();
    return resizedBuffer.toString('base64') as string;
}


export async function analyzeImage(path: string, resizeWidth: number = 640) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
        throw new Error('No OpenAI API key provided');
    }
    const openai = new OpenAI({ apiKey: key });
    const imageBase64 = await resizeImg(path, resizeWidth);
    try {
        const response = await openai.chat.completions.create({
        model: 'gpt-4o-2024-08-06',
        messages: [
            { role: 'system', content: `You are part of an API and only provide answers in JSON format:
                You are very good at extracting information from images.
                You are given an image and you need to extract the job title and company name from it.
                You know that if it's LinkedIn posting, the company will be listed above the job title.
                You select the industry from only 4 options: "Software Development", "Post-Production", "Systems Engineer", or "IT Support".
                "Systems Engineer" is selected when the industry is both "Post-Production" and "IT Support".
                { "error": string, "position": string, "company": string, "industry": string },
                You do not include any other formatting in our output, like \`\`\`json.` },
            { 
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'Please give me the Job title and Company name from this image.',
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${imageBase64}`
                        }
                    }
                ],
            }
        ],
        stream: false,
        });

        const responseContent = response.choices[0].message.content;
        if (!responseContent) {
            throw new Error(`No response content: ${JSON.stringify(response)}`);
        }
        return JSON.parse(responseContent) as VisionResponse;
    } catch (error) {
        throw new Error(`Error analyzing image: ${error}`);
    }

}
