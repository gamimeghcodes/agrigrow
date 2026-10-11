from django.core.management.base import BaseCommand, CommandError

from api.models import User


class Command(BaseCommand):
    help = "Promote an existing user to the admin role (sets role='admin')."

    def add_arguments(self, parser):
        parser.add_argument(
            "username",
            type=str,
            help="Username of the user to promote to admin.",
        )

    def handle(self, *args, **options):
        username = options["username"]
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise CommandError(f'No user found with username "{username}".')

        if user.role == "admin":
            self.stdout.write(self.style.WARNING(f'"{username}" is already an admin.'))
            return

        user.role = "admin"
        user.save(update_fields=["role"])
        self.stdout.write(self.style.SUCCESS(f'"{username}" is now an admin.'))
