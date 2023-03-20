from __future__ import absolute_import
import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab
os.environ.setdefault('DJANGO_SETTINGS_MODULE','www.settings')
app = Celery('www')
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'oth34_dtp_25':{
        'task':'hospital.tasks.oth34_dtp',
        # 'schedule': crontab(minute='*/1'),
    'schedule': crontab(0,0,day_of_month='1'),
    # 'schedule':crontab(minute='*/15')
    }
}
