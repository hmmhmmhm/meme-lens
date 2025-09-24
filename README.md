<div align="center">
  <img src="/public/og.png" alt="MemeLens" width="1200" height="630">
</div>

# MemeLens

A web-based camera lens effect tool that allows users to overlay character images with realistic camera lens frames and effects.

## Features

- **Camera Lens Effects**: Apply realistic camera lens overlays to character images and videos
- **Interactive Controls**: Adjust lens opacity, image scale, and positioning with intuitive controls
- **Multi-format Support**: Works with both static images (JPG, PNG, WebP) and videos (MP4, WebM, MOV)
- **Example Gallery**: Pre-loaded example images to get started quickly
- **Theme Support**: Light and dark theme options
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Internationalization**: Support for Korean, English, and Japanese languages
- **Free Download**: Save your creations without watermarks

## Live Demo

Visit [https://meme.aka.page](https://meme.aka.page) to try the application.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Internationalization**: next-intl
- **UI Components**: Radix UI
- **Deployment**: Cloudflare Workers via OpenNext
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/meme-lens.git
cd meme-lens
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload or Select an Image**: Click the upload button or choose from example images
2. **Position Your Image**: Drag and move your image within the camera lens frame
3. **Adjust Settings**: Use the control panel to modify lens opacity and image scale
4. **Download**: Save your creation as a high-quality image

## Development

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm build:cf` - Build for Cloudflare Workers
- `pnpm deploy` - Deploy to Cloudflare Workers
- `pnpm preview` - Preview Cloudflare Workers build locally

### Project Structure

```
app/
├── [locale]/                 # Internationalized routes
│   ├── components/          # React components
│   ├── layout.tsx          # Locale-specific layout
│   └── page.tsx            # Main application page
├── layout.tsx              # Root layout
└── globals.css             # Global styles

lib/
├── hooks/                  # Custom React hooks
└── utils/                  # Utility functions

messages/                   # Translation files
├── en.json
├── ja.json
└── ko.json

public/                     # Static assets
├── example-*.webp          # Example images
├── logo.png               # Application logo
└── ios-26-camera-*.webp   # Camera lens assets
```

## Deployment

The application is optimized for deployment on Cloudflare Workers using OpenNext.

### Cloudflare Workers Deployment

1. Configure your `wrangler.toml` file
2. Set up environment variables in Cloudflare
3. Run the deployment command:

```bash
pnpm deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Camera lens assets inspired by iOS camera interface
- Built with modern web technologies for optimal performance
- Internationalization support for global accessibility
