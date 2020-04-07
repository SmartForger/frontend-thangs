import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SlidesContainerStyle = styled.div`
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: 12px;
`;

const LinkBox = styled(Link)`
    width: 100%;
    text-decoration: none;
    color: inherit;
    margin-bottom: 12px;
    display: flex;
`;

const SlideIconStyle = styled.img`
    border-radius: ${props => (props.rounded ? 50 : 0)}%;
    box-shadow: inset 0 0 0 2px
        ${props => (props.rounded ? props.theme.darkgrey : 'black')};
    width: 75px;
    height: 75px;
    margin-right: 12px;
`;

const SlideTitleStyle = styled.div`
    font-weight: 600;
    font-size: 1.5rem;
    align-self: end;
`;

const SlideownerStyle = styled.div`
    font-weight: 100;
    font-size: 0.75rem;
`;

const SlidesFooterStyle = styled.div``;

const Slide = props => {
    const { title, owner, icon, rounded, text, prefix, route } = props;

    return (
        <LinkBox text={text} to={route}>
            {text ? null : (
                <SlideIconStyle src={icon} rounded={rounded} alt="" />
            )}
            <div>
                <SlideTitleStyle>{title}</SlideTitleStyle>
                <SlideownerStyle>
                    {prefix} <span style={{ fontWeight: '900' }}>{owner}</span>
                </SlideownerStyle>
            </div>
        </LinkBox>
    );
};

const Slides = props => {
    const { data, footerContent, rounded, text, prefix } = props;

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
