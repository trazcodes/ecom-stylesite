// ParentComponent.js
import React, { useState } from 'react';
import Header from './Header';
import HomeCover from './HomeCover';
import Footer from './Footer';

const ParentComponent = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = JSON.parse(localStorage.getItem('darkMode'));
        return savedMode !== null ? savedMode : false;
      });
    
      const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        // Update local storage
        localStorage.setItem('darkMode', JSON.stringify(newMode));
      };

    return (
       <></>
    );
};

export default ParentComponent;
