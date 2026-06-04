"""
Run a single-page Yellow Pages scrape, geocode listings, and save to CSV.

Usage (from data-pipelines/yellow_pages):
    python run_first_test.py
"""

from pathlib import Path

import pandas as pd

from geocode import add_coordinates_to_listings
from scrape import scrape_page

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "poi_scrapped_data"
OUTPUT_FILE = OUTPUT_DIR / "first_test.csv"

PAGE_NUMBER = 1
CITY_SLUG = "austin-tx"
CATEGORY_SLUG = "restaurants"


def main() -> None:
    listings = scrape_page(
        page_number=PAGE_NUMBER,
        city_slug=CITY_SLUG,
        category_slug=CATEGORY_SLUG,
    )

    print("\nGeocoding...")
    listings = add_coordinates_to_listings(listings)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    df = pd.DataFrame(listings)
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"\nSaved {len(listings)} rows to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
