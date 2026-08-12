"""
Fast development settings - Optimized for speed
"""
from .dev import *

# Reduce logging overhead
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'ERROR',  # Only show errors
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'ERROR',
    },
}

# Optimize database connections
CONN_MAX_AGE = 60  # Keep connections alive for 60 seconds

# Template caching for faster rendering
TEMPLATES[0]['OPTIONS']['loaders'] = [
    ('django.template.loaders.cached.Loader', [
        'django.template.loaders.filesystem.Loader',
        'django.template.loaders.app_directories.Loader',
    ]),
]

# Session optimization
SESSION_ENGINE = 'django.contrib.sessions.backends.cached'
SESSION_CACHE_ALIAS = 'default'

# Disable some middleware for faster requests
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

# Reduce query overhead
DEBUG_PROPAGATE_EXCEPTIONS = False

print("⚡ Fast mode enabled - Performance optimizations active!")
