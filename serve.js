const http = require('http');

// small server to serve html and js from ./docs

const server = http.createServer((req, res) => {
    const fs = require('fs');
    const path = require('path');
    let filePath = path.join(__dirname, 'docs', decodeURIComponent(req.url));

    if (filePath.endsWith('\\')) {
        filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'text/javascript');
        } else if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.ico')) {
            res.setHeader('Content-Type', 'image/x-icon');
        }

        if (err) {
            res.writeHead(404);
            res.end('Not Found: ' + filePath);
            return;
        }

        res.writeHead(200);
        res.end(data);
    });

});

server.listen(8080, () => {
    console.log('Server running on port 8080');
}  );