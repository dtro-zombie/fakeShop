import { useState } from 'react'
import './App.css'
import Header from './components/header'
import Footer from './components/footer' 
import Productos from './pages/productos'


function App() {

  return (
    <>
      <Header />
     <Productos />
      <Footer />
    </>
  );
}

export default App;
