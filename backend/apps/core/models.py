import uuid
from datetime import datetime
from mongoengine import Document, StringField, BooleanField, DateTimeField, UUIDField


class BaseDocument(Document):
    meta = {"abstract": True}

    id = UUIDField(primary_key=True, default=uuid.uuid4, binary=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    is_active = BooleanField(default=True)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)


class TenantDocument(BaseDocument):
    meta = {"abstract": True}

    company_id = StringField(default="")
    created_by_id = StringField(default="")
