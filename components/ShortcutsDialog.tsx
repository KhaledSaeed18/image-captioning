'use client'

import { Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useState } from "react"

interface ShortcutItemProps {
    keys: string[]
    description: string
}

function ShortcutItem({ keys, description }: ShortcutItemProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{description}</span>
            <div className="flex items-center gap-1">
                {keys.map((key, index) => (
                    <kbd
                        key={index}
                        className="pointer-events-none select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100"
                    >
                        {key}
                    </kbd>
                ))}
            </div>
        </div>
    )
}

export function ShortcutsDialog() {
    const shortcuts = [
        { keys: ["Ctrl", "M"], description: "Toggle theme" },
        { keys: ["Ctrl", "H"], description: "Toggle history sidebar" },
        { keys: ["Ctrl", "O"], description: "Open image" },
        { keys: ["Ctrl", "G"], description: "Generate caption" },
        { keys: ["Ctrl", "R"], description: "Reset image" },
        { keys: ["Ctrl", "C"], description: "Copy caption" },
        { keys: ["Ctrl", "I"], description: "Toggle info dialog" },
        { keys: ["Ctrl", "K"], description: "Show keyboard shortcuts" },
    ]

    const [isOpen, setIsOpen] = useState(false)

    useKeyboardShortcuts([
        {
            key: "k",
            ctrlKey: true,
            callback: () => setIsOpen(prev => !prev),
            preventDefault: true
        }
    ])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="icon"
                    title="Keyboard shortcuts (Ctrl+K)"
                >
                    <Command className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {shortcuts.map((shortcut, index) => (
                        <ShortcutItem
                            key={index}
                            keys={shortcut.keys}
                            description={shortcut.description}
                            
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}