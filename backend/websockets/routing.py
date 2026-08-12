from django.urls import re_path
from apps.collaboration import consumers as collab_consumers
from apps.notifications import consumers as notif_consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", collab_consumers.ChatConsumer.as_asgi()),
    re_path(r"ws/notifications/$", notif_consumers.NotificationConsumer.as_asgi()),
]
