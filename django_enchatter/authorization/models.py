import uuid

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class ChatInvite(models.Model):
    username = models.CharField(max_length=64)
    comment = models.CharField(max_length=128, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    chat = models.PositiveIntegerField(null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    inviter = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="invite")
    key = models.UUIDField(default=uuid.uuid4())
