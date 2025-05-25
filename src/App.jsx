import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/header'
import Footer from './components/footer' 
import Productos from './pages/productos'
import LoginForm from './pages/loginForm';


function App() {

  return (
    <>
    <BrowserRouter>
      <Header />

       <Routes>
        {/* <Route path="/" element={<Inicio />} /> */}
        <Route path="/loginForm" element={<LoginForm/>} />
        {/* <Route path="/productos" element={<Productos />} /> */}
        {/* <Route path="/perfil/:id" element={
          <RutaProtegida><Perfil /></RutaProtegida>
        } />
        <Route path="/admin" element={
          <RutaProtegida><Administracion /></RutaProtegida>
        } /> */}

        <Route path="/" element={<Productos />} />

      </Routes>
    
      <Footer />

      </BrowserRouter>
    </>
  );
}

export default App;
