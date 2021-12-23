import styled from 'styled-components';
import { colors } from '../styles/Colors';
import { device } from '../styles/Breakpoints';

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;

  label {
    display: inline-block;
    text-align: left;
  }

  input {
    margin-top: 0.5rem;
    width: 100%;
    height: 40px;
    padding: 10px;
    border-radius: 0;
    border: 2px solid ${colors.primary};
    font-size: 1rem;
  }
`;

export default function InputForm({ label, target, handleInputValue, type = 'text' }) {
  return (
    <InputField>
      <label>{label}</label>
      <input
        name={label}
        type={type}
        placeholder={label}
        onChange={handleInputValue(target)}
      />
    </InputField>
  );
}
