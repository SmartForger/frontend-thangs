import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { TextButton } from '../Button';
import { WHITE_1, BLACK_1, GREY_14 } from '../../@style/colors';
import { regularText } from '../../@style/text';
import { ReactComponent as DotStackIcon } from '../../@svg/dot-stack-icon.svg';

const Menu = styled.div`
    background: ${WHITE_1};
    border-radius: 0px 0px 8px 8px;
    box-shadow: 0px 5px 10px 0px rgba(35, 37, 48, 0.25);
    width: 260px;
    padding: ${props => (props.noIcons ? '24px 48px' : '24px')};
    box-sizing: border-box;
    position: absolute;
    right: 12px;
    top: 40px;
`;

const Item = styled(Link)`
    ${regularText};
    line-height: 32px;
    display: flex;
    align-items: center;

    svg {
        width: 26px;
        margin-right: 8px;
        color: ${GREY_14};
    }
`;

const Container = styled.div`
    position: relative;
    width: fit-content;
`;

export function DropdownItem({ children, to = '#', onClick }) {
    return (
        <div>
            <Item to={to} onClick={onClick}>
                {children}
            </Item>
        </div>
    );
}

export function DropdownMenu({ children, className, noIcons }) {
    const [isOpen, setIsOpen] = useState();
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <Container className={className}>
            <TextButton onClick={toggleOpen} onBlur={() => setIsOpen(false)}>
                <DotStackIcon />
            </TextButton>
            {isOpen && <Menu noIcons={noIcons}>{children}</Menu>}
        </Container>
    );
}
