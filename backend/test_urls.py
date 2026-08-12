"""
Quick URL test script
Run this with: python test_urls.py
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.urls import get_resolver

# Get all URL patterns
resolver = get_resolver()

def show_urls(urllist, depth=0):
    for entry in urllist:
        if hasattr(entry, 'url_patterns'):
            # It's an include
            print("  " * depth + f"Include: {entry.pattern}")
            show_urls(entry.url_patterns, depth + 1)
        else:
            # It's a URL pattern
            pattern = str(entry.pattern)
            if any(x in pattern for x in ['auth', 'project', 'notification', 'sprint', 'task']):
                print("  " * depth + f"✓ {pattern}")

print("\n=== Key API URLs ===\n")
show_urls(resolver.url_patterns)

print("\n=== Testing URL Resolution ===\n")

# Test specific URLs
test_urls = [
    '/api/v1/auth/login/',
    '/api/v1/auth/register/',
    '/api/v1/projects/',
    '/api/v1/projects/sprints/',
    '/api/v1/projects/tasks/',
    '/api/v1/notifications/',
]

from django.urls import resolve, Resolver404

for url in test_urls:
    try:
        match = resolve(url)
        print(f"✅ {url:40} → {match.view_name}")
    except Resolver404:
        print(f"❌ {url:40} → NOT FOUND")

print("\n" + "="*60)
print("If you see ❌ marks, URLs need to be fixed!")
print("="*60 + "\n")
