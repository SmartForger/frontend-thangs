import React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { modelDetailsLabelText } from '@style/text';

const title = R.replace(/(^|\s)\S/g, R.toUpper);
const titleCase = R.pipe(
    R.toLower,
    title
);

const Table = styled.table`
    border-spacing: 8px 0;
    margin: 0 -8px;
`;

const Cell = styled.td`
    padding: 0;
    line-height: 18px;
    vertical-align: middle;
`;

const FirstCell = styled(Cell)`
    ${modelDetailsLabelText};
    height: 24px;
    text-transform: uppercase;
`;

const SecondCell = styled(Cell)`
    padding-bottom: 1px;
`;

const Row = styled.tr``;

export function ModelDetails({ model }) {
    const category = model.category && titleCase(model.category);
    return (
        <Table>
            <tbody>
                <AttrRow name="Material" value={model.material} />
                <AttrRow name="Weight" value={model.weight} />
                <AttrRow name="Height" value={model.height} />
                <AttrRow name="Category" value={category} />
            </tbody>
        </Table>
    );
}

function AttrRow({ name, value }) {
    if (!value || !name) {
        return null;
    }

    return (
        <Row>
            <FirstCell>{name}</FirstCell>
            <SecondCell>{value}</SecondCell>
        </Row>
    );
}
