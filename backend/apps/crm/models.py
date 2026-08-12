from mongoengine import StringField, FloatField, IntField, DateTimeField, ReferenceField
from apps.core.models import TenantDocument


class Lead(TenantDocument):
    meta = {
        "collection": "leads",
        "indexes": [
            "company_id",
            "status",
            "assigned_to_id",
            "email",
            "created_at",
            ("company_id", "status"),
            ("assigned_to_id", "status"),
            ("company_id", "created_at"),
        ]
    }

    STATUS = ("new", "contacted", "qualified", "proposal", "negotiation", "won", "lost")

    name = StringField(max_length=200, required=True)
    email = StringField(default="")
    phone = StringField(default="")
    company_name = StringField(default="")
    source = StringField(default="")
    status = StringField(choices=STATUS, default="new")
    assigned_to_id = StringField(default="")
    estimated_value = FloatField(default=0)
    ai_score = FloatField(null=True)
    notes = StringField(default="")


class Customer(TenantDocument):
    meta = {
        "collection": "customers",
        "indexes": [
            "company_id",
            "email",
            "account_manager_id",
            ("company_id", "email"),
        ]
    }

    name = StringField(max_length=200, required=True)
    email = StringField(required=True)
    phone = StringField(default="")
    company_name = StringField(default="")
    account_manager_id = StringField(default="")
    total_revenue = FloatField(default=0)


class Deal(TenantDocument):
    meta = {
        "collection": "deals",
        "indexes": [
            "company_id",
            "customer",
            "status",
            "assigned_to_id",
            "close_date",
            ("company_id", "status"),
            ("assigned_to_id", "status"),
        ]
    }

    STATUS = ("open", "won", "lost")

    title = StringField(max_length=200, required=True)
    customer = ReferenceField(Customer, required=True)
    assigned_to_id = StringField(default="")
    value = FloatField(required=True)
    status = StringField(choices=STATUS, default="open")
    close_date = DateTimeField(null=True)
    probability = IntField(default=50)
    stage = StringField(default="")
