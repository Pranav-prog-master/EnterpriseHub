import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get("type", "message")

        if message_type == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "typing_indicator", "user": data.get("user"), "is_typing": data.get("is_typing")},
            )
        else:
            saved = await self.save_message(data.get("content", ""))
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "chat_message", "message": data.get("content"), "message_id": str(saved.id)},
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"type": "message", "message": event["message"]}))

    async def typing_indicator(self, event):
        await self.send(text_data=json.dumps({"type": "typing", "user": event["user"], "is_typing": event["is_typing"]}))

    @database_sync_to_async
    def save_message(self, content):
        from .models import Channel, Message
        user = self.scope["user"]
        channel = Channel.objects.get(id=self.room_name)
        return Message.objects.create(channel=channel, sender=user, content=content, company=user.company)
