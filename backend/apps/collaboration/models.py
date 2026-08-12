from mongoengine import StringField, BooleanField, ListField, ReferenceField
from apps.core.models import TenantDocument


class Channel(TenantDocument):
    meta = {
        "collection": "channels",
        "indexes": [
            "company_id",
            "name",
            "is_private",
            "created_by_id",
            ("company_id", "is_private"),
        ]
    }

    name = StringField(max_length=100, required=True)
    description = StringField(default="")
    is_private = BooleanField(default=False)
    member_ids = ListField(StringField(), default=list)
    created_by_id = StringField(required=True)

    def __str__(self):
        return f"#{self.name}"


class Message(TenantDocument):
    meta = {
        "collection": "messages",
        "ordering": ["created_at"],
        "indexes": [
            "channel",
            "sender_id",
            "parent",
            "created_at",
            ("channel", "created_at"),
        ]
    }

    channel = ReferenceField(Channel, null=True)
    sender_id = StringField(required=True)
    content = StringField(required=True)
    file_url = StringField(default="")
    parent = ReferenceField("self", null=True)
    is_edited = BooleanField(default=False)


class DirectMessage(TenantDocument):
    meta = {
        "collection": "direct_messages",
        "ordering": ["created_at"],
        "indexes": [
            "sender_id",
            "recipient_id",
            "is_read",
            "created_at",
            ("sender_id", "recipient_id"),
            ("recipient_id", "is_read"),
        ]
    }

    sender_id = StringField(required=True)
    recipient_id = StringField(required=True)
    content = StringField(required=True)
    is_read = BooleanField(default=False)
