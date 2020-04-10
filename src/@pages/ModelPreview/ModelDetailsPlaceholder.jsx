import React from 'react';

export function ModelDetails({ model }) {
    const attachment = model.attachment || {};
    return (
        <table>
            <tbody>
                <AttrRow name="Material" value={attachment.material} />
                <AttrRow name="Height" value={attachment.height} />
                <AttrRow name="Length" value={attachment.length} />
                <AttrRow name="Width" value={attachment.width} />
                <AttrRow name="Weight" value={attachment.weight} />
                <AttrRow
                    name="ANSI"
                    value={
                        attachment.ansi == null
                            ? null
                            : attachment.ansi
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
