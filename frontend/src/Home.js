import React, { useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import HomeCover from './components/HomeCover'
import ParentComponent from './components/ParentComponent'
import Headroom from 'react-headroom'
import CMode from './components/Slider'

function Home({darkMode}) {
 
  return (
    <div>

        
        <HomeCover darkMode={darkMode} />
        <CMode/>
      </div>



  )
}

export default Home