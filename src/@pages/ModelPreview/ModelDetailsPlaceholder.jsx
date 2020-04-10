import React from 'react';

export function ModelDetails({ model }) {
    return (
        <table>
            <tbody>
                <AttrRow name="Material" value={model.attachment.material} />
                <AttrRow name="Height" value={model.attachment.height} />
                <AttrRow name="Length" value={model.attachment.length} />
                <AttrRow name="Width" value={model.attachment.width} />
                <AttrRow name="Weight" value={model.attachment.weight} />
                <AttrRow
                    name="ANSI"
                    value={
                        model.attachment.ansi == null
                            ? null
                            : model.attachment.ansi
                            ? 'Compliant'
                            : 'Not compliant'
                    }
                />
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
