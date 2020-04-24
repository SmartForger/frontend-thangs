import { createGlobalStyle } from 'styled-components';
import { BLACK_1, BLUE_2 } from './colors';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lexend+Deca&family=Montserrat:wght@300;400;500;600;700&display=swap');

  body {
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    background: ${props => props.theme.backgroundColor};
    font-family: ${props => props.theme.buttonFont};
    font-size: 14px;
    color: ${BLACK_1}
  }

  a {
    text-decoration: none;
    color: ${BLUE_2};
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: inherit;
  }

  input, button {
    font-size: inherit;
    font-family: inherit;
  }
`;
