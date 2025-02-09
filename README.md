# AI Image Captioning App

A modern web application that generates captions for images using AI.

## 🚀 Features

- **Instant Image Captioning**: Upload images and get AI-generated descriptions in seconds
- **Multiple Image Format Support**: Handles JPEG, PNG, WebP, and GIF formats
- **File Validation**: Automated checks for file size and type
- **History Management**: Keeps track of your recent image captions
- **Keyboard Shortcuts**:
  - `Ctrl + O`: Open file upload dialog
  - `Ctrl + G`: Generate caption
  - `Ctrl + R`: Reset/clear image
  - `Ctrl + C`: Copy caption to clipboard
  - `Ctrl + I`: Toggle info popup
  - `Ctrl + M`: Toggle theme
  - `Ctrl + H`: Toggle history sidebar
  - `Ctrl + K`: Show keyboard shortcuts
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Supports system theme preferences

## 🛠️ Technology Stack

- **Frontend**:
  - Next.js 14 (React Framework)
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - Lucide React Icons

- **Backend**:
  - Next.js API Routes
  - Hugging Face Inference API
  - BLIP Image Captioning Model

## 🤖 AI Model

This project uses the [BLIP Image Captioning Large Model](https://huggingface.co/Salesforce/blip-image-captioning-large) by Salesforce, hosted on Hugging Face. The model is capable of generating detailed and accurate captions for a wide variety of images.

## 🚀 Getting Started

1- Clone the repository

```bash
git clone https://github.com/KhaledSaeed18/image-captioning.git
```

2- Install dependencies

```bash
npm install
```

3- Set up environment variables

```env
HUGGINGFACE_API_KEY=your_api_key_here
```

4- Run the development server

```bash
npm run dev
```

5- Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔒 Security & Limitations

- Maximum file size: 10MB
- Supported image formats: JPEG, PNG, WebP, GIF
- All processing is done server-side
- No images are stored permanently

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- [Salesforce BLIP Model](https://huggingface.co/Salesforce/blip-image-captioning-large)
- [Hugging Face](https://huggingface.co/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
