import sharp from 'sharp';

const createIcon = async (size) => {
    const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${size}" height="${size}" fill="#4a90e2"/>
            <text x="50%" y="50%" font-family="Arial" font-size="${size/4}" 
                  fill="white" text-anchor="middle" dy=".3em">PWA</text>
        </svg>
    `;

    await sharp(Buffer.from(svg))
        .png()
        .toFile(`icon-${size}.png`);
};

Promise.all([
    createIcon(192),
    createIcon(512)
]).catch(console.error);
