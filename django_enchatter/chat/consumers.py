import base64

from cryptography.fernet import Fernet, InvalidToken
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

from rest_framework.authtoken.models import Token
from tinyec.ec import Point

from enchatter.encryption import get_tinyec_curve
from .models import Message, Chat
from .views import get_messages, get_user_contact, get_current_chat
from channels.auth import login, get_user

User = get_user_model()

import secrets


def login_required(f):
    def wrapper(self, *args):
        if self.scope['user'].is_authenticated:
            return f(self, *args)

    return wrapper


class ChatConsumer(WebsocketConsumer):
    encryptor = None

    def login_user(self, data):
        user = Token.objects.get(key=data['token']).user
        async_to_sync(login)(self.scope, user)

        curve = get_tinyec_curve('secp256k1')
        server_private_key = secrets.randbelow(curve.field.n)
        server_pub_key = server_private_key * curve.g

        peer_pub_key = Point(curve, int(data['key'][0], 16), int(data['key'][1], 16))
        shared_key = server_private_key * peer_pub_key

        message_bytes = str(shared_key.x).encode('utf-8')
        key = base64.b64encode(message_bytes[:32])

        self.encryptor = Fernet(key)
        self.scope['session']['shared_key'] = key.decode('utf-8')
        self.scope["session"].save()

        content = {
            'command': 'login_user',
            'key': [hex(server_pub_key.x)[2:], hex(server_pub_key.y)[2:]]
        }
        self.send_message(content)

    @login_required
    def fetch_messages(self, data):
        current_chat = get_current_chat(data['chatId'])
        if current_chat.is_user_in_chat(self.scope['user']):
            messages = get_messages(data['chatId'], data['page'])
            content = {
                'command': 'messages',
                'messages': self.messages_to_json(messages)
            }
            self.send_encrypted_message(content)

    @login_required
    def new_message(self, data):
        current_chat = get_current_chat(data['chatId'])
        if current_chat.is_user_in_chat(self.scope['user']):
            user_contact = get_user_contact(self.scope['user'])
            message = Message.objects.create(
                contact=user_contact,
                content=data['message'])
            current_chat.messages.add(message)
            current_chat.save()
            content = {
                'command': 'new_message',
                'message': self.message_to_json(message)
            }
            return self.send_chat_message(content)

    def encrypt_text(self, text):
        if self.encryptor is None:
            self.encryptor = Fernet(self.scope['session']['shared_key'].encode('utf-8'))
        return self.encryptor.encrypt(text.encode('utf')).decode('utf-8')

    def decrypt_text(self, text):
        if self.encryptor is None:
            self.encryptor = Fernet(self.scope['session']['shared_key'].encode('utf-8'))
        return self.encryptor.decrypt(text.encode('utf')).decode('utf-8')

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'id': message.id,
            'author': message.contact.user.username,
            'content': message.content,
            'timestamp': str(message.timestamp)
        }

    commands = {
        'login_user': login_user,
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        try:
            text_data = self.decrypt_text(text_data)
        except (KeyError, InvalidToken) as e:
            pass

        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_message(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def send_encrypted_message(self, message):
        self.send(text_data=self.encrypt_text(json.dumps(message)))

    def chat_message(self, event):
        message = event['message']
        self.send(text_data=self.encrypt_text(json.dumps(message)))
