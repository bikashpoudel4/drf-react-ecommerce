# Generated by Django 4.2.9 on 2024-02-22 10:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0006_tax'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='tax',
            options={'ordering': ['country'], 'verbose_name_plural': 'Taxes'},
        ),
    ]
