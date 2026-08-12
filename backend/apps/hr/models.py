import uuid
from datetime import datetime
from mongoengine import (
    StringField, FloatField, IntField, BooleanField,
    DateTimeField, UUIDField, ReferenceField, FileField
)
from apps.core.models import TenantDocument


class Employee(TenantDocument):
    meta = {
        "collection": "employees",
        "indexes": [
            "company_id",
            "user_id",
            "employee_id",
            "department",
            "status",
            "manager",
            ("company_id", "status"),
            ("company_id", "department"),
        ]
    }

    STATUS = ("active", "inactive", "on_leave")

    user_id = StringField(required=True, unique=True)
    employee_id = StringField(max_length=20, unique=True, required=True)
    department = StringField(max_length=100, default="")
    designation = StringField(max_length=100, default="")
    date_of_joining = DateTimeField()
    date_of_birth = DateTimeField(null=True)
    status = StringField(choices=STATUS, default="active")
    manager = ReferenceField("self", null=True)
    salary = FloatField(default=0)

    def __str__(self):
        return self.employee_id


class Attendance(TenantDocument):
    meta = {
        "collection": "attendances",
        "indexes": [
            "employee",
            "date",
            "status",
            ("employee", "date"),
            ("employee", "status"),
        ]
    }

    STATUS = ("present", "absent", "half_day", "holiday")

    employee = ReferenceField(Employee, required=True)
    date = DateTimeField(required=True)
    check_in = DateTimeField(null=True)
    check_out = DateTimeField(null=True)
    status = StringField(choices=STATUS, default="present")
    notes = StringField(default="")


class LeaveType(TenantDocument):
    meta = {"collection": "leave_types"}

    name = StringField(max_length=50, required=True)
    days_allowed = IntField(default=0)
    is_paid = BooleanField(default=True)


class LeaveRequest(TenantDocument):
    meta = {
        "collection": "leave_requests",
        "indexes": [
            "employee",
            "status",
            "start_date",
            "leave_type",
            ("employee", "status"),
            ("employee", "start_date"),
        ]
    }

    STATUS = ("pending", "approved", "rejected")

    employee = ReferenceField(Employee, required=True)
    leave_type = ReferenceField(LeaveType, required=True)
    start_date = DateTimeField(required=True)
    end_date = DateTimeField(required=True)
    reason = StringField(default="")
    status = StringField(choices=STATUS, default="pending")
    approved_by_id = StringField(default="")


class JobPosting(TenantDocument):
    meta = {
        "collection": "job_postings",
        "indexes": [
            "company_id",
            "is_open",
            "deadline",
            ("company_id", "is_open"),
        ]
    }

    title = StringField(max_length=200, required=True)
    department = StringField(max_length=100, default="")
    description = StringField(default="")
    requirements = StringField(default="")
    is_open = BooleanField(default=True)
    deadline = DateTimeField(null=True)


class Candidate(TenantDocument):
    meta = {
        "collection": "candidates",
        "indexes": [
            "job",
            "status",
            "email",
            ("job", "status"),
        ]
    }

    STATUS = ("applied", "screening", "interview", "offered", "hired", "rejected")

    job = ReferenceField(JobPosting, required=True)
    name = StringField(max_length=200, required=True)
    email = StringField(required=True)
    phone = StringField(default="")
    resume_url = StringField(default="")
    status = StringField(choices=STATUS, default="applied")
    ai_score = FloatField(null=True)
    ai_summary = StringField(default="")


class PerformanceReview(TenantDocument):
    meta = {
        "collection": "performance_reviews",
        "indexes": [
            "employee",
            "reviewer_id",
            "period",
            ("employee", "period"),
        ]
    }

    employee = ReferenceField(Employee, required=True)
    reviewer_id = StringField(required=True)
    period = StringField(max_length=50, required=True)
    rating = IntField(min_value=1, max_value=5)
    feedback = StringField(default="")
    goals = StringField(default="")
    ai_summary = StringField(default="")
