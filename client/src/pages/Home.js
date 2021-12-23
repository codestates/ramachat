import styled from 'styled-components';
import SearchBar from '../components/SearchBar';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';
import img from '../assets/ramachat-main.png';

const Main = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  padding: 1rem;

  @media ${device.tablet} {
    align-items: center;
  }

  h1.mobile {
    font-size: 10vw;
    @media ${device.tablet} {
      display: none;
    }
  }
  h1.tablet {
    display: none;
    font-size: 3rem;
    @media ${device.tablet} {
      display: inline-block;
    }
  }

  h1 {
    transform: translateY(100px);
    opacity: 0;
    animation: moveImg 0.8s 0.4s ease-in-out forwards;
  }

  span {
    color: ${colors.primary};
  }

  img {
    transform: translateY(100px);
    opacity: 0;
    width: 60%;
    max-width: 460px;
    animation: moveImg 0.8s 0.2s ease-in-out forwards;
  }

  @keyframes moveImg {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

const SearchBarContainer = styled.div`
  width: 100%;
  max-width: 400px;
  transform: translateY(100px);
  opacity: 0;
  animation: moveImg 0.8s 0.6s ease-in-out forwards;
  @keyframes moveImg {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

export default function Home() {
  return (
    <Main>
      <img src={img} />
      <h1 className="mobile">
        드<span>라마</span> 이야기는
        <br />
        <span>라마챗</span>에서!
      </h1>
      <h1 className="tablet">
        드<span>라마</span> 이야기는 <span>라마챗</span>에서!
      </h1>
      <SearchBarContainer>
        <SearchBar />
      </SearchBarContainer>
    </Main>
  );
}
