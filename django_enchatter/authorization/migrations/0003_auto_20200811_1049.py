# Generated by Django 2.2 on 2020-08-11 10:49

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('authorization', '0002_auto_20200811_0953'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatinvite',
            name='chat',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='chatinvite',
            name='key',
            field=models.UUIDField(default=uuid.UUID('7094dcec-4ff0-4bcf-a2a0-245d185bc178')),
        ),
    ]