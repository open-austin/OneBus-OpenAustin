"""Geocode addresses with the US Census one-line address API."""

import time

import requests
from bs4 import BeautifulSoup

CENSUS_URL = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress"
GEOCODE_DELAY_SEC = 1


def geocode_address_census(address: str) -> dict | None:
    """
    Geocode one address. Returns matched_address, latitude, longitude, or None.
    """
    if not address or address.strip().upper() == "N/A":
        return None

    params = {"address": address, "benchmark": "4"}

    try:
        response = requests.get(CENSUS_URL, params=params, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        result_div = soup.find("div")
        if not result_div:
            return None

        lat = None
        lon = None
        matched_address = None

        for bold in result_div.find_all("b"):
            label = bold.get_text(strip=True)
            if "Latitude" in label or "latitude" in label:
                lat_span = bold.find_next("span")
                if lat_span:
                    lat = float(lat_span.get_text(strip=True))
            elif "Longitude" in label or "longitude" in label:
                lon_span = bold.find_next("span")
                if lon_span:
                    lon = float(lon_span.get_text(strip=True))
            elif "Matched Address" in label or "matched address" in label:
                matched_span = bold.find_next("span")
                if matched_span:
                    matched_address = matched_span.get_text(strip=True)

        if lat is None or lon is None:
            for span in result_div.find_all("span"):
                text = span.get_text(strip=True)
                if not text or text[0] not in "-0123456789" or "." not in text:
                    continue
                value = float(text)
                if text.startswith("-") and abs(value) > 70:
                    lon = value
                elif abs(value) < 50:
                    lat = value

        if lat is not None and lon is not None:
            return {
                "matched_address": matched_address,
                "latitude": lat,
                "longitude": lon,
            }
        return None
    except requests.exceptions.RequestException as exc:
        print(f"Geocode request error: {exc}")
        return None
    except Exception as exc:
        print(f"Geocode parse error: {exc}")
        return None


def add_coordinates_to_listings(
    listings: list[dict],
    delay_sec: float = GEOCODE_DELAY_SEC,
) -> list[dict]:
    """Add matched_address, latitude, and longitude to each listing dict."""
    for listing in listings:
        address = listing.get("address", "N/A")
        coords = geocode_address_census(address)
        if coords:
            listing["matched_address"] = coords["matched_address"]
            listing["latitude"] = coords["latitude"]
            listing["longitude"] = coords["longitude"]
            print(f"  {listing['name']} -> {coords['latitude']}, {coords['longitude']}")
        else:
            listing["matched_address"] = None
            listing["latitude"] = None
            listing["longitude"] = None
            print(f"  {listing['name']} -> geocode failed")
        time.sleep(delay_sec)
    return listings
