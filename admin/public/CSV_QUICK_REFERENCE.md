# CSV Import Quick Reference

## Field Separators

| Separator | Usage | Example |
|-----------|-------|---------|
| **Pipe `\|`** | Separate list items | `"Item 1 \| Item 2 \| Item 3"` |
| **Colon `:`** | Separate key from value | `"Key: Value"` |
| **Comma `,`** | Separate sub-items | `"Label: item1, item2"` |

## Field Types Quick Guide

### 📝 Plain Text
**Fields:** composition, productDescription, disclaimer  
**Format:** Just plain text  
**Example:** `"This is a description"`

### 📋 Simple Lists
**Fields:** productHighlights, howToUse, safetyInformation, manufacturerDetails  
**Format:** `"Item 1 | Item 2 | Item 3"`  
**Example:** `"Fast acting | Clinically proven | Doctor recommended"`

### 🔑 Key-Value Lists
**Fields:** ingredients, keyUses  
**Format:** `"Key1: Value1 | Key2: Value2"`  
**Example:** `"Aspirin: 500mg | Caffeine: 50mg"`

### 📚 Subsections
**Field:** additionalInformation  
**Format:** `"Label1: item1, item2 | Label2: item3, item4"`  
**Example:** `"Storage: Cool place, Dry place | Dosage: 1 tablet, Twice daily"`

### ❓ FAQs
**Field:** faqs  
**Format:** `"Q: Question1? A: Answer1 | Q: Question2? A: Answer2"`  
**Example:** `"Q: How to use? A: Take with water | Q: Side effects? A: Consult doctor"`

## Common Mistakes to Avoid

❌ **Wrong:** Using comma instead of pipe for main items  
✅ **Right:** Use pipe `|` for main items, comma `,` only for sub-items

❌ **Wrong:** `"Item1, Item2, Item3"` (for productHighlights)  
✅ **Right:** `"Item1 | Item2 | Item3"`

❌ **Wrong:** Missing colon in key-value pairs  
✅ **Right:** `"Key: Value"` not `"Key Value"`

❌ **Wrong:** FAQ without Q: and A: markers  
✅ **Right:** `"Q: Question? A: Answer"`

## Required vs Optional Fields

### ✅ Required
- name
- price
- originalPrice
- stock
- category
- slug

### 📋 Optional (All Detail Fields)
- composition
- productHighlights
- productDescription
- ingredients
- keyUses
- howToUse
- safetyInformation
- additionalInformation
- faqs
- manufacturerDetails
- disclaimer

## Quick Examples

### Product Highlights
```csv
"Fast-acting relief | Reduces inflammation | Clinically tested | Doctor recommended"
```

### Ingredients
```csv
"Acetylsalicylic Acid: 500mg | Microcrystalline Cellulose: 100mg | Starch: 50mg"
```

### How to Use
```csv
"Take 1-2 tablets with water | Do not exceed 6 tablets in 24 hours | Take after meals"
```

### FAQs
```csv
"Q: How long does it take to work? A: Usually within 30 minutes | Q: Can I take it on an empty stomach? A: It's better to take after meals"
```

### Additional Information
```csv
"Storage: Store below 25°C, Keep in original packaging | Dosage: Adults: 1-2 tablets, Children: Consult physician"
```

## Tips

💡 **Use quotes** around fields containing commas, pipes, or special characters  
💡 **Test first** with a small batch before bulk import  
💡 **Keep backup** of your data before importing  
💡 **Check encoding** - use UTF-8 for best compatibility  
💡 **Validate dates** - use YYYY-MM-DD format  
💡 **Boolean values** - use exactly "Yes" or "No"

## Need Help?

📖 See **CSV_IMPORT_GUIDE.md** for detailed documentation  
📄 Use **product_import_template.csv** as a starting template  
📋 Check **IMPLEMENTATION_SUMMARY.md** for technical details
