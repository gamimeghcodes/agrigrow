import requests
from datetime import datetime

from django.core.management.base import BaseCommand, CommandError
from decouple import config

from api.models import MarketPrice

SUPPORTED_STATES = [
    "Gujarat",
    "Maharashtra",
    "Punjab",
    "Rajasthan",
    "Karnataka",
]


class Command(BaseCommand):
    help = "Fetch latest mandi prices and store them in SQLite"

    def handle(self, *args, **kwargs):
        api_key = config("DATA_GOV_API_KEY", default="")
        if not api_key:
            raise CommandError(
                "DATA_GOV_API_KEY is not set. Add it to your backend .env file "
                "(get a free key from https://data.gov.in)."
            )

        url = (
            "https://api.data.gov.in/resource/"
            "9ef84268-d588-465a-a308-a864a43d0070"
            f"?api-key={api_key}"
            "&format=json"
            "&limit=5000"
        )

        self.stdout.write("Downloading market price data...")

        try:
            response = requests.get(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0"
                },
                timeout=20
            )

            response.raise_for_status()

            data = response.json()

            records = data.get("records", [])

            self.stdout.write(f"Downloaded {len(records)} records")

            total_saved = 0

            for record in records:

                if record.get("state") not in SUPPORTED_STATES:
                    continue

                arrival_date = datetime.strptime(
                    record["arrival_date"],
                    "%d/%m/%Y"
                ).date()

                MarketPrice.objects.update_or_create(
                    state=record["state"],
                    district=record["district"],
                    market=record["market"],
                    commodity=record["commodity"],
                    arrival_date=arrival_date,
                    defaults={
                        "variety": record.get("variety", ""),
                        "grade": record.get("grade", ""),
                        "min_price": record["min_price"],
                        "max_price": record["max_price"],
                        "modal_price": record["modal_price"],
                    },
                )

                total_saved += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully updated {total_saved} records."
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(str(e))
            )