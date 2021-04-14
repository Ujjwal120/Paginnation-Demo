import React, { useEffect } from 'react';

import './App.css';
import HScroll from './Component/horizontalScroll';

const App = () => {
  return <HScroll categoryname = "First" limit = {7} withEach = {2} >
    <div className = "box">
    </div>
    <div className = "box">
    </div>
    <div className = "box">
    </div>
    <div className = "box">
    </div>
    <div className = "box">
    </div>
  </HScroll>;
}

export default App;
