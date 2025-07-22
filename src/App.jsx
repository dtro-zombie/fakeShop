import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header';
import Footer from './components/footer'; 
import Productos from './pages/productos';
import LoginForm from './pages/loginForm';
import Carrito from './pages/carrito';

import { CarritoProvider } from './context/carritoContext';

function App() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/loginForm" element={<LoginForm />} />
          <Route path="/" element={<Productos />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CarritoProvider>
  );
}

export default App;
