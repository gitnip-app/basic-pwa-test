from aiohttp import web
import ssl
import os
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

async def handle_static(request):
    path = request.path
    if path == '/':
        path = '/index.html'
    
    # Remove leading slash
    path = path[1:]
    
    logger.info(f'Handling request for: {path}')
    
    try:
        with open(path, 'rb') as f:
            content = f.read()
            
        # Set content type
        content_type = 'text/html'
        if path.endswith('.js'):
            content_type = 'text/javascript'
        elif path.endswith('.json'):
            content_type = 'application/json'
        elif path.endswith('.png'):
            content_type = 'image/png'
        elif path.endswith('.svg'):
            content_type = 'image/svg+xml'
            
        headers = {
            'Service-Worker-Allowed': '/',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
            'Content-Type': content_type
        }
        
        logger.info(f'Serving {path} with content-type: {content_type}')
        return web.Response(body=content, headers=headers)
    except FileNotFoundError:
        logger.error(f'File not found: {path}')
        return web.Response(status=404, text=f'File not found: {path}')
    except Exception as e:
        logger.error(f'Error serving {path}: {str(e)}')
        return web.Response(status=500, text=f'Server error: {str(e)}')

app = web.Application()
app.router.add_get('/{tail:.*}', handle_static)

ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain('localhost+2.pem', 'localhost+2-key.pem')

if __name__ == '__main__':
    logger.info('Starting server...')
    web.run_app(app, host='0.0.0.0', port=3000, ssl_context=ssl_context)
