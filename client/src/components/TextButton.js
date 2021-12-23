import styled from 'styled-components';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';

const SolidButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  white-space: nowrap;

  /* 크기 */
  font-size: 0.85rem;
  width: ${(props) => (props.width === 'fit' ? 'fit-content' : '100%')};
  @media ${device.tablet} {
    font-size: 1rem;
  }

  /* 색상 */
  background-color: ${(props) => colors[props.color]};
  border: 2px solid ${(props) => colors[props.color]};
  color: ${colors.white};

  &:hover {
    opacity: 0.75;
  }
`;

const TransparentButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  white-space: nowrap;

  /* 크기 */
  font-size: 0.85rem;
  width: ${(props) => (props.width === 'fit' ? 'fit-content' : '100%')};
  @media ${device.tablet} {
    font-size: 1rem;
  }

  /* 색상 */
  color: ${(props) => colors[props.color]};
  border: 2px solid ${(props) => colors[props.color]};

  &:hover {
    opacity: 0.75;
  }
`;

function TextButton({ children, color, isTransparent, width, onClick }) {
  return (
    <>
      {isTransparent ? (
        <TransparentButton color={color} width={width} onClick={onClick}>
          {children}
        </TransparentButton>
      ) : (
        <SolidButton color={color} width={width} onClick={onClick}>
          {children}
        </SolidButton>
      )}
    </>
  );
}

export default TextButton;
