from rest_framework import permissions


class IsStaffOrAdminLaddered(permissions.BasePermission):
    """
    Object-level permission to onlu allow staff to edit users objects
    and admins to edit users and staff objects.
    """

    def has_object_permission(self, request, view, obj):
        try:
            perm_obj = view.get_permissions_object(obj)
        except AttributeError:
            perm_obj = obj

        if request.user.is_superuser:
            return perm_obj.is_superuser is not True
        if request.user.is_staff:
            return not perm_obj.is_superuser and not perm_obj.is_staff
        return False
