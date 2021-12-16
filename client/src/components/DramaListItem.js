import styled from 'styled-components';
import { colors } from '../styles/Colors';

const Item = styled.li`
  list-style: none;
  cursor: pointer;

  .poster {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 150%;
    background-color: ${colors.greyL};
    background-image: url(${(props) => props.poster});
    background-size: cover;
    background-position: center center;
  }

  .poster::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    opacity: 0;
  }

  &:hover {
    .poster::after {
      opacity: 0.25;
    }
    h3 {
      color: ${colors.primary};
    }
  }
`;

//www.themoviedb.org/t/p/w1280

export default function DramaListItem({ name, poster_path }) {
  console.log(poster_path);
  const url =
    poster_path === null
      ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/624px-No-Image-Placeholder.svg.png'
      : 'https://www.themoviedb.org/t/p/w1280' + poster_path;

  return (
    <Item poster={url}>
      {/* <img src={poster}></img> */}
      <div className="poster"></div>
      <h3>{name}</h3>
    </Item>
  );
}
