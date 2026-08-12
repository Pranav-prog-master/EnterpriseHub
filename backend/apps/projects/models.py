from mongoengine import (
    StringField, FloatField, IntField, BooleanField,
    DateTimeField, ListField, ReferenceField
)
from apps.core.models import TenantDocument


class Project(TenantDocument):
    meta = {
        "collection": "projects",
        "indexes": [
            "company_id",  # Index for company filtering
            "status",  # Index for status filtering
            "owner_id",  # Index for owner filtering
            "created_at",  # Index for sorting by creation date
            ("company_id", "status"),  # Compound index for common query
            ("company_id", "created_at"),  # Compound index for listing
        ]
    }

    STATUS = ("planning", "active", "on_hold", "completed")
    PRIORITY = ("low", "medium", "high", "critical")

    name = StringField(max_length=200, required=True)
    description = StringField(default="")
    status = StringField(choices=STATUS, default="planning")
    priority = StringField(choices=PRIORITY, default="medium")
    start_date = DateTimeField(null=True)
    end_date = DateTimeField(null=True)
    owner_id = StringField(required=True)
    member_ids = ListField(StringField(), default=list)
    ai_risk_score = FloatField(null=True)

    def __str__(self):
        return self.name


class Sprint(TenantDocument):
    meta = {
        "collection": "sprints",
        "indexes": [
            "company_id",
            "project",
            "is_active",
            ("project", "is_active"),
        ]
    }

    project = ReferenceField(Project, required=True)
    name = StringField(max_length=100, required=True)
    goal = StringField(default="")
    start_date = DateTimeField(required=True)
    end_date = DateTimeField(required=True)
    is_active = BooleanField(default=False)


class Task(TenantDocument):
    meta = {
        "collection": "tasks",
        "ordering": ["order"],
        "indexes": [
            "company_id",
            "project",
            "sprint",
            "status",
            "assignee_id",
            "due_date",
            ("company_id", "status"),
            ("project", "status"),
            ("assignee_id", "status"),
            ("company_id", "created_at"),
        ]
    }

    STATUS = ("todo", "in_progress", "review", "done")
    PRIORITY = ("low", "medium", "high", "critical")
    TYPE = ("task", "bug", "story", "epic")

    project = ReferenceField(Project, required=True)
    sprint = ReferenceField(Sprint, null=True)
    title = StringField(max_length=300, required=True)
    description = StringField(default="")
    task_type = StringField(choices=TYPE, default="task")
    status = StringField(choices=STATUS, default="todo")
    priority = StringField(choices=PRIORITY, default="medium")
    assignee_id = StringField(default="")
    reporter_id = StringField(required=True)
    due_date = DateTimeField(null=True)
    estimated_hours = FloatField(default=0)
    logged_hours = FloatField(default=0)
    parent = ReferenceField("self", null=True)
    order = IntField(default=0)


class Comment(TenantDocument):
    meta = {
        "collection": "task_comments",
        "indexes": [
            "task",
            "author_id",
            "created_at",
            ("task", "created_at"),
        ]
    }

    task = ReferenceField(Task, required=True)
    author_id = StringField(required=True)
    content = StringField(required=True)


class TimeLog(TenantDocument):
    meta = {
        "collection": "time_logs",
        "indexes": [
            "task",
            "user_id",
            "date",
            ("task", "date"),
            ("user_id", "date"),
        ]
    }

    task = ReferenceField(Task, required=True)
    user_id = StringField(required=True)
    hours = FloatField(required=True)
    description = StringField(default="")
    date = DateTimeField(required=True)


class Milestone(TenantDocument):
    meta = {
        "collection": "milestones",
        "indexes": [
            "project",
            "due_date",
            "is_completed",
            ("project", "is_completed"),
        ]
    }

    project = ReferenceField(Project, required=True)
    name = StringField(max_length=200, required=True)
    due_date = DateTimeField(required=True)
    is_completed = BooleanField(default=False)
