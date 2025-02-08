"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function ImageCaptioning() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [caption, setCaption] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [objectUrl, setObjectUrl] = useState<string>("")

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl)
            }
        }
    }, [objectUrl])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setObjectUrl(url)

            const reader = new FileReader()
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const generateCaption = async () => {
        if (!selectedImage) return

        setIsLoading(true)
        try {
            const response = await fetch("/api/generate-caption", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: selectedImage }),
            })

            if (!response.ok) {
                throw new Error("Failed to generate caption")
            }

            const data = await response.json()
            setCaption(data.caption)
        } catch (error) {
            console.error("Error generating caption:", error)
            setCaption("Error generating caption. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
            {selectedImage && (
                <div className="relative w-64 h-64">
                    <Image
                        src={selectedImage}
                        alt="Uploaded image"
                        layout="fill"
                        objectFit="contain"
                        unoptimized
                    />
                </div>
            )}
            <button
                onClick={generateCaption}
                disabled={!selectedImage || isLoading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {isLoading ? "Generating..." : "Generate Caption"}
            </button>
            {caption && (
                <div className="mt-4 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Generated Caption:</h2>
                    <p>{caption}</p>
                </div>
            )}
        </div>
    )
}

