"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Upload, RefreshCw, MessageSquareText, Copy, CheckCheck } from "lucide-react"
import History from "./History"

interface HistoryItem {
    id: string
    image: string
    caption: string
    timestamp: number
}

export default function ImageCaptioning() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [caption, setCaption] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [objectUrl, setObjectUrl] = useState<string>("")
    const [isCopied, setIsCopied] = useState(false)
    const [history, setHistory] = useState<HistoryItem[]>([])

    useEffect(() => {
        const storedHistory = localStorage.getItem("imageCaptioningHistory")
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory))
        }

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

            const newHistoryItem: HistoryItem = {
                id: Date.now().toString(),
                image: selectedImage,
                caption: data.caption,
                timestamp: Date.now(),
            }
            const updatedHistory = [newHistoryItem, ...history].slice(0, 10)
            setHistory(updatedHistory)
            localStorage.setItem("imageCaptioningHistory", JSON.stringify(updatedHistory))
        } catch (error) {
            console.error("Error generating caption:", error)
            setCaption("Error generating caption. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(caption)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg border-2 border-dashed border-white p-4 text-center">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {selectedImage ? (
                    <Image
                        src={selectedImage || "/placeholder.svg"}
                        alt="Uploaded image"
                        fill
                        className="object-contain"
                        unoptimized
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <Upload className="size-10 text-blue-600 mb-2" />
                        <p className="text-sm text-blue-600">
                            Click or drag and drop an image here
                        </p>
                    </div>
                )}
            </div>
            <button
                onClick={generateCaption}
                disabled={!selectedImage || isLoading}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generating...
                    </>
                ) : (
                    "Generate Caption"
                )}
            </button>
            {caption && (
                <div className="w-full p-6 rounded-xl backdrop-blur-sm border border-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <MessageSquareText className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-blue-600">
                                Generated Caption
                            </h2>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                            {isCopied ? (
                                <>
                                    <CheckCheck className="w-4 h-4" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                    <div className="p-4 rounded-lg">
                        <p className="text-blue-700 leading-relaxed">
                            {caption}
                        </p>
                    </div>
                </div>
            )}
            <History history={history} />
        </div>
    )
}

