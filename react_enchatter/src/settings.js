let DEBUG = true;
let HOST_URL = "https://a3chat.net";
let SOCKET_URL = "wss://a3chat.net";
if (DEBUG) {
  HOST_URL = "http://localhost:8000";
  SOCKET_URL = "ws://localhost:8000";
}

export { HOST_URL, SOCKET_URL };
