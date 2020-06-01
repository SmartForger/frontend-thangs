import React from 'react';
import styled from 'styled-components/macro';
import { ReactComponent as FolderIcon } from '../../@svg/folder-icon.svg';
import { BLUE_2 } from '../../@style/colors';
import { smallHeaderText, breadcrumbTextLight } from '../../@style/text';

const FolderIconStyled = styled(FolderIcon)`
    fill: ${BLUE_2};
    margin-right: 16px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
`;

export function Breadcrumbs({ modelsCount, folder }) {
    return (
        <Row>
            <Row
                css={`
                    ${breadcrumbTextLight};
                    ::after {
                        content: '>';
                        margin-left: 16px;
                        margin-right: 24px;
                    }
                `}
            >
                <div>All Models</div>{' '}
                <div
                    css={`
                        margin-left: 4px;
                    `}
                >
                    {modelsCount}
                </div>
            </Row>
            <Row
                css={`
                    ${smallHeaderText};
                `}
            >
                <FolderIconStyled />
                <div>{folder.name}</div>
            </Row>
        </Row>
    );
}
