import sharp from 'sharp';

const sizes = {
    // iOS Icons
    'apple-touch-icon-180.png': 180,
    'apple-touch-icon-167.png': 167,
    'apple-touch-icon-152.png': 152,
    'apple-touch-icon-120.png': 120,
    
    // iOS Splash Screens
    'apple-splash-2048x2732.png': { width: 2048, height: 2732 }, // 12.9" iPad Pro
    'apple-splash-1668x2388.png': { width: 1668, height: 2388 }, // 11" iPad Pro
    'apple-splash-1536x2048.png': { width: 1536, height: 2048 }, // 9.7" iPad
    'apple-splash-1290x2796.png': { width: 1290, height: 2796 }, // iPhone 14 Pro Max
    'apple-splash-1179x2556.png': { width: 1179, height: 2556 }, // iPhone 14 Pro
    'apple-splash-1170x2532.png': { width: 1170, height: 2532 }, // iPhone 14
    'apple-splash-1284x2778.png': { width: 1284, height: 2778 }, // iPhone 13 Pro Max
    'apple-splash-1125x2436.png': { width: 1125, height: 2436 }, // iPhone X/XS
};

async function generateImages() {
    for (const [filename, size] of Object.entries(sizes)) {
        try {
            if (typeof size === 'number') {
                // Generate square icons
                await sharp('icon-512.png')
                    .resize(size, size)
                    .toFile(filename);
                console.log(`Generated ${filename}`);
            } else {
                // Generate splash screens with centered logo
                const { width, height } = size;
                const logoSize = Math.min(width, height) / 4; // Logo will be 1/4 of the smaller dimension
                
                await sharp('icon-512.png')
                    .resize(Math.round(logoSize), Math.round(logoSize))
                    .toBuffer()
                    .then(logo => {
                        return sharp({
                            create: {
                                width: width,
                                height: height,
                                channels: 4,
                                background: { r: 255, g: 255, b: 255, alpha: 1 }
                            }
                        })
                        .composite([{
                            input: logo,
                            top: Math.round((height - logoSize) / 2),
                            left: Math.round((width - logoSize) / 2)
                        }])
                        .toFile(filename);
                    });
                console.log(`Generated ${filename}`);
            }
        } catch (err) {
            console.error(`Error generating ${filename}:`, err);
        }
    }
}

generateImages().catch(console.error);
