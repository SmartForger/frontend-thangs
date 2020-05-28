import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { ReactComponent as FolderIcon } from '../../@svg/folder-icon.svg';
import { regularText, cardSubtext } from '../../@style/text';
import { ModelThumbnail } from '../ModelThumbnail';
import { Card } from '../Card';
import { BLUE_2, GREY_13 } from '../../@style/colors';

const Grid = styled.div`
    display: grid;
    height: 100%;
    min-height: 270px;
    grid-template-areas:
        'info info'
        'model-one model-two';
    grid-template-rows: 50% 50%;
    grid-gap: 4px;
`;

const Row = styled.div`
    display: flex;
`;
const Background = styled.div`
    ${regularText};
    padding: 16px;
`;

const Subtext = styled.div`
    ${cardSubtext};
    display: flex;
    > div + div {
        margin-left: 4px;
    }
`;

const FolderIconStyled = styled(FolderIcon)`
    fill: ${BLUE_2};
    margin-right: 16px;
    margin-top: 4px;
`;

function FolderInfo({ name, members, models }) {
    return (
        <Background>
            <Row>
                <FolderIconStyled />
                <div>
                    <div>{name}</div>
                    <Subtext>
                        <div>
                            {models.length} Model{models.length !== 1 && 's'}
                        </div>
                        <div>
                            {members.length} Team Member
                            {members.length !== 1 && 's'}
                        </div>
                    </Subtext>
                </div>
            </Row>
        </Background>
    );
}

const CardStyled = styled(Card)``;

function Placeholder() {
    return (
        <CardStyled
            css={`
                background-color: ${GREY_13};
            `}
        />
    );
}

function PossiblyEmptyModelCard({ model, className }) {
    return model ? (
        <CardStyled className={className}>
            <ModelThumbnail
                {...model}
                css={`
                    max-width: 160px;
                    margin: auto;
                    img {
                        max-width: inherit;
                    }
                `}
            />
        </CardStyled>
    ) : (
        <Placeholder className={className} />
    );
}

function CardContents({ className, folder }) {
    const [model1, model2] = folder.models;
    return (
        <Grid className={className}>
            <CardStyled
                css={`
                    grid-area: info;
                    border-radius: 8px 8px 0 0;
                `}
            >
                <FolderInfo
                    name={folder.name}
                    members={folder.members}
                    models={folder.models}
                />
            </CardStyled>
            <PossiblyEmptyModelCard
                css={`
                    grid-area: model-one;
                `}
                model={model1}
            />
            <PossiblyEmptyModelCard
                css={`
                    grid-area: model-two;
                `}
                model={model2}
            />
        </Grid>
    );
}

function FolderCard({ className, folder }) {
    return (
        <Link to={`/folder/${folder.id}`}>
            <CardContents folder={folder} />
        </Link>
    );
}

export { FolderCard };
