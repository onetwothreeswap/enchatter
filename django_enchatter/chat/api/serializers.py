from rest_framework import serializers

from chat.models import Chat, Contact, Message
from chat.views import get_user_contact


class ContactSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="user.id")
    username = serializers.CharField(source="user.username")
    is_staff = serializers.BooleanField(source="user.is_staff")
    is_admin = serializers.BooleanField(source="user.is_superuser")
    is_active = serializers.BooleanField(source="user.is_active")


    class Meta:
        model = Contact
        fields = ('username', 'id', 'is_staff', 'is_admin', 'is_active')


class ChatSerializer(serializers.ModelSerializer):
    participants = ContactSerializer(many=True)

    class Meta:
        model = Chat
        fields = ('id', 'messages', 'participants')
        read_only = ('id')

    def create(self, validated_data):
        participants = validated_data.pop('participants')
        chat = Chat()
        chat.save()
        for username in participants:
            contact = get_user_contact(username)
            chat.participants.add(contact)
        chat.save()
        return chat


class MessagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("id",)
