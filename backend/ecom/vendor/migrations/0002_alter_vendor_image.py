# Generated by Django 4.2.9 on 2024-09-29 10:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vendor', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vendor',
            name='image',
            field=models.FileField(blank=True, default='default/vendor.jpg', null=True, upload_to='vendor'),
        ),
    ]
