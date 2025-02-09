import ImageCaptioning from "@/components/ImageCaptioning"
import Header from "@/components/Header"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <main className="flex-1 p-6">
          <ImageCaptioning />
        </main>
      </div>
    </div>
  )
}

