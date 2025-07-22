import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.25rem;
  }
`;

export default function Spinner() {
  return (
    <SpinnerContainer>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </SpinnerContainer>
  );
}