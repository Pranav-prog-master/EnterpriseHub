from config.celery import app


@app.task
def send_push_notification(user_id, title, message, data=None):
    from apps.notifications.models import Notification
    from apps.users.models import User
    from channels.layers import get_channel_layer
    from asgiref.sync import async_to_sync

    user = User.objects.get(id=user_id)
    notif = Notification.objects.create(
        recipient=user,
        company=user.company,
        title=title,
        message=message,
        data=data or {},
    )

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"notifications_{user_id}",
        {
            "type": "notification",
            "data": {
                "id": str(notif.id),
                "title": title,
                "message": message,
                "type": notif.notification_type,
            },
        },
    )
