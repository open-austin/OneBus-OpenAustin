# OneBus-OA-Data: GTFS Data Processing for Austin Transit

## 🚍 Overview

**OneBus-OA-Data** is part of the civic tech project OneBus, a website that locals can use to find places of interest that are **one bus** away from them. The One Bus Data repo is
focused on providing the tools for processing, cleaning, and analyzing General Transit Feed Specification (GTFS) data as well as scraping POI data.

**Project Status**: Actively maintained | **Part of**: [Open Austin](https://open-austin.odoo.com)

## ✨ Features

- **GTFS Data Processing**: Clean and transform raw Cap Metro GTFS data
- **Points of Interest (POI) Integration**: Extract and integrate relevant POIs using OSMNX

## 📊 Data Sources

| Source | Description | Update Frequency |
|--------|-------------|------------------|
| **[Cap Metro GTFS](https://data.texas.gov/dataset/CapMetro-GTFS/r4v4-vz24)** | Raw transit schedules, routes, stops | Monthly |
| **OpenStreetMap (OSMNX)** | Points of Interest around Austin | Real-time queries |
| **Custom POI Datasets** | Austin-specific locations and amenities | Ongoing |

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Git
- Jupyter Notebook (for analysis)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/OneBus-OA-Data.git
   cd OneBus-OA-Data