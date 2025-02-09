"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { HistoryIcon } from "lucide-react"
import HistoryItem from "@/components/HistoryItem"

interface HistoryItemType {
    id: string
    image: string
    caption: string
    timestamp: number
}

export default function Sidebar() {
    const [history, setHistory] = useState<HistoryItemType[]>([])

    const updateHistory = useCallback(() => {
        const storedHistory = localStorage.getItem("imageCaptioningHistory")
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory))
        }
    }, [])

    useEffect(() => {
        updateHistory()

        window.addEventListener('historyUpdate', updateHistory)
        
        return () => {
            window.removeEventListener('historyUpdate', updateHistory)
        }
    }, [updateHistory])

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <HistoryIcon className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>
                        History
                    </SheetTitle>
                    <SheetDescription>
                        View your generated captions.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="mt-4 h-[calc(100vh-8rem)]">
                    {history.length === 0 ? (
                        <p className="text-muted-foreground">No history yet.</p>
                    ) : (
                        history.map((item) => <HistoryItem key={item.id} item={item} />)
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

