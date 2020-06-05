import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { TextButton } from '../Button';
import { WHITE_1, GREY_14 } from '../../@style/colors';
import { boldText } from '../../@style/text';
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
    margin-top: 8px;
    z-index: 2;
`;

const Item = styled(Link)`
    ${boldText};
    line-height: 32px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;

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
            <Item to={to} onClick={onClick} as={onClick && 'div'}>
                {children}
            </Item>
        </div>
    );
}

export function DropdownMenu({
    children,
    className,
    noIcons,
    buttonIcon: ButtonIcon = DotStackIcon,
    isOpen: isOpenExternal = undefined,
}) {
    const [isOpenInternal, toggleOpen] = useDropdownMenuState(isOpenExternal);
    const isOpen =
        isOpenExternal === undefined ? isOpenInternal : isOpenExternal;

    return (
        <Container className={className}>
            <TextButton
                onClick={toggleOpen}
                css={`
                    display: flex;
                    align-items: center;
                `}
            >
                <ButtonIcon />
            </TextButton>
            {isOpen && <Menu noIcons={noIcons}>{children}</Menu>}
        </Container>
    );
}

function useDropdownMenuState(initialIsOpen = false) {
    const [isOpen, setIsOpen] = useState(initialIsOpen);
    const toggleOpen = e => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('click', closeMenu);
        }
        return () => {
            if (isOpen) {
                document.removeEventListener('click', closeMenu);
            }
        };
    }, [isOpen]);
    return [isOpen, toggleOpen];
}
