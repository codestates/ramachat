import Tabbar from '../components/Tabbar';
import axios from 'axios';
import styled from 'styled-components';
import ActivityComment from '../components/ActivityComment';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';
import { useState, useEffect } from 'react';

axios.defaults.withCredentials = true;

const Section = styled.section`
  margin-left: 60px;
  width: 100%;
  height: calc(100vh - 80px);
  @media ${device.tablet} {
    margin-left: 240px;
  }
`;

const Main = styled.main`
  width: 100%;
  overflow-y: scroll;
  max-width: 850px;
  margin: 0 auto;
  display: flex;
  position: relative;
  @media ${device.tablet} {
    border-right: 1px solid ${colors.primary};
  }
`;

const CommentsList = styled.ul`
  padding: 0;
  margin-bottom: 100px;

  h1 {
    padding-left: 1rem;
  }

  @media ${device.tablet} {
    margin-bottom: 2rem;
  }
`;

export default function MyPageActivities({ tokenState }) {
  const token = tokenState ? tokenState : sessionStorage.getItem('token');
  const [myComments, setMyComments] = useState({});
  const commentsArray = myComments ? Object.values(myComments) : undefined;

  const getMyComment = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/activity`, {
        headers: {
          'Content-Type': `application/json`,
          authorization: 'Bearer ' + token,
        },
        withCredentials: true,
      })
      .then((data) => {
        setMyComments(data.data.data.reverse());
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getMyComment();
  }, []);

  return (
    <>
      <Main>
        <Tabbar></Tabbar>
        <Section>
          <CommentsList>
            <h1>My Comments</h1>
            {commentsArray.map((comment) => (
              <ActivityComment
                tokenState={tokenState}
                comment={comment}
                userId={comment.userId}
              />
            ))}
          </CommentsList>
        </Section>
      </Main>
    </>
  );
}
