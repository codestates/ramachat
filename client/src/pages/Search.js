import SearchBar from '../components/SearchBar';
import DramaListItem from '../components/DramaListItem';
import { device } from '../styles/Breakpoints';
import { getDramas } from '../api/DramaDataAPI';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Main = styled.main`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  @media ${device.laptop} {
    max-width: 850px;
  }
`;

const SearchBarContainer = styled.div`
  margin: 1rem 0;
  width: 100%;
`;

const DramaList = styled.ul`
  width: 100%;
  list-style: none;
  display: grid;
  padding: 0;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media ${device.tablet} {
    grid-template-columns: repeat(4, 1fr);
  }

  @media ${device.laptop} {
    grid-template-columns: repeat(6, 1fr);
  }
`;

export default function Search() {
  const [dramas, setDramas] = useState([]);
  const keyword = new URLSearchParams(useLocation().search).get('query');
  const [message, setMessage] = useState('검색중...');

  useEffect(() => {
    setDramas([]);
    const sendAPICall = async () => {
      const data = await getDramas(keyword);
      setDramas(data);
      if (data.length === 0) {
        setMessage('검색 결과가 없습니다 :(');
      }
    };
    sendAPICall();
  }, [keyword]);

  return (
    <Main>
      <SearchBarContainer>
        <SearchBar />
      </SearchBarContainer>
      {dramas.length === 0 ? (
        <p>{message}</p>
      ) : (
        <DramaList>
          {dramas.map((drama) => (
            <DramaListItem
              id={drama.id}
              name={drama.name}
              poster_path={drama.poster_path}
              key={drama.id}
            />
          ))}
        </DramaList>
      )}
    </Main>
  );
}
