import uuid
import bcrypt
from mongoengine import (
    Document, EmbeddedDocument, StringField, BooleanField,
    DateTimeField, UUIDField, ReferenceField, EmbeddedDocumentField, CASCADE
)
from datetime import datetime


class Company(Document):
    meta = {"collection": "companies"}
    id = UUIDField(primary_key=True, default=uuid.uuid4, binary=False)
    name = StringField(max_length=255, required=True)
    domain = StringField(max_length=100, unique=True, required=True)
    logo = StringField()
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)

    def __str__(self):
        return self.name


class User(Document):
    ROLES = [
        "super_admin", "company_admin", "hr",
        "project_manager", "team_lead", "employee", "client", "guest",
    ]

    meta = {
        "collection": "users",
        "indexes": [
            "email",  # Unique index for email lookups
            "username",  # Unique index for username lookups
            "role",  # Index for role-based queries
            "company",  # Index for company-based queries
            "is_active",  # Index for active user filtering
            ("company", "role"),  # Compound index for company + role queries
            ("email", "is_active"),  # Compound index for login queries
        ]
    }
    
    id = UUIDField(primary_key=True, default=uuid.uuid4, binary=False)
    email = StringField(unique=True, required=True)
    username = StringField(unique=True, required=True)
    first_name = StringField(default="")
    last_name = StringField(default="")
    password_hash = StringField(required=True)
    role = StringField(choices=ROLES, default="employee")
    company = ReferenceField(Company, null=True)
    avatar = StringField()
    phone = StringField(default="")
    department = StringField(default="")
    job_title = StringField(default="")
    is_online = BooleanField(default=False)
    is_active = BooleanField(default=True)
    two_factor_enabled = BooleanField(default=False)
    date_joined = DateTimeField(default=datetime.utcnow)

    # Required by DRF SimpleJWT
    @property
    def is_authenticated(self):
        return True

    @property
    def pk(self):
        return str(self.id)

    def set_password(self, raw_password: str):
        self.password_hash = bcrypt.hashpw(
            raw_password.encode(), bcrypt.gensalt()
        ).decode()

    def check_password(self, raw_password: str) -> bool:
        return bcrypt.checkpw(raw_password.encode(), self.password_hash.encode())

    def __str__(self):
        return self.email
