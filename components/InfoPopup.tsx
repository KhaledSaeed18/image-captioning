"use client"

import { Info } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface InfoPopupProps {
    maxSize: number
    allowedTypes: string[]
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function InfoPopup({
    maxSize,
    allowedTypes,
    open,
    onOpenChange
}: InfoPopupProps) {
    const sizeMB = maxSize / (1024 * 1024)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" title="File requirements (Ctrl+I)">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">File requirements</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>File Requirements</DialogTitle>
                    <DialogDescription>
                        Please make sure your image meets the following requirements
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Maximum File Size</h4>
                        <p className="text-sm text-muted-foreground">
                            Images must be smaller than {sizeMB}MB
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Accepted File Types</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {allowedTypes.map((type) => (
                                <li key={type}>{type.replace('image/', '').toUpperCase()}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}