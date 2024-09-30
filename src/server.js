const http = require('http');
const url = require('url');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url, true);

    // Route requests to appropriate handler
    if (parsedUrl.pathname === '/') {
        responseHandler.getIndex(request, response);
    }
    else if (parsedUrl.pathname === '/style.css') {
        responseHandler.getCSS(request, response);
    }
    else if (parsedUrl.pathname === '/getUsers') {
        if (request.method === 'GET') {
            responseHandler.getUsers(request, response);
        } else if (request.method === 'HEAD') {
            responseHandler.getUsersHead(request, response);
        }
    } else if (parsedUrl.pathname === '/notReal') {
        if (request.method === 'GET') {
            responseHandler.notReal(request, response);
        } else if (request.method === 'HEAD') {
            responseHandler.notRealHead(request, response);
        }
    } else if (parsedUrl.pathname === '/addUser' && request.method === 'POST') {
        responseHandler.addUser(request, response);
    } else {
        responseHandler.notFound(request, response);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});
