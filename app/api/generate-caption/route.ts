import { NextResponse } from "next/server"
import { HfInference } from "@huggingface/inference"

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

const MAX_SIZE = 10 * 1024 * 1024; 
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: Request) {
    try {
        const { image } = await request.json()

        if (!image) {
            return NextResponse.json({
                error: "Please select an image to generate a caption"
            }, { status: 400 })
        }

        const [header, base64Image] = image.split(';base64,');
        if (!header || !base64Image) {
            return NextResponse.json({
                error: "Invalid image format. Please upload a valid image file"
            }, { status: 400 })
        }

        const imageType = header.split(':')[1];
        if (!ALLOWED_TYPES.includes(imageType)) {
            return NextResponse.json({
                error: `Unsupported image type. Allowed types: ${ALLOWED_TYPES.join(', ')}`
            }, { status: 400 })
        }

        const imageBuffer = Buffer.from(base64Image, 'base64')

        if (imageBuffer.length > MAX_SIZE) {
            const sizeMB = MAX_SIZE / (1024 * 1024);
            return NextResponse.json({
                error: `Image size exceeds ${sizeMB}MB limit. Please upload a smaller image`
            }, { status: 400 })
        }

        if (imageBuffer.length === 0) {
            return NextResponse.json({
                error: "The uploaded file appears to be empty"
            }, { status: 400 })
        }

        const blob = new Blob([imageBuffer], { type: 'image/webp' })

        const response = await hf.imageToText({
            model: "Salesforce/blip-image-captioning-large",
            data: blob
        })

        if (!response?.generated_text) {
            return NextResponse.json({ error: "No caption generated" }, { status: 500 })
        }

        console.log("Generated caption:", response);

        return NextResponse.json({ caption: response.generated_text })
    } catch (error) {
        console.error("Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
        })
        const errorMessage = error instanceof Error ? error.message : "Failed to generate caption"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}