import React from 'react';
import './App.css';
import Receipt from './receipt';

function App() {
  return (
    <div className="App">
      <Receipt transactionHash="0x409b56eaa505274b636835fd1ec5a8319a1c9278731054be1b9842b48b0ca548" />
    </div>
  );
}

export default App;