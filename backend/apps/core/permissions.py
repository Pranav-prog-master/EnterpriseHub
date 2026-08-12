from rest_framework.permissions import BasePermission
from rest_framework import permissions

ROLE_HIERARCHY = {
    "super_admin": 100,
    "company_admin": 90,
    "hr": 70,
    "project_manager": 60,
    "team_lead": 50,
    "employee": 30,
    "client": 20,
    "guest": 10,
}


class HasRole(BasePermission):
    required_role = "employee"

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        user_level = ROLE_HIERARCHY.get(request.user.role, 0)
        required_level = ROLE_HIERARCHY.get(self.required_role, 0)
        return user_level >= required_level


class IsHR(HasRole):
    required_role = "hr"


class IsProjectManager(HasRole):
    required_role = "project_manager"


class IsCompanyAdmin(HasRole):
    required_role = "company_admin"


class IsSuperAdmin(HasRole):
    required_role = "super_admin"


# ── OBJECT LEVEL AUTHORIZATION (BOLA Prevention) ──

class IsCompanyMember(BasePermission):
    """
    Object Level Authorization: User can only access objects belonging to their company.
    Prevents Broken Object Level Authorization (BOLA) vulnerabilities.
    
    Usage: Add to permission_classes along with IsAuthenticated
    Example: permission_classes = [permissions.IsAuthenticated, IsCompanyMember]
    """

    def has_permission(self, request, view):
        # First check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        return True

    def has_object_permission(self, request, view, obj):
        # User must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        # User must have a company assigned
        if not hasattr(request.user, 'company') or not request.user.company:
            return False

        # Get company_id from object
        obj_company_id = None
        if hasattr(obj, 'company_id'):
            obj_company_id = obj.company_id
        elif hasattr(obj, 'company') and obj.company:
            obj_company_id = str(obj.company.id)

        # User's company must match object's company
        user_company_id = str(request.user.company.id)
        return obj_company_id == user_company_id


class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission: Only owners can edit, but company members can read.
    Prevents unauthorized modifications while allowing team visibility.
    
    Usage: permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any company member
        if request.method in permissions.SAFE_METHODS:
            # Check if user belongs to same company
            if not hasattr(request.user, 'company') or not request.user.company:
                return False
            obj_company_id = getattr(obj, 'company_id', None)
            if obj_company_id:
                return str(request.user.company.id) == obj_company_id
            return False

        # Write permissions only for owner or admin
        if request.user.role == "company_admin":
            return True

        # Check if user is the owner
        owner_id = None
        if hasattr(obj, 'owner_id'):
            owner_id = obj.owner_id
        elif hasattr(obj, 'created_by_id'):
            owner_id = obj.created_by_id
        elif hasattr(obj, 'user_id'):
            owner_id = obj.user_id

        return owner_id == str(request.user.id)


class CanViewOwnDataOnly(BasePermission):
    """
    Users can only view/edit their own data (for sensitive endpoints like profile, payroll).
    Admins and HR can view all data in their company.
    
    Usage: For sensitive user data endpoints
    Example: permission_classes = [permissions.IsAuthenticated, CanViewOwnDataOnly]
    """

    def has_object_permission(self, request, view, obj):
        # Admin and HR can view all in their company
        if request.user.role in ["company_admin", "hr"]:
            # Still must be same company
            if hasattr(obj, 'company_id') and hasattr(request.user, 'company') and request.user.company:
                return obj.company_id == str(request.user.company.id)
            return True

        # Regular users can only view their own data
        user_id = None
        if hasattr(obj, 'user_id'):
            user_id = obj.user_id
        elif hasattr(obj, 'id'):
            user_id = str(obj.id)

        return user_id == str(request.user.id)
