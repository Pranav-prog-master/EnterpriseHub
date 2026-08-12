from mongoengine import StringField, BooleanField, DictField
from apps.core.models import TenantDocument


class Notification(TenantDocument):
    meta = {
        "collection": "notifications",
        "ordering": ["-created_at"],
        "indexes": [
            "recipient_id",
            "is_read",
            "notification_type",
            "created_at",
            ("recipient_id", "is_read"),
            ("recipient_id", "created_at"),
            ("recipient_id", "is_read", "created_at"),
        ]
    }

    TYPE = ("info", "success", "warning", "error", "task", "mention")

    recipient_id = StringField(required=True)
    title = StringField(max_length=200, required=True)
    message = StringField(required=True)
    notification_type = StringField(choices=TYPE, default="info")
    is_read = BooleanField(default=False)
    link = StringField(default="")
    data = DictField(default=dict)
