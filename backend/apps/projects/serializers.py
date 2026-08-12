from rest_framework import serializers
from .models import Project, Sprint, Task, Comment, TimeLog, Milestone


class MilestoneSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    project = serializers.CharField()
    name = serializers.CharField(max_length=200)
    due_date = serializers.DateTimeField()
    is_completed = serializers.BooleanField(default=False)
    company_id = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)


class SprintSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    project = serializers.CharField()
    name = serializers.CharField(max_length=100)
    goal = serializers.CharField(allow_blank=True)
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    is_active = serializers.BooleanField(default=False)
    company_id = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)


class CommentSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    task = serializers.CharField()
    author_id = serializers.CharField(read_only=True)
    content = serializers.CharField()
    company_id = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)


class TimeLogSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    task = serializers.CharField()
    user_id = serializers.CharField(read_only=True)
    hours = serializers.FloatField()
    description = serializers.CharField(allow_blank=True)
    date = serializers.DateTimeField()
    company_id = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)


class TaskSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    project = serializers.CharField()
    sprint = serializers.CharField(allow_null=True, required=False)
    title = serializers.CharField(max_length=300)
    description = serializers.CharField(allow_blank=True)
    task_type = serializers.CharField(default="task")
    status = serializers.CharField(default="todo")
    priority = serializers.CharField(default="medium")
    assignee_id = serializers.CharField(allow_blank=True)
    reporter_id = serializers.CharField(read_only=True)
    due_date = serializers.DateTimeField(allow_null=True, required=False)
    estimated_hours = serializers.FloatField(default=0)
    logged_hours = serializers.FloatField(default=0)
    parent = serializers.CharField(allow_null=True, required=False)
    order = serializers.IntegerField(default=0)
    company_id = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)


class ProjectSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=200)
    description = serializers.CharField(allow_blank=True)
    status = serializers.CharField(default="planning")
    priority = serializers.CharField(default="medium")
    start_date = serializers.DateTimeField(allow_null=True, required=False)
    end_date = serializers.DateTimeField(allow_null=True, required=False)
    owner_id = serializers.CharField(read_only=True)
    member_ids = serializers.ListField(child=serializers.CharField(), default=list)
    ai_risk_score = serializers.FloatField(allow_null=True, required=False, read_only=True)
    company_id = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    
    def create(self, validated_data):
        return Project(**validated_data)
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
