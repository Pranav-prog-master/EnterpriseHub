from rest_framework import viewsets, permissions, decorators, response
from .models import Notification
from rest_framework import serializers
from apps.core.permissions import CanViewOwnDataOnly


class NotificationSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    recipient_id = serializers.CharField()
    title = serializers.CharField(max_length=200)
    message = serializers.CharField()
    notification_type = serializers.CharField()
    is_read = serializers.BooleanField(default=False)
    link = serializers.CharField(allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]  # Users can only see their own notifications
    queryset = Notification.objects.none()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Notification.objects.none()
        # Users can ONLY see their own notifications - automatic BOLA protection
        user_id = str(self.request.user.id)
        return Notification.objects.filter(recipient_id=user_id).order_by('-created_at')

    def get_object(self):
        """Override to ensure users can only access their own notifications"""
        obj = super().get_object()
        # Verify this notification belongs to the current user
        if obj.recipient_id != str(self.request.user.id):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You do not have permission to access this notification.")
        return obj

    @decorators.action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notif = self.get_object()  # Already checks ownership
        notif.is_read = True
        notif.save()
        return response.Response({"status": "read"})

    @decorators.action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        # Only mark user's own notifications as read
        user_id = str(self.request.user.id)
        notifications = Notification.objects.filter(recipient_id=user_id)
        for notif in notifications:
            notif.is_read = True
            notif.save()
        return response.Response({"status": "all read"})
