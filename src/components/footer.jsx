import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

export default function Footer() {
  return (
    // Elimina el div contenedor o ajusta sus clases
    // Las clases 'fixed-bottom' y 'w-100' son clave aquí
    <footer className="bg-dark text-center text-white w-100 mt-5">
      <div className="container p-4 pb-0">
        <section className="mb-4">
          <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
            <i className="fab fa-twitter"></i>
          </a>
          <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
            <i className="fab fa-google"></i>
          </a>
          <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
            <i className="fab fa-instagram"></i>
          </a>
          <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button">
            <i className="fab fa-github"></i>
          </a>
        </section>
      </div>

      <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2025:
        <a className="text-white" href="https://talentotech.bue.edu.ar/" target='_blank'>talentotech.bue.edu.ar</a>
      </div>
    </footer>
  );
}