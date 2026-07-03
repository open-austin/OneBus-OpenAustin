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
    "grocery-stores",
    "massage-therapists",
    "barbers",
    "nail-salons",
    "beauty-salons",
    "animal-shelters",
    "pet-grooming",
    "parks",
    "libraries",
    "places-of-interest",
    "temples",
    "museums",
    "antiques",
    "zoos",
    "toy-stores",
    "shoes-stores",
    "skating-rinks",
    "post-offices",
    "movie-theatres",
    "florists",
    "dog-parks",
    "concert-halls",
    "comedy-halls",
    "cosmetologists",
    "clothing-stores",
    "book-stores",
    "bars",
    "banks"
]
CITY_SLUG = "austin-tx"
MAX_PAGES_PER_CATEGORY = 100  # safety cap in case pagination never terminates
MAX_PAGE_RETRIES = 2


def scrape_page_with_retries(page: int, category_slug: str) -> list[dict] | None:
    """Scrape a page, retrying on WebDriver hangs/errors. Returns None if every attempt fails."""
    for attempt in range(1, MAX_PAGE_RETRIES + 1):
        try:
            return scrape_page(
                page_number=page,
                city_slug=CITY_SLUG,
                category_slug=category_slug,
            )
        except Exception as exc:
            print(f"  Page {page}: attempt {attempt}/{MAX_PAGE_RETRIES} failed ({exc!r}); retrying...")
            time.sleep(random.uniform(5, 10))
    return None


def scrape_all_pages(category_slug: str) -> list[dict]:
    """Scrape pages for a category until the results run out."""
    all_listings = []
    previous_names = None

    for page in range(1, MAX_PAGES_PER_CATEGORY + 1):
        listings = scrape_page_with_retries(page, category_slug)
        if listings is None:
            print(f"  Page {page}: giving up after repeated failures, stopping category.")
            break
        if not listings:
            print(f"  Page {page}: no listings, stopping.")
            break

        current_names = {listing["name"] for listing in listings}
        if current_names == previous_names:
            print(f"  Page {page}: same as previous page, stopping.")
            break

        all_listings.extend(listings)
        print(f"  Page {page}: {len(listings)} listings")
        previous_names = current_names
        time.sleep(random.uniform(3, 8))

    return all_listings


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    all_dfs = []

    for category_slug in CATEGORIES:
        print(f"\n=== Scraping: {category_slug} ===")
        all_listings = scrape_all_pages(category_slug)

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
