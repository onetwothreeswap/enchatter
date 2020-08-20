from django.contrib.auth import get_user_model
from django.utils.translation import ugettext_lazy as _
from rest_auth.models import TokenModel
from rest_auth.serializers import PasswordChangeSerializer as DefaultPasswordChangeSerializer
from rest_framework.exceptions import ValidationError

from authorization.models import ChatInvite, User
from chat.models import Chat, Contact

try:
    from allauth.account import app_settings as allauth_settings
    from allauth.utils import (email_address_exists,
                               get_username_max_length)
    from allauth.account.adapter import get_adapter
    from allauth.account.utils import setup_user_email
    from allauth.socialaccount.helpers import complete_social_login
    from allauth.socialaccount.models import SocialAccount
    from allauth.socialaccount.providers.base import AuthProcess
except ImportError:
    raise ImportError("allauth needs to be added to INSTALLED_APPS.")

from rest_framework import serializers


class InviteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatInvite
        fields = ["username", "comment", "chat", 'is_staff', 'is_admin']


class RegisterSerializer(serializers.Serializer):
    key = serializers.CharField(write_only=True)
    username = serializers.CharField(
        max_length=get_username_max_length(),
        min_length=allauth_settings.USERNAME_MIN_LENGTH,
        required=allauth_settings.USERNAME_REQUIRED
    )
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate_key(self, key):
        try:
            self.invite = ChatInvite.objects.get(key=key)
        except ChatInvite.DoesNotExist:
            raise ValidationError("Bad invite link, request another one")
        if self.invite.user is not None:
            raise ValidationError("Invite already accepted")
        return key

    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        return username

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(_("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': "",
            'last_name': "",
            'first_name': "",
        }

    def assign_invite_data(self, user):
        self.invite.user = user
        self.invite.save()

        if self.invite.inviter.is_superuser:
            if self.invite.is_admin:
                user.is_staff = True
                user.is_superuser = True
            if self.invite.is_staff:
                user.is_staff = True
        if self.invite.username:
            user.first_name = self.invite.username
        if self.invite.comment:
            user.last_name = self.invite.comment
        user.save()
        contact = Contact.objects.get_or_create(user=user)[0]

        # TODO REMOVE
        Chat.objects.get_or_create(pk=1)[0].participants.add(contact.pk)

        return user

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        return self.assign_invite_data(user)


class TokenSerializer(serializers.ModelSerializer):
    staff = serializers.BooleanField(read_only=True)
    admin = serializers.BooleanField(read_only=True)

    class Meta:
        model = TokenModel
        fields = ('key', "staff", 'admin')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("id", 'username', "is_staff", "is_superuser", "is_active")

    def validate(self, data):
        if data['is_superuser']:
            data["is_staff"] = True
        return data


class PasswordChangeSerializer(DefaultPasswordChangeSerializer):
    user_id = serializers.IntegerField(write_only=True, required=False)

    def get_edited_user(self, attrs):
        if self.user.is_staff and 'user_id' in attrs:
            user = User.objects.filter(id=attrs['user_id']).first()
            if user is not None:
                if self.user.is_superuser and user.is_superuser is False:
                    return user
                if self.user.is_staff and not (user.is_superuser or user.is_staff):
                    return user
            raise serializers.ValidationError("Bad user")

    def validate(self, attrs):
        user = self.get_edited_user(attrs)
        self.set_password_form = self.set_password_form_class(
            user=user, data=attrs
        )
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)
        return attrs


