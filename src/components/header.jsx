import {Navbar,Container,Nav,NavDropdown} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';



export default function Header()
{

const navigate = useNavigate();

    return(

       <>
     <Navbar collapseOnSelect expand="lg" className="bg-secondary text-light">
      <Container>
        <Navbar.Brand href="#home">Fake-Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
             <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            {/* <Nav.Link href="#pricing">Poductos</Nav.Link> */}
            {/* <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/loginForm">Login</Nav.Link>
            <Nav.Link as={Link} to="/carrito">
             <i className="bi bi-cart"> shop</i>

            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      <br />
     
    </>



    )
}