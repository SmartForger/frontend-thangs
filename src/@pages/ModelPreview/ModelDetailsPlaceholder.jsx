import React from 'react';

export function ModelDetails({ model }) {
    return (
        <table>
            <tbody>
                <tr>
                    <td>Material</td>
                    <td>{model.attachment.material}</td>
                </tr>
                <tr>
                    <td>Height</td>
                    <td>{model.attachment.height}mm</td>
                </tr>
                <tr>
                    <td>Length</td>
                    <td>{model.attachment.length}mm</td>
                </tr>
                <tr>
                    <td>Width</td>
                    <td>{model.attachment.width}mm</td>
                </tr>
                <tr>
                    <td>Weight</td>
                    <td>{model.attachment.weight}g</td>
                </tr>
                <tr>
                    <td>ANSI</td>
                    <td>
                        {model.attachment.ansi ? 'Compliant' : 'Not compliant'}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
