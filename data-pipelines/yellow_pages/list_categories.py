"""
Crawl the Yellow Pages category sitemap and save every category name/slug
found to a CSV, so valid CATEGORIES entries for run_first_test.py can be
found by searching the CSV instead of guessing URLs.

Usage (from data-pipelines/yellow_pages):
    python list_categories.py
"""

import random
import re
import time
from pathlib import Path
from urllib.parse import urlparse

import pandas as pd
from selenium.webdriver.common.by import By

from scrape import create_driver

BASE_URL = "https://www.yellowpages.com"
SITEMAP_URL = f"{BASE_URL}/categories"
PAGE_LOAD_WAIT_SEC = 5

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "poi_scrapped_data"
OUTPUT_FILE = OUTPUT_DIR / "yp_categories.csv"

SLUG_RE = re.compile(r"^/[a-z0-9][a-z0-9-]*$")


def random_scroll(driver) -> None:
    """Scroll around like a human before scraping, to avoid IP blocks."""
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2)")
    time.sleep(random.uniform(1, 3))
    driver.execute_script("window.scrollTo(0, 0)")
    time.sleep(random.uniform(1, 2))


def extract_categories_from_page(driver) -> list[dict]:
    """Pull (category_name, category_slug) pairs out of every link on the page."""
    categories: list[dict] = []
    for link in driver.find_elements(By.TAG_NAME, "a"):
        try:
            href = link.get_attribute("href")
            name = link.text.strip()
            if not href or not name:
                continue
            path = urlparse(href).path
            if not SLUG_RE.match(path):
                continue
            categories.append(
                {"category_name": name, "category_slug": path.lstrip("/")}
            )
        except Exception:
            continue
    return categories


def find_subpage_links(driver) -> list[str]:
    """Find lettered/paginated sitemap subpages linked from the current page."""
    subpages: set[str] = set()
    for link in driver.find_elements(By.TAG_NAME, "a"):
        try:
            href = link.get_attribute("href")
            text = link.text.strip()
            if not href:
                continue
            path = urlparse(href).path
            if path.startswith("/categories/") or (len(text) == 1 and text.isalpha()):
                subpages.add(href)
        except Exception:
            continue
    return sorted(subpages)


def scrape_all_categories() -> list[dict]:
    driver = create_driver()
    all_categories: list[dict] = []

    try:
        print(f"Scraping {SITEMAP_URL}")
        driver.get(SITEMAP_URL)
        time.sleep(PAGE_LOAD_WAIT_SEC)
        random_scroll(driver)

        all_categories.extend(extract_categories_from_page(driver))
        subpage_urls = find_subpage_links(driver)
        print(f"  Found {len(all_categories)} categories, {len(subpage_urls)} subpages")

        for url in subpage_urls:
            print(f"Scraping {url}")
            driver.get(url)
            time.sleep(PAGE_LOAD_WAIT_SEC)
            random_scroll(driver)
            page_categories = extract_categories_from_page(driver)
            all_categories.extend(page_categories)
            print(f"  Found {len(page_categories)} categories")
            time.sleep(random.uniform(3, 8))
    finally:
        driver.quit()

    deduped = {c["category_slug"]: c for c in all_categories}
    return sorted(deduped.values(), key=lambda c: c["category_slug"])


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    categories = scrape_all_categories()

    df = pd.DataFrame(categories)
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"\n=== Done! {len(df)} categories saved to {OUTPUT_FILE} ===")


if __name__ == "__main__":
    main()
