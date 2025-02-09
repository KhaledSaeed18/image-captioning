import { useState } from "react"
import Image from "next/image"
import { Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface HistoryItemProps {
    item: {
        id: string
        image: string
        caption: string
        timestamp: number
    }
}

export default function HistoryItem({ item }: HistoryItemProps) {
    const [isCopied, setIsCopied] = useState(false)

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(item.caption)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle className="text-sm font-medium">{new Date(item.timestamp).toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative aspect-video w-full mb-2">
                    <Image
                        src={item.image || "/placeholder.svg"}
                        alt="Historical image"
                        fill
                        className="object-contain rounded-md"
                        unoptimized
                    />
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm flex-1 mr-2">{item.caption}</p>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={copyToClipboard}
                        className="h-8 w-8 flex-shrink-0"
                    >
                        {isCopied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}