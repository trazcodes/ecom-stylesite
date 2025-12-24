import axios from "axios";

/**
 * Filter products by category and price range
 * @param {Array} checkedCategories - Array of category IDs
 * @param {Array} priceRange - Price range [min, max]
 * @param {string} mainCategory - Optional main category filter (men, women, etc.)
 * @returns {Promise<Array>} - Filtered products
 */
export const productFilter = async (checkedCategories, priceRange, mainCategory = null) => {
  try {
    const { data } = await axios.post('http://localhost:8080/api/filter-product', {
      checked: checkedCategories,
      radio: priceRange
    });
    
    // If mainCategory is specified, filter by main category
    if (mainCategory) {
      return data?.products.filter(p => p.category.mainCategory === mainCategory);
    }
    
    return data?.products;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Sort products based on specified criteria
 * @param {Array} products - Array of products to sort
 * @param {string} sortBy - Sorting criteria (price-low, price-high, name-asc, name-desc)
 * @returns {Array} - Sorted products
 */
export const sortProducts = (products, sortBy) => {
  const sortedProducts = [...products];
  
  if (sortBy === 'price-low') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name-asc') {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'name-desc') {
    sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
  }
  
  return sortedProducts;
};

/**
 * Handle adding or removing a category from filter
 * @param {boolean} value - Whether to add (true) or remove (false)
 * @param {string} id - Category ID
 * @param {string} categoryName - Category name/slug
 * @param {Array} currentChecked - Current array of checked categories
 * @param {Array} currentSelected - Current array of selected category objects
 * @returns {Object} - Updated checked and selected arrays
 */
export const handleCategoryFilter = (value, id, categoryName, currentChecked, currentSelected) => {
  let all = [...currentChecked];
  let selected = [...currentSelected];
  
  if (value) {
    all.push(id);
    selected.push({ id, name: categoryName });
  } else {
    all = all.filter(c => c !== id);
    selected = selected.filter(cat => cat.id !== id);
  }
  
  return { checked: all, selected };
};

/**
 * Get sort options for dropdown
 * @returns {Array} - Sort options
 */
export const getSortOptions = () => [
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' }
]; 