import sharp from 'sharp';

const createScreenshot = async (width, height, filename) => {
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#ffffff"/>
            <rect x="0" y="0" width="100%" height="60" fill="#4a90e2"/>
            <text x="50%" y="38" font-family="Arial" font-size="24" 
                  fill="white" text-anchor="middle">PWA Test</text>
            <text x="50%" y="${height/2}" font-family="Arial" font-size="18" 
                  fill="#333333" text-anchor="middle">This is a minimal PWA test.</text>
        </svg>
    `;

    await sharp(Buffer.from(svg))
        .png()
        .toFile(filename);
};

// Generate screenshots
Promise.all([
    createScreenshot(1280, 720, 'screenshot.png'),
    createScreenshot(720, 1280, 'screenshot-mobile.png')
]).catch(console.error);
