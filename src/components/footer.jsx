import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StyledFooter = styled.footer`
  background-color: #343a40;
  color: white;
  width: 100%;
  margin-top: auto;
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

const iconComponents = {
  'facebook-f': FaFacebookF,
  'twitter': FaTwitter,
  'google': FaGoogle,
  'instagram': FaInstagram,
  'linkedin-in': FaLinkedinIn,
  'github': FaGithub
};

export default function Footer() {
  const handleSocialClick = (platform) => {
    toast.info(`Redireccionando a ${platform}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <StyledFooter>
      <Container className="p-4 pb-0">
        <SocialIcons className="mb-4 text-center">
          {Object.keys(iconComponents).map((icon) => {
            const IconComponent = iconComponents[icon];
            return (
              <a 
                key={icon}
                className="btn btn-outline-light btn-floating m-1" 
                href="#!" 
                role="button"
                onClick={() => handleSocialClick(icon)}
              >
                <IconComponent />
              </a>
            );
          })}
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