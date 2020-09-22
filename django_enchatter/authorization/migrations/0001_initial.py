# Generated by Django 2.2 on 2020-08-05 11:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatInvite',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=64)),
                ('comment', models.CharField(blank=True, max_length=128, null=True)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('key', models.UUIDField(default=uuid.UUID('b524e472-6a94-48e8-96aa-0692f9b5609f'))),
                ('inviter', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='invite', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]