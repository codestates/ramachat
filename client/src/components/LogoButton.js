import styled from 'styled-components';
import img from '../assets/ramachat-logo.png';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  align-items: center;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem 1rem;

  /* 크기 */
  font-size: 1.5rem;
  @media ${device.tablet} {
    font-size: 2rem;
  }

  /* 색상 */
  color: ${colors.white};

  img {
    height: 2.5rem;
    margin-right: 0.5rem;
    @media ${device.tablet} {
      height: 3rem;
    }
  }

  span {
    display: none;
    @media ${device.tablet} {
      display: inline;
    }
  }

  &:hover {
    opacity: 0.75;
  }
`;

function LogoButton() {
  // return <StyledButton>{/* <img src={img} /> */}Ramachat</StyledButton>;
  return (
    <StyledButton>
      <img src={img} />
      <span>라마챗</span>
    </StyledButton>
  );
}

export default LogoButton;
