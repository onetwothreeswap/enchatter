let DEBUG = true;
let HOST_URL = "https://wwp34.net";
let SOCKET_URL = "wss://wwp34.net";
if (DEBUG) {
  HOST_URL = "http://localhost:8000";
  SOCKET_URL = "ws://localhost:8000";
}

export { HOST_URL, SOCKET_URL };
