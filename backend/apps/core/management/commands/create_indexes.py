"""
Create MongoDB indexes for better performance
Usage: python manage.py create_indexes
"""
from django.core.management.base import BaseCommand
import mongoengine


class Command(BaseCommand):
    help = 'Create MongoDB indexes for better performance'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Creating MongoDB indexes...'))
        self.stdout.write('')
        
        try:
            # Import all models
            from apps.users.models import User, Company
            from apps.hr.models import Employee, Attendance, LeaveRequest
            from apps.projects.models import Project, Task, Sprint
            from apps.crm.models import Lead, Deal, Customer
            from apps.notifications.models import Notification
            from apps.documents.models import Document
            from apps.collaboration.models import Channel, Message
            
            models = [
                ('Users', User),
                ('Companies', Company),
                ('Employees', Employee),
                ('Attendance', Attendance),
                ('Leave Requests', LeaveRequest),
                ('Projects', Project),
                ('Tasks', Task),
                ('Sprints', Sprint),
                ('Leads', Lead),
                ('Deals', Deal),
                ('Customers', Customer),
                ('Notifications', Notification),
                ('Documents', Document),
                ('Channels', Channel),
                ('Messages', Message),
            ]
            
            for name, model in models:
                try:
                    model.ensure_indexes()
                    self.stdout.write(self.style.SUCCESS(f'✓ {name} indexes created'))
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'⚠ {name}: {str(e)}'))
            
            self.stdout.write('')
            self.stdout.write(self.style.SUCCESS('✅ All indexes created successfully!'))
            self.stdout.write('')
            self.stdout.write('Run this command periodically to ensure indexes are up to date.')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error: {str(e)}'))
