"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { HistoryIcon, Trash2 } from "lucide-react"
import HistoryItem from "@/components/HistoryItem"
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

    const clearHistory = () => {
        localStorage.removeItem("imageCaptioningHistory")
        setHistory([])
        window.dispatchEvent(new Event('historyUpdate'))
    }

    const deleteHistoryItem = useCallback((id: string) => {
        const storedHistory = localStorage.getItem("imageCaptioningHistory")
        if (storedHistory) {
            const history = JSON.parse(storedHistory)
            const newHistory = history.filter((item: HistoryItemType) => item.id !== id)
            localStorage.setItem("imageCaptioningHistory", JSON.stringify(newHistory))
            setHistory(newHistory)
            window.dispatchEvent(new Event('historyUpdate'))
        }
    }, [])

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" title="View history">
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
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="flex w-full items-center gap-2 my-2"
                            disabled={history.length === 0}
                            title="Clear all history"
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear All
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete all your caption history.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={clearHistory}
                                className="bg-[#EC4141] hover:bg-[#EC4141]/90 text-white"
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    {history.length === 0 ? (
                        <p className="text-muted-foreground">No history yet.</p>
                    ) : (
                        history.map((item) =>
                            <HistoryItem
                                key={item.id}
                                item={item}
                                onDelete={deleteHistoryItem}
                            />)
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

