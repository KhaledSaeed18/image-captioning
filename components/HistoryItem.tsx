import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HistoryItemProps {
    item: {
        id: string
        image: string
        caption: string
        timestamp: number
    }
}

export default function HistoryItem({ item }: HistoryItemProps) {
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
                        className="object-cover rounded-md"
                        unoptimized
                    />
                </div>
                <p className="text-sm">{item.caption}</p>
            </CardContent>
        </Card>
    )
}

