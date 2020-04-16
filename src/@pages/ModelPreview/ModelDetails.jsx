import React from 'react';
import * as R from 'ramda';

const title = R.replace(/(^|\s)\S/g, R.toUpper);
const titleCase = R.pipe(
    R.toLower,
    title
);

export function ModelDetails({ model }) {
    const category = model.category && titleCase(model.category);
    return (
        <table>
            <tbody>
                <AttrRow name="Material" value={model.material} />
                <AttrRow name="Weight" value={model.weight} />
                <AttrRow name="Height" value={model.height} />
                <AttrRow name="Category" value={category} />
            </tbody>
        </table>
    );
}

function AttrRow({ name, value }) {
    if (value == null || name == null) {
        return null;
    }

    return (
        <tr>
            <td>{name}</td>
            <td>{value}</td>
        </tr>
    );
}
