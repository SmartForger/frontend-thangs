import React from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as FolderIcon } from '../../@svg/folder-icon.svg';
import { smallHeaderText, regularText, cardSubtext } from '../../@style/text';
import { BLUE_2 } from '../../@style/colors';

const Background = styled.div`
    ${regularText};
    padding: 16px;
`;

const Row = styled.div`
    display: flex;
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

const Name = styled.div`
    ${props => props.bold && smallHeaderText};
`;

export function FolderInfo({
    name,
    members = [],
    models = [],
    boldName,
    hideModels,
    className,
}) {
    return (
        <Background className={className}>
            <Row>
                <FolderIconStyled />
                <div>
                    <Name bold={boldName}>{name}</Name>
                    <Subtext>
                        {!hideModels && (
                            <div>
                                {models.length} Model
                                {models.length !== 1 && 's'}
                            </div>
                        )}
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
