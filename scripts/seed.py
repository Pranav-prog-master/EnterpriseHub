#!/usr/bin/env python
"""
Seed script — creates demo data for development.
Run: python scripts/seed.py
"""
import os
import sys
import django

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from apps.users.models import User, Company
from apps.hr.models import Employee
from apps.projects.models import Project, Task
from apps.crm.models import Lead


def seed():
    print("Seeding database...")

    # Company
    company, _ = Company.objects.get_or_create(
        domain="demo.com",
        defaults={"name": "Demo Corp"},
    )

    # Super Admin
    admin, created = User.objects.get_or_create(
        email="admin@demo.com",
        defaults={
            "username": "admin",
            "first_name": "Admin",
            "last_name": "User",
            "role": "super_admin",
            "company": company,
        },
    )
    if created:
        admin.set_password("demo1234")
        admin.save()
        print("  Created admin@demo.com / demo1234")

    # HR User
    hr_user, created = User.objects.get_or_create(
        email="hr@demo.com",
        defaults={
            "username": "hr_user",
            "first_name": "HR",
            "last_name": "Manager",
            "role": "hr",
            "company": company,
        },
    )
    if created:
        hr_user.set_password("demo1234")
        hr_user.save()

    # Employee
    emp_user, created = User.objects.get_or_create(
        email="employee@demo.com",
        defaults={
            "username": "emp1",
            "first_name": "John",
            "last_name": "Doe",
            "role": "employee",
            "company": company,
        },
    )
    if created:
        emp_user.set_password("demo1234")
        emp_user.save()
        Employee.objects.create(
            user=emp_user,
            company=company,
            employee_id="EMP001",
            department="Engineering",
            designation="Software Engineer",
            date_of_joining="2023-01-15",
            salary=75000,
        )

    # Projects
    for name, status in [("Platform Redesign", "active"), ("Mobile App", "planning"), ("API v2", "active")]:
        Project.objects.get_or_create(
            name=name,
            company=company,
            defaults={"status": status, "priority": "high", "owner": admin},
        )

    # Leads
    for name, status in [("Acme Corp", "qualified"), ("TechStart", "new"), ("BigCo", "proposal")]:
        Lead.objects.get_or_create(
            name=name,
            company=company,
            defaults={"status": status, "estimated_value": 50000},
        )

    print("Seeding complete.")


if __name__ == "__main__":
    seed()
