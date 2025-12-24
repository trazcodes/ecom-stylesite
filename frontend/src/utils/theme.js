// Theme utility for consistent theme application
const getStoredTheme = () => localStorage.getItem('theme') || 'light';

// Apply theme to document body immediately
export const applyTheme = (theme) => {
  const body = document.body;
  
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Add Bootstrap dark mode classes
    document.querySelectorAll('.bg-light').forEach(el => {
      el.classList.remove('bg-light');
      el.classList.add('bg-dark');
    });
    
    document.querySelectorAll('.text-dark').forEach(el => {
      el.classList.remove('text-dark');
      el.classList.add('text-white');
    });
    
    document.querySelectorAll('.btn-light').forEach(el => {
      el.classList.remove('btn-light');
      el.classList.add('btn-dark');
    });
    
    document.querySelectorAll('.card').forEach(card => {
      card.classList.add('text-white', 'bg-dark');
      card.classList.remove('text-dark', 'bg-white');
    });
    
    document.querySelectorAll('.card-header').forEach(cardHeader => {
      cardHeader.classList.add('bg-dark', 'border-secondary');
      cardHeader.classList.remove('bg-light');
    });
  } else {
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
    document.documentElement.setAttribute('data-theme', 'light');
    
    // Remove Bootstrap dark mode classes
    document.querySelectorAll('.bg-dark').forEach(el => {
      el.classList.remove('bg-dark');
      el.classList.add('bg-light');
    });
    
    document.querySelectorAll('.text-white').forEach(el => {
      el.classList.remove('text-white');
      el.classList.add('text-dark');
    });
    
    document.querySelectorAll('.btn-dark').forEach(el => {
      el.classList.remove('btn-dark');
      el.classList.add('btn-light');
    });
    
    document.querySelectorAll('.card').forEach(card => {
      card.classList.remove('text-white', 'bg-dark');
      card.classList.add('text-dark', 'bg-white');
    });
    
    document.querySelectorAll('.card-header').forEach(cardHeader => {
      cardHeader.classList.remove('bg-dark', 'border-secondary');
      cardHeader.classList.add('bg-light');
    });
  }
  
  // Apply to filter sidebar if it exists
  const filterSidebar = document.querySelector('.filter-sidebar');
  if (filterSidebar) {
    if (theme === 'dark') {
      filterSidebar.style.backgroundColor = '#212529';
    } else {
      filterSidebar.style.backgroundColor = '#f8f9fa';
    }
  }
};

// Set theme and save to localStorage
export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
  
  // Dispatch event for other components to listen to
  window.dispatchEvent(new Event('themeChange'));
};

// Toggle between light and dark theme
export const toggleTheme = () => {
  const currentTheme = getStoredTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
};

// Initialize theme on load
export const initTheme = () => {
  const storedTheme = getStoredTheme();
  applyTheme(storedTheme);
  return storedTheme;
}; 