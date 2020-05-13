import styled from 'styled-components';

export const Card = styled.div`
    display: flex;
    flex-direction: column;

    background: ${props => props.theme.cardBackground};
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    height: 100%;
`;
