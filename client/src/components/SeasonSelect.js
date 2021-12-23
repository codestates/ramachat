import styled from 'styled-components';
import { colors } from '../styles/Colors';

const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 10px;
  border-radius: 0;
  border: 2px solid ${colors.primary};
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, ${colors.primary} 50%),
    linear-gradient(135deg, ${colors.primary} 50%, transparent 50%);
  background-position: calc(100% - 20px) calc(1em + 2px),
    calc(100% - 15px) calc(1em + 2px), 100% 0;
  background-size: 5px 5px, 5px 5px, 2.5em 2.5em;
  background-repeat: no-repeat;
`;

export default function SeasonSelect({ seasons = [], setSeasonNumber }) {
  const handleChange = (event) => {
    setSeasonNumber(event.target.value);
  };
  if (seasons[0] && seasons[0].season_number == 0) {
    const special = seasons.shift();
    seasons.push(special);
  }
  return (
    <Select onChange={handleChange}>
      {seasons.map((season) => (
        <option value={season.season_number}>{season.name}</option>
      ))}
    </Select>
  );
}
