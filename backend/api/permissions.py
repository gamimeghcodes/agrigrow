from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """
    Allows access only to authenticated users whose `role` is "admin".

    Being authenticated (IsAuthenticated) is not enough on its own for the
    admin endpoints — any logged-in farmer or buyer would otherwise be able
    to read admin-only data such as the full user list. This permission
    additionally checks the user's role.
    """

    message = "You do not have permission to access this admin resource."

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) == "admin"
        )
