# About

This is an implementation of a live, multi-user Agile pointing poker site, done in node.js on the backend and React on
the frontend.

Each browser's connection is considered a client. Reconnecting will start a new session. As the only state of a session
is the player's name (which is stored in HTML5 localstorage) and the player's vote, there's no need for anything
resembling a login.

The main goal of this project is educational.

License is GPL version 3 or any later version.

# Running

## Development mode

* `npm ci`
* Build the common library in `common` folder with `npm build` or `npm start` (if making live changes)
* Start the backend in `server` with `node src/index.js`
* Start the frontend in `client` with `npm start`
* Visit http://localhost:3000/

## Production mode

* `npm ci`
* `npm run build`
* `npm start`
* Visit http://localhost:8080/

## Run from Docker

Assuming you have Docker / [Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
installed, running from docker hub-based image locally and interactively:

* `docker run -it --rm -p 8080:8080 gillius/pointingpoker:latest`
* Visit http://localhost:8080/

# Known Issues

1. Unsupported any proxies that block or degrade websocket functionality (i.e. by putting a short limit on websocket duration).
1. No attempt made to reconnect to the server if the connection is lost
