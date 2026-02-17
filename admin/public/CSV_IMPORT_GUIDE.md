# Product CSV Import Guide

## Overview
This guide explains how to import products using CSV files with all available fields including detailed product information.

## CSV Format

### Basic Fields

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `productId` | String | No | Unique product identifier | PROD001 |
| `name` | String | Yes | Product name | "Aspirin 500mg Tablets" |
| `description` | String | No | Brief product description | "Pain relief medication" |
| `sku` | String | No | Stock Keeping Unit | SKU001 |
| `barcode` | String | No | Product barcode | 123456789 |
| `price` | Number | Yes | Selling price | 99.99 |
| `originalPrice` | Number | Yes | Original price before discount | 129.99 |
| `discount` | Number | No | Discount percentage | 23 |
| `stock` | Number | Yes | Available quantity | 100 |
| `sales` | Number | No | Number of units sold | 5 |
| `category` | String | Yes | Category name | "Pain Relief" |
| `brand` | String | No | Brand name | "PharmaCo" |
| `images` | String | No | Comma-separated image URLs | "url1.jpg,url2.jpg" |
| `tags` | String | No | Comma-separated tags | "health,wellness,pain" |
| `status` | String | No | Product visibility | "show" or "hide" |
| `slug` | String | Yes | URL-friendly identifier | "aspirin-500mg" |

### Tax & Compliance Fields

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `taxRate` | Number | No | Tax rate percentage | 18 |
| `isPriceInclusive` | String | No | Is tax included in price | "Yes" or "No" |
| `hsnCode` | String | No | HSN/SAC code for tax | 30049099 |

### Batch & Manufacturing Fields

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `batchNo` | String | No | Batch number | BATCH001 |
| `expDate` | Date | No | Expiration date | 2025-12-31 |
| `manufactureDate` | Date | No | Manufacturing date | 2024-01-15 |

### Wholesale Fields

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `isWholesale` | String | No | Is wholesale product | "Yes" or "No" |
| `wholePrice` | Number | No | Wholesale price | 75.00 |
| `minQuantity` | Number | No | Minimum order quantity | 10 |

### Product Variant Fields

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `isCombination` | String | No | Has variants | "Yes" or "No" |

## Detailed Product Information Fields

These fields allow you to provide comprehensive product information that will be displayed on the product detail page.

### Composition
**Field:** `composition`  
**Format:** Plain text  
**Description:** Detailed composition and formulation information  
**Example:** `"Active ingredients: Acetylsalicylic Acid 500mg, Excipients: Microcrystalline cellulose, Starch"`

### Product Highlights
**Field:** `productHighlights`  
**Format:** Pipe-separated list (|)  
**Description:** Key product highlights or selling points  
**Example:** `"Fast-acting pain relief | Reduces inflammation | Trusted by doctors | Clinically proven"`

### Product Description
**Field:** `productDescription`  
**Format:** Plain text  
**Description:** Detailed product description with features and benefits  
**Example:** `"This product provides effective relief from headaches, muscle pain, and fever. Suitable for adults and children over 12 years."`

### Ingredients
**Field:** `ingredients`  
**Format:** Pipe-separated key-value pairs (Key: Value | Key: Value)  
**Description:** List of ingredients with quantities  
**Example:** `"Acetylsalicylic Acid: 500mg | Microcrystalline Cellulose: 100mg | Starch: 50mg"`

### Key Uses
**Field:** `keyUses`  
**Format:** Pipe-separated key-value pairs (Key: Value | Key: Value)  
**Description:** Primary uses and indications  
**Example:** `"Headache: Provides quick relief | Fever: Reduces body temperature | Muscle Pain: Alleviates discomfort"`

### How to Use
**Field:** `howToUse`  
**Format:** Pipe-separated list (|)  
**Description:** Step-by-step usage instructions  
**Example:** `"Take 1-2 tablets with water | Do not exceed 6 tablets in 24 hours | Take after meals | Consult doctor if symptoms persist"`

### Safety Information
**Field:** `safetyInformation`  
**Format:** Pipe-separated list (|)  
**Description:** Safety warnings and precautions  
**Example:** `"Not suitable for children under 12 | Avoid during pregnancy | Do not use with alcohol | May cause stomach upset"`

### Additional Information
**Field:** `additionalInformation`  
**Format:** Pipe-separated sections with label and comma-separated items (Label: item1, item2 | Label: item1, item2)  
**Description:** Grouped additional information  
**Example:** `"Storage: Store below 25°C, Keep in original packaging | Dosage: Adults: 1-2 tablets, Children: Consult physician"`

### FAQs
**Field:** `faqs`  
**Format:** Pipe-separated Q&A pairs (Q: question A: answer | Q: question A: answer)  
**Description:** Frequently asked questions  
**Example:** `"Q: How long does it take to work? A: Usually within 30 minutes | Q: Can I take it on an empty stomach? A: It's better to take after meals"`

