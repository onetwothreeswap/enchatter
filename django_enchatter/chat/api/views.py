from django.contrib.auth import get_user_model
from rest_framework import permissions
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView
)
from rest_framework.mixins import DestroyModelMixin
from rest_framework.viewsets import GenericViewSet

from chat.models import Chat, Contact, Message
from chat.views import get_user_contact
from enchatter.permisions import IsStaffOrAdminLaddered
from .serializers import ChatSerializer, MessagesSerializer

User = get_user_model()


class ChatListView(ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        contact = get_user_contact(self.request.user)
        queryset = contact.chats.all()
        return queryset


class ChatDetailView(RetrieveAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)


class ChatCreateView(CreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ChatUpdateView(UpdateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ChatDeleteView(DestroyAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)


class AdminMessagesViewSet(DestroyModelMixin,
                           GenericViewSet):
    permission_classes = (IsStaffOrAdminLaddered,)
    serializer_class = MessagesSerializer
    queryset = Message.objects.all()

    def get_permissions_object(self, obj):
        return obj.contact.user
