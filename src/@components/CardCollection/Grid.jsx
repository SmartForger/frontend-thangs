import styled from 'styled-components/macro';

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(
        ${props => (props.singleRow ? 'auto-fill' : 'auto-fit')},
        ${props => (props.singleRow ? '344px' : 'minmax(344px, 1fr)')}
    );
    gap: 16px;
    width: 100%;
`;