### Manufacturer Details
**Field:** `manufacturerDetails`  
**Format:** Pipe-separated list (|)  
**Description:** Manufacturer information  
**Example:** `"PharmaCo Ltd. | 123 Medical Street, City | Phone: +1234567890 | Email: info@pharmaco.com"`

### Disclaimer
**Field:** `disclaimer`  
**Format:** Plain text  
**Description:** Legal disclaimer and important notices  
**Example:** `"This product is not intended to diagnose, treat, cure, or prevent any disease. Always consult your healthcare provider before use."`

## Data Format Guidelines

### Pipe Separator (|)
Use the pipe character `|` to separate multiple items in list fields:
- `productHighlights`: `"Item 1 | Item 2 | Item 3"`
- `howToUse`: `"Step 1 | Step 2 | Step 3"`
- `safetyInformation`: `"Warning 1 | Warning 2"`

### Key-Value Pairs
For fields that require key-value pairs, use the format `Key: Value` separated by pipes:
- `ingredients`: `"Ingredient 1: 50mg | Ingredient 2: 100mg"`
- `keyUses`: `"Use 1: Description | Use 2: Description"`

### FAQ Format
For FAQs, use the format `Q: question A: answer` separated by pipes:
- `faqs`: `"Q: Question 1? A: Answer 1 | Q: Question 2? A: Answer 2"`

### Additional Information Format
For additional information with subsections, use `Label: item1, item2 | Label: item1, item2`:
- `additionalInformation`: `"Storage: Cool place, Dry place | Dosage: 1 tablet, Twice daily"`

### Comma Separator (,)
Use commas for simple lists within certain fields:
- `images`: `"image1.jpg,image2.jpg,image3.jpg"`
- `tags`: `"health,wellness,medicine"`
- Items within additional information subsections

### Date Format
Use ISO date format (YYYY-MM-DD):
- `expDate`: `2025-12-31`
- `manufactureDate`: `2024-01-15`

### Boolean Values
Use "Yes" or "No" for boolean fields:
- `isPriceInclusive`: `Yes` or `No`
- `isWholesale`: `Yes` or `No`
- `isCombination`: `Yes` or `No`

## CSV File Requirements

1. **Header Row**: First row must contain field names exactly as specified
2. **Encoding**: UTF-8 encoding recommended
3. **Quotes**: Use double quotes for fields containing commas, pipes, or special characters
4. **Empty Fields**: Leave empty if not applicable, but maintain column structure
5. **Line Breaks**: Each product should be on a single line

## Example CSV Row

```csv
PROD001,"Aspirin 500mg Tablets","Pain relief medication",SKU001,123456789,99.99,129.99,23,100,5,"Pain Relief","PharmaCo","https://example.com/image1.jpg,https://example.com/image2.jpg","health,wellness,pain",show,18,Yes,30049099,BATCH001,2025-12-31,2024-01-15,No,0,0,No,aspirin-500mg,"Active ingredients: Acetylsalicylic Acid 500mg","Fast-acting | Reduces inflammation | Trusted by doctors","Provides effective relief from headaches, muscle pain, and fever","Acetylsalicylic Acid: 500mg | Microcrystalline Cellulose: 100mg","Headache: Quick relief | Fever: Reduces temperature","Take 1-2 tablets with water | Do not exceed 6 tablets in 24 hours","Not suitable for children under 12 | Avoid during pregnancy","Storage: Store below 25°C, Keep dry | Dosage: Adults: 1-2 tablets","Q: How long to work? A: Usually 30 minutes | Q: Empty stomach? A: Better after meals","PharmaCo Ltd. | 123 Medical Street | Phone: +1234567890","This product is not intended to diagnose, treat, cure, or prevent any disease."
```

## Import Process

1. **Prepare CSV**: Create your CSV file following the format above
2. **Upload**: Use the admin panel's "Upload Many" feature
3. **Select File**: Choose your CSV file
4. **Import**: Click upload to process the file
5. **Verify**: Check the imported products in the product list

## Tips for Success

- **Test First**: Import a small batch to verify format
- **Backup**: Always backup existing data before bulk import
- **Validation**: Ensure all required fields are filled
- **Categories**: Make sure categories exist before import
- **Brands**: Ensure brands are created beforehand
- **Images**: Use valid, accessible image URLs
- **Special Characters**: Properly escape quotes and special characters
- **Consistency**: Maintain consistent formatting across all rows

## Troubleshooting

### Common Issues

1. **Import Fails**: Check CSV encoding (should be UTF-8)
2. **Missing Data**: Verify all required fields are present
3. **Formatting Errors**: Ensure proper use of separators (|, ,)
4. **Category Not Found**: Create categories before importing products
5. **Brand Not Found**: Create brands before importing products

### Field-Specific Issues

- **Dates**: Use YYYY-MM-DD format
- **Numbers**: Don't use currency symbols or thousand separators
- **Booleans**: Use exactly "Yes" or "No" (case-sensitive)
- **Lists**: Check for proper separator usage (| for main items, , for sub-items)
