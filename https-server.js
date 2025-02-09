import { createServer } from 'https';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

// Read SSL certificates
const options = {
    key: readFileSync('localhost+2-key.pem'),
    cert: readFileSync('localhost+2.pem')
};

const server = createServer(options, (req, res) => {
    console.log(`Received request for: ${req.url}`);
    
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    try {
        const content = readFileSync(join(__dirname, filePath));
        const ext = String(filePath.split('.').pop());
        const contentType = mimeTypes['.' + ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Service-Worker-Allowed': '/',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        });
        res.end(content);
        console.log(`Successfully served ${filePath} with content-type: ${contentType}`);
    } catch (error) {
        console.error(`Error serving ${filePath}:`, error);
        if (error.code === 'ENOENT') {
            res.writeHead(404);
            res.end(`File not found: ${filePath}`);
        } else {
            res.writeHead(500);
            res.end(`Server error: ${error.message}`);
        }
    }
});

server.listen(3000, '0.0.0.0', () => {
    console.log('Server running at https://0.0.0.0:3000/');
});
