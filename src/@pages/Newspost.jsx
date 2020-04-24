import React from 'react';
import { useParams, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';

import * as GraphqlService from '@services/graphql-service';
import { WithNewThemeLayout } from '@style';
import { Spinner } from '@components/Spinner';
import { Markdown } from '@components/Markdown';

const Container = styled.div``;

const PostedOn = ({ date }) => {
    const dateString = new Date(date);
    const formatted = format(dateString, 'MMMM do yyyy');
    return <div>Posted on : {formatted}</div>;
};

const Title = styled.h1``;

const Content = styled(Markdown)`
    margin-top: 12px;
`;

const OwnerStyled = styled.div``;

const Owner = ({ owner }) => {
    return (
        <OwnerStyled>
            {owner.firstName} {owner.lastName}
        </OwnerStyled>
    );
};

const NewspostPage = ({ newspost }) => {
    return (
        <Container>
            <Title>{newspost.title}</Title>
            <Owner owner={newspost.owner} />
            <PostedOn date={newspost.created} />
            <Content>{newspost.content}</Content>
        </Container>
    );
};

const Page = () => {
    const { id } = useParams();

    const graphqlService = GraphqlService.getInstance();
    const { loading, error, newspost } = graphqlService.useNewspostById(id);

    if (loading) {
        return <Spinner />;
    } else if (!newspost) {
        return <Redirect to="/not-found" />;
    } else if (error) {
        return <div>Error loading newspost</div>;
    }

    return <NewspostPage newspost={newspost} />;
};

export const Newspost = WithNewThemeLayout(Page);
