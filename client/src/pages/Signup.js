import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';
import TextButton from '../components/TextButton';
import Modal from '../components/Modal';
import InputForm from '../components/InputForm';

axios.defaults.withCredentials = true;

const Main = styled.main`
  width: 100%;
  @media ${device.tablet} {
    background-color: ${colors.primaryL};
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const LoginContainer = styled.div`
  width: 100%;
  background-color: ${colors.white};
  padding: 1rem;
  @media ${device.tablet} {
    width: 400px;
    padding: 2rem;
  }
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  .alert {
    font-family: SpoqaHanSansNeo-Regular;
    white-space: pre-line;
  }
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 80%;
`;

const AlertBox = styled.div`
  width: 100%;
  text-align: center;
  color: ${colors.warning};
  background-color: ${colors.warningL};
  padding: 0.75rem 1.25rem;
`;

const LinkSpan = styled.span`
  font-weight: bold;
  &:hover {
    color: ${colors.secondary};
  }
`;

export default function Signup() {
  const [userInfo, setUserInfo] = useState({
    email: '',
    userId: '',
    password: '',
    passwordConfirmation: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  // const navigate = useNavigate();

  const handleSignup = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/signup`, {
        email: userInfo.email,
        userId: userInfo.userId,
        password: userInfo.password,
      })
      .then(() => setIsOpen(!isOpen)) // 회원가입 버튼 클릭시 모달 열기
      .catch((err) => {
        // const errCode = err.response.status;
        const errMessage = err.response.data.message;
        if (errMessage === 'already existed userId') {
          setErrorMessage('이미 존재하는 유저 아이디입니다!');
        } else if (errMessage === 'already existed email') {
          setErrorMessage('이미 존재하는 이메일입니다!');
        } else {
          setErrorMessage('회원가입에 실패하였습니다!');
        }
        console.log('handleSignup 에러');
      });
  };

  // 유효성검사 코드
  // 이메일, 아이디, 비밀번호, 비밀번호 확인
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 오류메시지 상태
  const [emailMessage, setEmailMessage] = useState('');
  const [userIdMessage, setUserIdMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');

  // 유효성 검사
  const [isEmail, setIsEmail] = useState(false);
  const [isUserId, setIsUserId] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

  // 이메일
  const onChangeEmail = useCallback(
    (e) => {
      setUserInfo({ ...userInfo, email: e.target.value });
      const emailRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      const emailCurrent = e.target.value;
      setEmail(emailCurrent);

      if (!emailRegex.test(emailCurrent)) {
        console.log('이메일 형식이 틀렸어요! 다시 확인해주세요!');
        setEmailMessage('이메일 형식이 틀렸어요! 다시 확인해주세요!');
        setIsUserId(false);
      } else {
        setEmailMessage('올바른 이메일 형식이에요 :)');
        setIsUserId(true);
      }
    },
    [userInfo]
  );

  // 아이디
  const onChangeUserId = useCallback(
    (e) => {
      setUserInfo({ ...userInfo, userId: e.target.value });
      setUserId(e.target.value);
      if (e.target.value.length < 3 || e.target.value.length > 10) {
        setUserIdMessage('3글자 이상 10글자 이하로 입력해주세요.');
        setIsEmail(false);
      } else {
        setUserIdMessage('올바른 이름 형식입니다 :)');
        setIsEmail(true);
      }
    },
    [userInfo]
  );

  // 비밀번호
  const onChangePassword = useCallback(
    (e) => {
      setUserInfo({ ...userInfo, password: e.target.value });
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
      const passwordCurrent = e.target.value;
      setPassword(passwordCurrent);

      if (!passwordRegex.test(passwordCurrent)) {
        setPasswordMessage(
          `숫자+영문자+특수문자 조합으로
          8자리 이상 입력해주세요!
          사용 가능한 특수문자는 !@#$%^*+=- 입니다.`
        );
        setIsPassword(false);
      } else {
        setPasswordMessage('안전한 비밀번호에요 :)');
        setIsPassword(true);
      }
    },
    [userInfo]
  );

  // 비밀번호 확인
  const onChangePasswordConfirm = useCallback(
    (e) => {
      setUserInfo({ ...userInfo, passwordConfirmation: e.target.value });
      const passwordConfirmCurrent = e.target.value;
      setPasswordConfirm(passwordConfirmCurrent);

      if (password === passwordConfirmCurrent) {
        setPasswordConfirmMessage('비밀번호를 똑같이 입력했어요 :)');
        setIsPasswordConfirm(true);
      } else {
        setPasswordConfirmMessage('비밀번호가 달라요. 다시 확인해주세요!');
        setIsPasswordConfirm(false);
      }
    },
    [userInfo, password]
  );

  // 모달 코드
  const [isOpen, setIsOpen] = useState(false);

  const openModalHandler = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  useEffect(() => {
    if (isUserId && isEmail && isPassword && isPasswordConfirm) {
      setErrorMessage('');
    }
  }, [isUserId, isEmail, isPassword, isPasswordConfirm]);

  return (
    <Main>
      <LoginContainer>
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Sign Up</h1>
          <p>모든 항목은 필수입니다.</p>
          <InputForm
            target="email"
            label="이메일"
            type="email"
            handleInputValue={(target) => (e) => {
              onChangeEmail(e);
            }}
          ></InputForm>
          {email.length > 0 && <span className="alert">{emailMessage}</span>}
          <InputForm
            target="userId"
            label="아이디"
            handleInputValue={(target) => (e) => {
              onChangeUserId(e);
            }}
          ></InputForm>
          {userId.length > 0 && <span className="alert">{userIdMessage}</span>}
          <InputForm
            target="password"
            label="패스워드"
            type="password"
            handleInputValue={(target) => (e) => {
              onChangePassword(e);
            }}
          ></InputForm>
          {password.length > 0 && <span className="alert">{passwordMessage}</span>}
          <InputForm
            target="passwordConfirmation"
            label="패스워드 확인"
            type="password"
            handleInputValue={(target) => (e) => {
              onChangePasswordConfirm(e);
            }}
          ></InputForm>
          {passwordConfirm.length > 0 && (
            <span className="alert">{passwordConfirmMessage}</span>
          )}
          <TextButton
            color="secondary"
            isTransparent={false}
            width="full"
            onClick={() =>
              !(isEmail && isUserId && isPassword && isPasswordConfirm)
                ? setErrorMessage('채우지 않았거나 유효하지 않은 입력이 있어요')
                : handleSignup()
            }
          >
            회원가입
          </TextButton>
          {errorMessage ? <AlertBox>{errorMessage}</AlertBox> : ''}
          <Link to="/login">
            <LinkSpan>로그인하러 가기</LinkSpan>
          </Link>
          <Modal
            isOpen={isOpen}
            openModalHandler={openModalHandler}
            modalActionlHandler={openModalHandler}
            noticeMessage={'회원가입이 완료되었습니다!'}
            buttonMessage={'login'}
            endPoint={'/login'}
          />
        </form>
      </LoginContainer>
    </Main>
  );
}
