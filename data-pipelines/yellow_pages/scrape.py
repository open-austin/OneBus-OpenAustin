"""Scrape one Yellow Pages results page with Selenium."""

import time
import random 

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = "https://www.yellowpages.com"
PAGE_LOAD_WAIT_SEC = 5

def create_driver() -> webdriver.Safari:
    options = webdriver.SafariOptions()
    driver = webdriver.Safari(options=options)
    return driver


def scrape_page(
    page_number: int = 1,
    city_slug: str = "austin-tx",
    category_slug: str = "restaurants",
) -> list[dict]:
    """
    Scrape a single Yellow Pages listing page.

    Returns list of dicts with: page, name, categories, address.
    """
    url = f"{BASE_URL}/{city_slug}/{category_slug}?page={page_number}"
    listings: list[dict] = []
    driver = create_driver()

    try:
        print(f"Scraping {url}")
        driver.get(url)
        time.sleep(PAGE_LOAD_WAIT_SEC)
        # Random scroll before scraping
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2)")
        time.sleep(random.uniform(1, 3))
        driver.execute_script("window.scrollTo(0, 0)")
        time.sleep(random.uniform(1, 2))
        results = driver.find_elements(By.CLASS_NAME, "result")
        print(f"Found {len(results)} listings")

        for index, listing in enumerate(results, 1):
            try:
                info = listing.find_element(By.CLASS_NAME, "info")
                name = info.find_element(By.CLASS_NAME, "business-name").text.strip()

                categories = []
                try:
                    cat_div = info.find_element(By.CLASS_NAME, "categories")
                    categories = [
                        a.text.strip() for a in cat_div.find_elements(By.TAG_NAME, "a")
                    ]
                except Exception:
                    pass

                address = "N/A"
                try:
                    adr = info.find_element(By.CLASS_NAME, "adr")
                    street = adr.find_element(By.CLASS_NAME, "street-address").text.strip()
                    locality = adr.find_element(By.CLASS_NAME, "locality").text.strip()
                    address = f"{street}, {locality}"
                except Exception:
                    try:
                        adr = info.find_element(By.CLASS_NAME, "adr")
                        address = adr.text.strip().replace("\n", ", ")
                    except Exception:
                        pass

                listings.append(
                    {
                        "page": page_number,
                        "name": name,
                        "categories": ", ".join(categories),
                        "address": address,
                    }
                )
                print(f"  {index}. {name}")
            except Exception as exc:
                print(f"  Skipped listing {index}: {exc}")
    finally:
        driver.quit()

    return listings
