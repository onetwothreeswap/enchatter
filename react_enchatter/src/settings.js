let DEBUG = true;
let HOST_URL = "https://production.com";
let SOCKET_URL = "wss://production.com";
if (DEBUG) {
  HOST_URL = "http://localhost:8000";
  SOCKET_URL = "ws://localhost:8000";
}

export { HOST_URL, SOCKET_URL };
