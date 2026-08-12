from rest_framework import viewsets, permissions
from .models import Channel, Message, DirectMessage
from rest_framework import serializers


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = "__all__"
        read_only_fields = ["created_by"]


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.get_full_name", read_only=True)

    class Meta:
        model = Message
        fields = "__all__"
        read_only_fields = ["sender"]


class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Channel.objects.none()  # Default queryset for schema generation

    def get_queryset(self):
        # Check if this is for schema generation (Swagger/OpenAPI)
        if getattr(self, "swagger_fake_view", False):
            return Channel.objects.none()
        return Channel.objects.filter(company=self.request.user.company)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, company=self.request.user.company)


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["channel"]
    queryset = Message.objects.none()  # Default queryset for schema generation

    def get_queryset(self):
        # Check if this is for schema generation (Swagger/OpenAPI)
        if getattr(self, "swagger_fake_view", False):
            return Message.objects.none()
        return Message.objects.filter(company=self.request.user.company)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user, company=self.request.user.company)
