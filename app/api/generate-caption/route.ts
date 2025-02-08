import { NextResponse } from "next/server"
import { HfInference } from "@huggingface/inference"

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function POST(request: Request) {
    try {
        const { image } = await request.json()

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 })
        }

        // Validate base64 image format
        if (!image.startsWith('data:image/')) {
            return NextResponse.json({ error: "Invalid image format" }, { status: 400 })
        }

        // Extract base64 data
        const base64Image = image.split(';base64,').pop()
        if (!base64Image) {
            return NextResponse.json({ error: "Invalid base64 image data" }, { status: 400 })
        }

        // Convert base64 to buffer
        const imageBuffer = Buffer.from(base64Image, 'base64')

        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        if (imageBuffer.length > MAX_SIZE) {
            return NextResponse.json({ error: "Image too large" }, { status: 400 })
        }

        // Verify buffer is not empty
        if (imageBuffer.length === 0) {
            return NextResponse.json({ error: "Empty image data" }, { status: 400 })
        }

        // Convert buffer to Blob
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