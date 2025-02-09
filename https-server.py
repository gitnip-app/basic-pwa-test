from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Service-Worker-Allowed', '/')
        SimpleHTTPRequestHandler.end_headers(self)

    def guess_type(self, path):
        mimetype = SimpleHTTPRequestHandler.guess_type(self, path)
        if path.endswith('.js'):
            return 'text/javascript'
        return mimetype

httpd = HTTPServer(('0.0.0.0', 3000), CORSRequestHandler)

# Use the certificates we created earlier
httpd.socket = ssl.wrap_socket(
    httpd.socket,
    certfile='localhost+2.pem',
    keyfile='localhost+2-key.pem',
    server_side=True
)

print('Server running at https://0.0.0.0:3000/')
httpd.serve_forever()
