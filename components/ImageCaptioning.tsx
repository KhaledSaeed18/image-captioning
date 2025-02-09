"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Upload, RefreshCw, Check, Copy, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { InfoPopup } from "./InfoPopup"

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
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [isCopied, setIsCopied] = useState(false)
    const { toast } = useToast()

    const MAX_SIZE = 10 * 1024 * 1024
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

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
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: `Please upload a valid image file. Allowed types: ${ALLOWED_TYPES.join(', ')}`,
                variant: "destructive",
            });
            return;
        }

        if (file.size > MAX_SIZE) {
            const sizeMB = MAX_SIZE / (1024 * 1024);
            toast({
                title: "File too large",
                description: `Image size must be less than ${sizeMB}MB`,
                variant: "destructive",
            });
            return;
        }

        const url = URL.createObjectURL(file);
        setObjectUrl(url);

        const reader = new FileReader();
        reader.onload = (e) => {
            setSelectedImage(e.target?.result as string);
        };
        reader.onerror = () => {
            toast({
                title: "Error",
                description: "Failed to read the image file. Please try again.",
                variant: "destructive",
            });
        };
        reader.readAsDataURL(file);
    };

    const generateCaption = async () => {
        if (!selectedImage) {
            toast({
                title: "No image selected",
                description: "Please select an image first",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/generate-caption", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: selectedImage }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate caption");
            }

            setCaption(data.caption);

            const newHistoryItem: HistoryItem = {
                id: Date.now().toString(),
                image: selectedImage,
                caption: data.caption,
                timestamp: Date.now(),
            };

            const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
            setHistory(updatedHistory);
            localStorage.setItem("imageCaptioningHistory", JSON.stringify(updatedHistory));

            window.dispatchEvent(new Event('historyUpdate'));

            toast({
                title: "Success",
                description: "Your image caption has been generated successfully.",
            });
        } catch (error) {
            console.error("Error generating caption:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to generate caption";
            setCaption("");
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(caption)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <div className="max-w-3xl mx-auto">
            <Card>
                <CardContent className="p-6">
                    <div className="mb-6">
                        <Input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            title="Upload Image"
                        />
                        <label
                            htmlFor="image-upload"
                            className="relative block w-full aspect-[17/6] rounded-lg border-2 border-dashed border-muted-foreground bg-muted p-4 text-center hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                        >
                            {selectedImage ? (
                                <Image
                                    src={selectedImage || "/placeholder.svg"}
                                    alt="Uploaded image"
                                    fill
                                    className="object-contain rounded-md"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full" title="Upload Image">
                                    <Upload className="w-12 h-12 mb-2" />
                                    <p className="text-sm">Click or drag and drop an image here</p>
                                </div>
                            )}
                        </label>
                    </div>
                    <div className="flex items-center justify-between gap-2" title="Generate caption button">
                        <Button onClick={generateCaption} disabled={!selectedImage || isLoading} className="w-full">
                            {isLoading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Generate Caption"
                            )}
                        </Button>
                        <InfoPopup maxSize={MAX_SIZE} allowedTypes={ALLOWED_TYPES} />
                        <Button
                            onClick={() => setSelectedImage(null)}
                            variant="outline"
                            disabled={!selectedImage}
                            title="Reset Field"
                        >
                            <RotateCw />
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {caption && (
                <Card className="mt-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Generated Caption</h2>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={copyToClipboard}
                                className="h-8 w-8"
                                title="Copy caption to clipboard"
                            >
                                {isCopied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-lg italic">&ldquo;{caption}&rdquo;</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

