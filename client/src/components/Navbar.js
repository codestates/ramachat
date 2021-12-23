import styled from 'styled-components';
import TextButton from './TextButton';
import LogoButton from './LogoButton';
import Modal from './Modal';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';

const NavContainer = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  background-color: ${colors.primary};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  nav {
    width: 850px;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  img {
    margin-top: -0.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

function Navbar({ isLogin, handleLogout }) {
  // 모달 코드
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoutButton = () => {
    handleLogout();
    setIsOpen(!isOpen);
  };

  const openModalHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <NavContainer>
        <nav>
          <Link to="/">
            <LogoButton />
          </Link>
          {isLogin ? (
            <ButtonGroup>
              <TextButton
                color="white"
                isTransparent={true}
                width="fit"
                onClick={handleLogoutButton}
              >
                로그아웃
              </TextButton>
              <Link to="/mypage/personal-information">
                <TextButton color="secondary" isTransparent={false} width="fit">
                  마이페이지
                </TextButton>
              </Link>
            </ButtonGroup>
          ) : (
            <ButtonGroup>
              <Link to="/login">
                <TextButton color="white" isTransparent={true} width="fit">
                  로그인
                </TextButton>
              </Link>
              <Link to="/signup">
                <TextButton color="secondary" isTransparent={false} width="fit">
                  회원가입
                </TextButton>
              </Link>
            </ButtonGroup>
          )}
        </nav>
        <Modal
          isOpen={isOpen}
          openModalHandler={openModalHandler}
          modalActionlHandler={openModalHandler}
          noticeMessage={'정상적으로 로그아웃이 완료되었습니다!'}
          buttonMessage={'홈으로 가기'}
          endPoint={'/'}
        />
      </NavContainer>
    </div>
  );
}

export default Navbar;
