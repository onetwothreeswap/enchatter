import {SOCKET_URL} from "./settings";
import ECDH from "./crypter";
import {ec as EllipticCurve, ec} from 'elliptic';
import fernet from "fernet";
import {encode as encode64} from "urlsafe-base64";


class WebSocketService {
    static instance = null;
    callbacks = {};
    lastChat = "";
    encryptor = null;
    secret = "";

    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    constructor() {
        this.socketRef = null;
    }

    connect(chatUrl) {
        const path = `${SOCKET_URL}/ws/chat/${chatUrl}/`;
        this.lastChat = chatUrl;
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = () => {
            this.login();
            console.log("WebSocket open");
        };
        this.socketRef.onmessage = e => {
            this.socketNewMessage(e.data);
        };
        this.socketRef.onerror = e => {
            console.log(e.message);
        };
        this.socketRef.onclose = () => {
            console.log("WebSocket closed let's reopen");
            this.connect(this.lastChat);
        };
    }

    disconnect() {
        this.socketRef.close();
    }

    decryptMessage(message) {
        let b64 = btoa(encode64(this.secret));
        let secret = new fernet.Secret(b64);
        let token = new fernet.Token({
            secret: secret,
            token: message,
            ttl: 0
        });
        return token.decode();
    }

    encryptMessage(message) {
        let b64 = btoa(encode64(this.secret));
        let secret = new fernet.Secret(b64);

        let token = new fernet.Token({
          secret: secret,
          time: Date.parse(1),
          iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        });
        return token.encode(message);
    }

    socketNewMessage(data) {
        let parsedData;
        try {
            parsedData = JSON.parse(data);
        } catch (e) {
            let decryptedData = this.decryptMessage(data);
            parsedData = JSON.parse(decryptedData);
        }
        const command = parsedData.command;
        if (Object.keys(this.callbacks).length === 0) {
            return;
        }
        if (command === "messages") {
            this.callbacks[command](parsedData.messages);
        }
        if (command === "new_message") {
            this.callbacks[command](parsedData.message);
        }
        if (command === "login_user") {
            this.loginUserCallback(parsedData.key);
        }
    }

    login() {
        this.encryptor = new ECDH();
        this.sendMessage({
            command: "login_user",
            token: localStorage.getItem("token"),
            key: this.encryptor.getPublicKey()
        });
    }

    loginUserCallback(data) {
        let pub = {x: data[0], y: data[1]};
        let ec = new EllipticCurve('secp256k1');
        let key = ec.keyFromPublic(pub, 'hex');
        let shared1 = this.encryptor.keyPair.derive(key.pub);
        this.secret = shared1.toString(10).toString().substring(0, 32);
    }

    fetchMessages(chatId, page = 0) {
        this.sendEcnryptedMessage({
            command: "fetch_messages",
            chatId: chatId,
            page: page
        });
    }

    newChatMessage(message) {
        this.sendEcnryptedMessage({
            command: "new_message",
            from: message.from,
            message: message.content,
            chatId: message.chatId
        });
    }

    addCallbacks(messagesCallback, newMessageCallback) {
        this.callbacks["messages"] = messagesCallback;
        this.callbacks["new_message"] = newMessageCallback;
    }


    sendMessage(data) {
        try {
            this.socketRef.send(JSON.stringify({...data}));
        } catch (err) {
            console.log(err.message);
        }
    }

    sendEcnryptedMessage(data) {
        try {
            this.socketRef.send(this.encryptMessage(JSON.stringify({...data})));
        } catch (err) {
            console.log(err.message);
        }
    }

    state() {
        return this.socketRef.readyState;
    }

}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
