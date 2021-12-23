import Tabbar from '../components/Tabbar';
import axios from 'axios';
import styled from 'styled-components';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';
import TextButton from '../components/TextButton';
import InputForm from '../components/InputForm';
import Modal from '../components/Modal';
import { useEffect, useState } from 'react';

const Main = styled.main`
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  display: flex;
  position: relative;
`;

const Section = styled.section`
  margin-left: 60px;
  width: 100%;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-right: 1px solid ${colors.primary};
  input {
    margin-bottom: 1rem;
  }
  p {
    line-height: 2;
  }
  .alert {
    font-family: SpoqaHanSansNeo-Regular;
    margin-bottom: 1rem;
    white-space: pre-line;
  }
  @media ${device.tablet} {
    margin-left: 240px;
  }
`;

axios.defaults.withCredentials = true;

export default function MyPagePersonal({ tokenState, handleLogout }) {
  const [isChange, setIsChange] = useState(false);
  const [myPageInfo, setMyPageInfo] = useState(null);
  const userId = myPageInfo ? myPageInfo.userId : '';
  const email = myPageInfo ? myPageInfo.email : '';
  const token = tokenState ? tokenState : sessionStorage.getItem('token');

  // *passwordRegex
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
  // *비밀번호 메시지
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
  // *비밀번호 유효성 검사 메시지
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  // *모달 메시지
  const [modalMsg, setModalMsg] = useState('');

  // * signout 확인
  const [checkSignout, setCheckSignout] = useState(false);
  const handleCheckSignout = () => {
    setIsOpen(!isOpen);
    handleLogout(); // 로그아웃 처리
  };

  // 비밀번호 변경
  // ! 유효성 검사 추가?
  const [passwordInfo, setPasswordInfo] = useState({
    nowPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const openChangePassword = () => {
    setIsChange(!isChange);
  };

  // const handleInputValue = (target) => (e) => {
  //   setPasswordInfo({ ...passwordInfo, [target]: e.target.value });
  // };

  //*비밀번호 검사
  const handleInputValue = (target) => (e) => {
    setPasswordInfo({ ...passwordInfo, [target]: e.target.value });
    if (target === 'newPassword') {
      let passwordCurrent = e.target.value;
      if (!passwordRegex.test(passwordCurrent)) {
        setPasswordMessage(`숫자+영문자+특수문자 조합으로
        8자리 이상 입력해주세요!
        사용 가능한 특수문자는 !@#$%^*+=- 입니다.`);
        setIsPassword(false);
      } else {
        setPasswordMessage('안전한 비밀번호에요 :)');
        setIsPassword(true);
      }
    } else if (target === 'newPasswordConfirm') {
      if (e.target.value === passwordInfo.newPassword) {
        setPasswordConfirmMessage('비밀번호를 똑같이 입력했어요 :)');
        setIsPasswordConfirm(true);
      } else {
        setPasswordConfirmMessage('비밀번호가 틀려요. 다시 확인해주세요!');
        setIsPasswordConfirm(false);
      }
    }
  };

  const getMyPage = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/userInfo`, {
        headers: {
          'Content-Type': `application/json`,
          authorization: 'Bearer ' + token,
        },
        withCredentials: true,
      })
      .then((res) => {
        setMyPageInfo(res.data.data.userInfo);
      })
      .catch(() => console.log('getMyPage 에러'));
  };

  const changePassword = () => {
    // *비밀번호가 유효성 검사를 통과하지 못했을 때 요청 X
    if (!isPassword || !isPasswordConfirm) return;
    // 비밀번호 변경 성공 모달띄우기...
    axios
      .patch(
        `${process.env.REACT_APP_SERVER_URL}/passwordModify`,
        {
          //withCredentials: true,
          password: passwordInfo.nowPassword,
          newPassword: passwordInfo.newPassword,
        },
        {
          headers: {
            'Content-Type': `application/json`,
            authorization: 'Bearer ' + tokenState,
          },
        }
      )
      .then(() => {
        //* 성공 메시지
        setModalMsg('비밀번호 변경이 완료되었습니다!');
        setIsOpen(!isOpen);
      }) // 비밀번호 변경 버튼 클릭시 모달 열기
      .catch((err) => {
        // * 에러 메시지
        const errCode = err.response.status;
        if (errCode === 400) {
          console.log('400!!');
          setModalMsg('현재 입력하신 비밀번호가\n일치하지 않습니다!');
          setIsOpen(!isOpen);
        } else if (errCode === 422) {
          setModalMsg('현재 입력하신 비밀번호가\n이전 비밀번호와 같습니다!');
          setIsOpen(!isOpen);
        } else {
          setModalMsg('비밀번호 변경에 실패하였습니다!');
          setIsOpen(!isOpen);
        }
        console.log('changePassword 에러');
      });
  };

  const signOut = () => {
    // 회원탈퇴 성공 모달띄우기...
    axios
      .delete(`${process.env.REACT_APP_SERVER_URL}/signout`, {
        headers: {
          'Content-Type': `application/json`,
          authorization: 'Bearer ' + tokenState,
        },
        withCredentials: true,
      })
      .then(() => {
        setCheckSignout(true);
      })
      .catch(() => console.log('signOut 에러'));
  };
  console.log(checkSignout);

  // 모달 코드
  const [isOpen, setIsOpen] = useState(false);

  const openModalHandler = () => {
    setIsOpen(!isOpen);
  };

  const closeChangeHandler = () => {
    console.log('closeChangeHandler');
    // 패스워드 바뀐 후 => 요청 성공
    if (modalMsg === '비밀번호 변경이 완료되었습니다!') {
      console.log('성공!!');
      setIsChange(false);
      setPasswordInfo({
        nowPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    getMyPage();
  }, []);

  return (
    <>
      <Main>
        <Tabbar></Tabbar>
        <Section>
          <h1>My Page</h1>
          <p>
            User Id : {userId}
            <br />
            E-mail : {email}
          </p>
          {isChange ? (
            <>
              <InputForm
                label="현재 비밀번호"
                target="nowPassword"
                type="password"
                handleInputValue={handleInputValue}
              ></InputForm>
              <InputForm
                label="새 비밀번호"
                target="newPassword"
                type="password"
                handleInputValue={handleInputValue}
              ></InputForm>
              {/* 유효성 검사 결과 메시지 */}
              {passwordInfo.newPassword.length > 0 && (
                <span className="alert">{passwordMessage}</span>
              )}
              <InputForm
                label="새 비밀번호 확인"
                target="newPasswordConfirm"
                type="password"
                handleInputValue={handleInputValue}
              ></InputForm>
              {/* 비밀번호 확인 메시지 */}
              {passwordInfo.newPasswordConfirm.length > 0 && (
                <span className="alert">{passwordConfirmMessage}</span>
              )}
              <br />
              <TextButton
                color="secondary"
                isTransparent={false}
                onClick={changePassword}
              >
                Change
              </TextButton>
              <Modal
                isOpen={isOpen}
                openModalHandler={openModalHandler}
                modalActionlHandler={closeChangeHandler}
                noticeMessage={modalMsg}
                buttonMessage={'확인'}
                endPoint={'/mypage/personal-information'}
              />
            </>
          ) : (
            <>
              <TextButton
                color="secondary"
                isTransparent={false}
                width="fit"
                onClick={openChangePassword}
              >
                Change Password
              </TextButton>
              <br />
              <TextButton
                color="secondary"
                isTransparent={true}
                width="fit"
                onClick={openModalHandler}
              >
                Sign out
              </TextButton>
              {isOpen && checkSignout ? (
                <Modal
                  isOpen={isOpen}
                  openModalHandler={openModalHandler}
                  modalActionlHandler={handleCheckSignout}
                  noticeMessage={'회원 탈퇴가 완료되었습니다!'}
                  buttonMessage={'홈으로 가기'}
                  endPoint={'/'}
                />
              ) : (
                <Modal
                  isOpen={isOpen}
                  openModalHandler={openModalHandler}
                  modalActionlHandler={signOut}
                  noticeMessage={'정말 회원 탈퇴 하실건가요?'}
                  buttonMessage={'네, 탈퇴할래요'}
                />
              )}
            </>
          )}
        </Section>
      </Main>
    </>
  );
}
