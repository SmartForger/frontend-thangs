import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Raleway');

  body {
    padding: 0;
    margin: 0;
    font-family: Raleway, sans-serif;
  }
`

export {GlobalStyle};