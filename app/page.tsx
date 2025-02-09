import ImageCaptioning from "@/components/ImageCaptioning"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-3xl rounded-lg p-6 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-600 sm:text-4xl">
          Image Captioning with BLIP
        </h1>
        <ImageCaptioning />
      </div>
    </main>
  )
}