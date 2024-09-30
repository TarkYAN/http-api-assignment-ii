const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const users = {};

const respondJSON = (request, response, status, object) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(object));
    response.end();
};

const respond = (request, response, status, content, type) => {
    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
    response.write(content);
    response.end();
};

const respondJSONHead = (request, response, status) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end();
};

const getIndex = (request, response) => {
    respond(request, response, 200, index, 'text/html');
};

const getCSS = (request, response) => {
    respond(request, response, 200, css, 'text/css');
};

// GET /getUsers
const getUsers = (request, response) => {
    const responseJSON = {
        users,
    };
    respondJSON(request, response, 200, responseJSON);
};

// HEAD /getUsers
const getUsersHead = (request, response) => {
    respondJSONHead(request, response, 200);
};

// POST /addUser
const addUser = (request, response) => {
    const body = [];

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const params = new URLSearchParams(bodyString);
        const name = params.get('name');
        const age = params.get('age');

        if (!name || !age) {
            const responseJSON = {
                message: 'Name and age are both required.',
                id: 'missingParams',
            };
            return respondJSON(request, response, 400, responseJSON);
        }

        if (users[name]) {
            users[name].age = age;
            return respondJSONHead(request, response, 204); 
        }

        users[name] = { name, age };
        const responseJSON = { message: 'User added successfully.' };
        return respondJSON(request, response, 201, responseJSON);
    });
};

const notReal = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };
    respondJSON(request, response, 404, responseJSON);
};


const notRealHead = (request, response) => {
    respondJSONHead(request, response, 404);
};

const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };
    respondJSON(request, response, 404, responseJSON);
};

module.exports = {
    getIndex,
    getCSS,
    getUsers,
    getUsersHead,
    addUser,
    notReal,
    notRealHead,
    notFound,
};
