import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Home from './pages/Home';
import Search from './pages/Search';
import Drama from './pages/Drama';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Comments from './pages/Comments';
import MyPagePersonal from './pages/MyPagePersonal';
import MyPageActivities from './pages/MyPageActivities';
import MyPageNotifications from './pages/MyPageNotifications';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [tokenState, setTokenState] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setTokenState(sessionStorage.getItem('token'));
  }, []);

  const isAuthenticated = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/auth`, {
        headers: {
          'Content-Type': `application/json`,
          authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        withCredentials: true,
      })

      .then((res) => {
        setTokenState(sessionStorage.getItem('token'));
        setIsLogin(true);
        setUserInfo(res.data.data.userInfo);
        if (location.pathname === '/login') {
          // useLocation으로 로그인 할때만 변경
          navigate('/');
        }
      })
      .catch();
  };

  const handleResponseSuccess = (data) => {
    sessionStorage.setItem('token', data.accessToken);
    setTokenState(data.accessToken);
    // isAuthenticated();
  };

  const handleLogout = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/logout`, {
        headers: {
          'Content-Type': `application/json`,
          authorization: tokenState,
        },
        withCredentials: true,
      })
      .then((res) => {
        setUserInfo(null);
        setIsLogin(false);
        setTokenState(null);
        sessionStorage.removeItem('token');
        // navigate('/');
      });
  };

  useEffect(() => {
    isAuthenticated();
  }, [tokenState]);

  return (
    <>
      <Navbar isLogin={isLogin} handleLogout={handleLogout} />
      <Routes>
        <Route
          exact
          path="/login"
          element={<Login handleResponseSuccess={handleResponseSuccess} />}
        />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/mypage/personal-information"
          element={<MyPagePersonal tokenState={tokenState} handleLogout={handleLogout} />}
        />
        <Route
          path="/mypage/my-activities"
          element={<MyPageActivities tokenState={tokenState} />}
        />
        <Route
          path="/mypage/notifications"
          element={<MyPageNotifications tokenState={tokenState} />}
        />
        <Route path="/drama/:id" element={<Drama />} />
        <Route
          path="/drama/:id/comments/season/:season/episode/:episode"
          element={<Comments tokenState={tokenState} userInfo={userInfo} />}
        />
      </Routes>
    </>
  );
}

export default App;
