
import styled from 'styled-components';
import { Container } from 'react-bootstrap';

const StyledFooter = styled.footer`
  background-color: #343a40;
  color: white;
  width: 100%;
  margin-top: auto; /* Esto es clave para que se quede abajo */
  padding: 20px 0;
`;

const SocialIcons = styled.section`
  margin-bottom: 1rem;
  
  .btn-floating {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
`;

const Copyright = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  
  a {
    font-weight: 600;
    margin-left: 0.3rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Footer() {
  return (
    <StyledFooter>
       <Container className="p-4 pb-0">
        <SocialIcons className="mb-4 text-center">
          {['facebook-f', 'twitter', 'google', 'instagram', 'linkedin-in', 'github'].map((icon) => (
            <a 
              key={icon}
              className={`btn btn-outline-light btn-floating m-1`} 
              href="#!" 
              role="button"
            >
              <i className={`fab fa-${icon}`}></i>
            </a>
          ))}
        </SocialIcons>
      </Container>

      <Copyright className="text-center">
        © 2025: <a className="text-white" href="https://talentotech.bue.edu.ar/" target="_blank" rel="noopener noreferrer">
          talentotech.bue.edu.ar
        </a>
      </Copyright>
    </StyledFooter>
  );
}