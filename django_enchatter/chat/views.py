from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404

from enchatter.settings import MESSAGES_PER_REQUEST
from .models import Chat, Contact

User = get_user_model()


def get_messages(chatId, page=0):
    chat = get_object_or_404(Chat, id=chatId)
    start = page * MESSAGES_PER_REQUEST
    end = (page + 1) * MESSAGES_PER_REQUEST
    return chat.messages.order_by('-timestamp').all()[start:end]


def get_user_contact(username):
    user = get_object_or_404(User, username=username)
    return get_object_or_404(Contact, user=user)


def get_current_chat(chatId):
    return get_object_or_404(Chat, id=chatId)
