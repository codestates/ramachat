import styled from 'styled-components';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';
import { NavLink } from 'react-router-dom';
import IconButton from '../components/IconButton';
import TextButton from './TextButton';

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 60px;
  align-items: center;
  gap: 1.25rem;
  position: fixed;
  height: 100%;
  padding: 1.25rem;
  border-right: 1px solid ${colors.primary};
  font-size: 1.75rem;

  .nav-name {
    display: none;
  }

  @media ${device.tablet} {
    align-items: flex-start;
    width: 240px;
    padding-left: 2rem;
    .nav-name {
      display: inline;
      font-size: 1.25rem;
      margin-left: 1rem;
    }
  }

  .active {
    color: ${colors.primary};
  }
`;

export default function Tabbar() {
  return (
    <TabContainer>
      <NavLink to="/mypage/personal-information">
        <i className="far fa-user"></i>
        <span className="nav-name">내 정보</span>
      </NavLink>
      <NavLink to="/mypage/my-activities">
        <i className="far fa-comment-dots"></i>
        <span className="nav-name">내가 쓴 글</span>
      </NavLink>
      <NavLink to="/mypage/notifications">
        <i className="far fa-bell"></i>
        <span className="nav-name">내 소식</span>
      </NavLink>
    </TabContainer>
  );
}
