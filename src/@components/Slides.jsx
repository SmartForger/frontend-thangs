import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SlidesContainerStyle = styled.div`
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
`;

const LinkBox = styled(Link)`
    width: 100%;
    display: grid;
    text-decoration: none;
    color: inherit;
    grid-template-columns: ${props => (props.text ? '15% 85%' : '40% 60%')};
    grid-template-rows: 50% 50%;
    grid-template-areas:
        'icon title'
        'icon owner';
    margin-bottom: 12px;
`;

const SlideIconStyle = styled.img`
    border-radius: ${props => (props.rounded ? 50 : 0)}%;
    box-shadow: inset 0 0 0 2px
        ${props => (props.rounded ? props.theme.darkgrey : 'black')};
    grid-area: icon;
    justify-self: center;
    align-self: center;
    width: 75px;
    height: 75px;
`;

const SlideTitleStyle = styled.div`
    font-weight: 600;
    font-size: 1.5rem;
    grid-area: title;
    align-self: end;
`;

const SlideownerStyle = styled.div`
    font-weight: 100;
    font-size: 0.75rem;
    grid-area: owner;
`;

const SlidesFooterStyle = styled.div``;

const Slide = props => {
    const { title, owner, icon, rounded, text, prefix, route } = props;

    return (
        <LinkBox text={text} to={route}>
            {text ? null : (
                <SlideIconStyle src={icon} rounded={rounded} alt="" />
            )}
            <SlideTitleStyle>{title}</SlideTitleStyle>
            <SlideownerStyle>
                {prefix} <span style={{ fontWeight: '900' }}>{owner}</span>
            </SlideownerStyle>
        </LinkBox>
    );
};

const Slides = props => {
    const { data, footerContent, rounded, text, prefix } = props;
    const slideAmount = props.data.length || 3;

    return (
        <SlidesContainerStyle>
            {data
                ? data.map(i => (
                      <Slide
                          key={i.title}
                          title={i.title}
                          owner={i.owner}
                          icon={i.icon}
                          route={i.route || '#'}
                          text={text}
                          rounded={rounded}
                          prefix={prefix}
                      />
                  ))
                : null}
            <SlidesFooterStyle>{footerContent}</SlidesFooterStyle>
        </SlidesContainerStyle>
    );
};

export { Slides };
