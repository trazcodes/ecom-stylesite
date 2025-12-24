# Filter Utility

This directory contains utility functions used throughout the application to promote code reuse and maintainability.

## filter.js

`filter.js` provides centralized filter functionality for product listings. This prevents code duplication across different product list components (MenProducts, WomenProducts, AllProducts, etc.).

### Functions

#### productFilter(checkedCategories, priceRange, mainCategory)
Filters products based on categories and price range.

- **Parameters:**
  - `checkedCategories` (Array): Array of category IDs to filter by
  - `priceRange` (Array): Price range [min, max] to filter by
  - `mainCategory` (String, optional): Main category to filter by (men, women, etc.)

- **Returns:**
  - Promise that resolves to an array of filtered products

#### sortProducts(products, sortBy)
Sorts an array of products based on specified criteria.

- **Parameters:**
  - `products` (Array): Array of products to sort
  - `sortBy` (String): Sorting criteria (price-low, price-high, name-asc, name-desc)

- **Returns:**
  - Sorted array of products

#### handleCategoryFilter(value, id, categoryName, currentChecked, currentSelected)
Handles adding or removing a category from filter.

- **Parameters:**
  - `value` (Boolean): Whether to add (true) or remove (false) the category
  - `id` (String): Category ID
  - `categoryName` (String): Category name/slug
  - `currentChecked` (Array): Current array of checked categories
  - `currentSelected` (Array): Current array of selected category objects

- **Returns:**
  - Object with updated `checked` and `selected` arrays

#### getSortOptions()
Returns common sort options for product listings.

- **Returns:**
  - Array of sort option objects with value and label properties

### Usage

Import these functions where needed:

```javascript
import { 
  productFilter, 
  sortProducts, 
  handleCategoryFilter, 
  getSortOptions 
} from '../utils/filter';
```

This approach:
1. Reduces code duplication
2. Makes maintenance easier (fix bugs in one place)
3. Ensures consistent filtering behavior across the application 