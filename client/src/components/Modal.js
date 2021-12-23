import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors } from '../styles/Colors';
import IconButton from './IconButton';
import TextButton from './TextButton';

const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: grid;
  place-items: center;
`;

const ModalContainer = styled.div`
  /* height: 15rem; */
  text-align: center;
  /* margin: 120px auto; */
`;

const ModalView = styled.div`
  background-color: ${colors.white};
  width: 300px;
  padding: 1rem;
  > p.desc {
    margin-top: 20px;
  }
`;

const ClickButton = styled.button`
  /* 공통 스타일 */
  /* display: inline-flex; */
  align-items: center;
  outline: none;
  border: none;
  border-radius: 4px;
  color: black;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  height: 2.25rem;
  font-size: 1rem;

  /* 색상 */
  background: #eee;
`;

function Modal({
  isOpen,
  openModalHandler,
  modalActionlHandler,
  noticeMessage,
  buttonMessage,
  endPoint,
}) {
  return (
    <>
      <ModalContainer>
        {isOpen ? (
          <ModalBackdrop>
            <ModalView onClick={(e) => e.stopPropagation()}>
              {/* <button onClick={openModalHandler} className="close-btn">
                <i className="fas fa-times"></i>
              </button> */}
              <IconButton onClick={openModalHandler}>
                <i className="fas fa-times"></i>
              </IconButton>
              <p className="desc">{noticeMessage}</p>
              {endPoint ? (
                <Link to={endPoint}>
                  {/* <ClickButton onClick={modalActionlHandler}>{buttonMessage}</ClickButton> */}
                  <TextButton color="secondary" width="fit" onClick={modalActionlHandler}>
                    {buttonMessage}
                  </TextButton>
                </Link>
              ) : (
                <TextButton color="secondary" width="fit" onClick={modalActionlHandler}>
                  {buttonMessage}
                </TextButton>
                // <ClickButton onClick={modalActionlHandler}>{buttonMessage}</ClickButton>
              )}
            </ModalView>
          </ModalBackdrop>
        ) : null}
      </ModalContainer>
    </>
  );
}

export default Modal;
