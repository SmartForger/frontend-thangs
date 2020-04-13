import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as UploadIcon } from '@svg/upload-icon.svg';
import { UploadFrame } from '@components/UploadFrame';

const UploadIconStyled = styled(UploadIcon)`
    margin-bottom: 32px;
`;

const LinkColor = styled.span`
    color: ${props => props.theme.linkText};
    cursor: pointer;
`;

const MODEL_FILE_EXTS = [
    '.3dxml', // THREE_D_XML
    '.asab', // ACIS_Assembly_Binary
    '.asat', // ACIS_Assembly
    '.CATPart', // CATIAV5
    '.CATProduct', // CATIAV5_Assembly
    '.dwg',
    '.dxf',
    '.iges',
    '.igs',
    '.ipt', // Inventor
    '.jt',
    '.model', // CATIAV4
    '.par', // SolidEdge
    '.prt', // NX, ProE_Creo
    '.sab', // ACIS_Binary
    '.sat', // ACIS
    '.sldasm', // SolidWorks_Assembly
    '.sldprt', // SolidWorks
    '.step',
    '.stl',
    '.stp',
    '.vda',
    '.x_b', // ParaSolid_Binary
    '.x_t', // ParaSolid
    '.xcgm',
    '.xml', // XMLEBOM
];

export function Uploader({ file, setFile }) {
    const onDrop = useCallback(
        acceptedFiles => {
            setFile(acceptedFiles[0]);
        },
        [setFile]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: MODEL_FILE_EXTS,
    });

    return (
        <div {...getRootProps()}>
            <input {...getInputProps({ multiple: false })} />
            <UploadFrame dragactive={isDragActive}>
                {file ? (
                    <div>File: {file.name}</div>
                ) : (
                    <>
                        <UploadIconStyled />
                        <div>Drag & Drop model</div>
                        <div>
                            or <LinkColor>browse</LinkColor> to choose file
                        </div>
                    </>
                )}
            </UploadFrame>
        </div>
    );
}
