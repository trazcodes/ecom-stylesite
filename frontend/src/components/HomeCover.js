import React, { useEffect,useState } from 'react';
import './Home.css';

const HomeCover = ({ darkMode }) => {
    
    
    return (
        <div className="container-fluid mt-3" style={{zIndex:-1000 ,padding: 0 }}>
            <div className="card d-flex justify-content-center custom-card" style={{backgroundColor: `${darkMode? '#1c1616' : '#67ac94'}`}}>
                <img
                    src="https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?ixlib=rb-4.0.3&ixid=.%3D%3D&auto=format&fit=crop&w=1631&q=80"
                    style={{ opacity: 0.6, width: '100%', height: '50vw' }} className="card-img" alt="Brand Background" />
                <div className="card-img-overlay text-center">
                    <p className="card-title custom-card-title">StyleSite</p>
                    <p className="card-text custom-card-text text-center" style={{ fontSize: '4vw', fontFamily: 'Oxanium, cursive' }}>Where Site Meets Style</p>
                </div>
            </div>
        </div>
    );
};

export default HomeCover;
