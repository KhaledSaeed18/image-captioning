'use client'

import { useEffect } from 'react'

type ShortcutConfig = {
    key: string
    ctrlKey?: boolean
    altKey?: boolean
    shiftKey?: boolean
    callback: () => void
    preventDefault?: boolean
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            shortcuts.forEach(({ key, ctrlKey, altKey, shiftKey, callback, preventDefault }) => {
                if (
                    event.key.toLowerCase() === key.toLowerCase() &&
                    (!ctrlKey || event.ctrlKey) &&
                    (!altKey || event.altKey) &&
                    (!shiftKey || event.shiftKey)
                ) {
                    if (preventDefault) {
                        event.preventDefault()
                    }
                    callback()
                }
            })
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [shortcuts])
}