"""
Run a single-page Yellow Pages scrape, geocode listings, and save to CSV.

Usage (from data-pipelines/yellow_pages):
    python run_first_test.py
"""

from pathlib import Path

import pandas as pd
import random
import time 
from geocode import add_coordinates_to_listings
from scrape import scrape_page

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "poi_scrapped_data"
OUTPUT_FILE = OUTPUT_DIR / "first_test.csv"

CATEGORIES = [
    "restaurants",
    "coffee-shops",
    "hotels",
    "golf-courses",
    "grocery-stores",
    "massage-therapists",
    "barbers",
    "nail-salons",
    "beauty-salons",
    "day-spas",
    "skin-care",
    "hair-stylists",
    "animal-shelters",
    "dog-training",
    "dog-day-care",
    "pet-boarding-kennels",
    "pet-grooming",
    "veterinary-clinics-hospitals",
]
PAGE_NUMBERS = range(1, 3)
CITY_SLUG = "austin-tx"

def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    all_dfs = []

    for category_slug in CATEGORIES:
        print(f"\n=== Scraping: {category_slug} ===")
        all_listings = []

        for page in PAGE_NUMBERS:
            listings = scrape_page(
                page_number=page,
                city_slug=CITY_SLUG,
                category_slug=category_slug,
            )
            all_listings.extend(listings)
            time.sleep(random.uniform(3, 8))
            print(f"  Page {page}: {len(listings)} listings")

        print(f"  Total: {len(all_listings)} listings — geocoding...")
        all_listings = add_coordinates_to_listings(all_listings)

        df = pd.DataFrame(all_listings)
        df["category"] = category_slug  # tag each row with its category
        output_file = OUTPUT_DIR / f"{category_slug}.csv"
        df.to_csv(output_file, index=False)
        print(f"  Saved to {output_file}")

        all_dfs.append(df)

    # Concatenate all categories into one file
    combined_df = pd.concat(all_dfs, ignore_index=True)
    combined_file = OUTPUT_DIR / "all_categories.csv"
    combined_df.to_csv(combined_file, index=False)
    print(f"\n=== Done! {len(combined_df)} total rows saved to {combined_file} ===")


if __name__ == "__main__":
    main()
