"""
Diagnostic Script - Run this to check your setup
Usage: python diagnose.py
"""
import os
import sys

print("\n" + "="*60)
print("🔍 ENTERPRISEHUB AI - DIAGNOSTIC SCRIPT")
print("="*60 + "\n")

# Check 1: Django setup
print("📋 Check 1: Setting up Django...")
try:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
    import django
    django.setup()
    print("✅ Django setup successful\n")
except Exception as e:
    print(f"❌ Django setup failed: {e}\n")
    sys.exit(1)

# Check 2: Database connection
print("📋 Check 2: Testing MongoDB connection...")
try:
    from apps.users.models import User
    user_count = User.objects.count()
    print(f"✅ MongoDB connected - {user_count} users in database\n")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}\n")

# Check 3: Check if views can be imported
print("📋 Check 3: Importing views...")
errors = []

try:
    from apps.projects.views import ProjectViewSet
    print("✅ ProjectViewSet imported")
except Exception as e:
    print(f"❌ ProjectViewSet import failed: {e}")
    errors.append("projects")

try:
    from apps.notifications.views import NotificationViewSet
    print("✅ NotificationViewSet imported")
except Exception as e:
    print(f"❌ NotificationViewSet import failed: {e}")
    errors.append("notifications")

try:
    from apps.authentication.views import LoginView
    print("✅ LoginView imported")
except Exception as e:
    print(f"❌ LoginView import failed: {e}")
    errors.append("auth")

print()

# Check 4: URL patterns
print("📋 Check 4: Checking URL patterns...")
try:
    from django.urls import resolve, Resolver404
    
    test_urls = {
        '/api/v1/auth/login/': 'Login',
        '/api/v1/auth/register/': 'Register',
        '/api/v1/projects/': 'Projects List',
        '/api/v1/notifications/': 'Notifications List',
    }
    
    for url, name in test_urls.items():
        try:
            match = resolve(url)
            print(f"✅ {name:20} → {url}")
        except Resolver404:
            print(f"❌ {name:20} → {url} NOT FOUND")
            errors.append(url)
    print()
except Exception as e:
    print(f"❌ URL resolution failed: {e}\n")

# Check 5: Permissions
print("📋 Check 5: Checking permissions...")
try:
    from apps.core.permissions import IsCompanyMember, IsOwnerOrReadOnly
    print("✅ Custom permissions imported successfully\n")
except Exception as e:
    print(f"❌ Permissions import failed: {e}\n")
    errors.append("permissions")

# Check 6: List users
print("📋 Check 6: Listing users...")
try:
    from apps.users.models import User
    users = User.objects.all()[:5]
    if users:
        print(f"Found {User.objects.count()} users:")
        for user in users:
            print(f"  - {user.email} (Role: {user.role}, Active: {user.is_active})")
    else:
        print("⚠️  No users found. You need to create a user first!")
        print("\nTo create a test user, run:")
        print("  python manage.py shell")
        print("  >>> from apps.users.models import User")
        print("  >>> user = User.objects.create(email='test@test.com', role='employee', is_active=True)")
        print("  >>> user.set_password('test123')")
        print("  >>> user.save()")
    print()
except Exception as e:
    print(f"❌ Failed to list users: {e}\n")

# Summary
print("="*60)
if errors:
    print(f"❌ ISSUES FOUND: {len(errors)} problems detected")
    print("\nProblems:")
    for error in errors:
        print(f"  - {error}")
    print("\n💡 SOLUTION: Restart the backend server!")
    print("   1. Stop the server (Ctrl+C)")
    print("   2. Run: python manage.py runserver")
else:
    print("✅ ALL CHECKS PASSED!")
    print("\n✨ Your backend is configured correctly!")
    print("\n⚠️  If you're still getting 404 errors:")
    print("   1. Make sure backend server is running")
    print("   2. Restart the server to load new changes")
    print("   3. Check that frontend is pointing to http://127.0.0.1:8000")

print("="*60 + "\n")
