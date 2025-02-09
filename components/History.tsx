import Image from "next/image"

interface HistoryItem {
    id: string
    image: string
    caption: string
    timestamp: number
}

interface HistoryProps {
    history: HistoryItem[]
}

export default function History({ history }: HistoryProps) {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">History</h2>
            {history.length === 0 ? (
                <p className="text-gray-500">No history yet. Generate some captions!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {history.map((item) => (
                        <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm">
                            <div className="relative w-full aspect-video">
                                <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt="Historical image"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-gray-500 mb-2">{new Date(item.timestamp).toLocaleString()}</p>
                                <p className="text-sm">{item.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

