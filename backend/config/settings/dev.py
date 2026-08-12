from .base import *  # noqa

DEBUG = True

# ── Django Debug Toolbar ──────────────────────────────────────────────────────
# Temporarily disabled due to template issues
DEBUG_TOOLBAR_ENABLED = False

# Only add debug_toolbar if it is actually installed in the venv
# try:
#     import debug_toolbar  # noqa: F401
#     INSTALLED_APPS += ["debug_toolbar"]
#     MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")
#     INTERNAL_IPS = ["127.0.0.1", "localhost"]
#     DEBUG_TOOLBAR_ENABLED = True
# except ImportError:
#     DEBUG_TOOLBAR_ENABLED = False
