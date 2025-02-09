import { useState } from "react"
import Image from "next/image"
import { Copy, Check, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface HistoryItemProps {
    item: {
        id: string
        image: string
        caption: string
        timestamp: number
    }
    onDelete: (id: string) => void
}

export default function HistoryItem({
    item,
    onDelete
}: HistoryItemProps) {
    const [isCopied, setIsCopied] = useState(false)

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(item.caption)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">
                    {new Date(item.timestamp).toLocaleString()}
                </CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            title="Delete item"
                        >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete History Item</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this item? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => onDelete(item.id)}
                                className="bg-[#EC4141] hover:bg-[#EC4141]/90 text-white"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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
                        title="Copy caption to clipboard"
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