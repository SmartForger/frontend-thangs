import React from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as UploadIcon } from '@svg/upload-icon.svg';
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg';
import { ReactComponent as ModelPyramid } from '@svg/model-pyramid.svg';
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg';
import { UploadFrame } from '@components/UploadFrame';
import { TextButton } from '@components/Button';
import { infoMessageText, smallInfoMessageText, linkText } from '@style/text';
import { GREY_3, WHITE_3 } from '@style/colors';

const ErrorIconStyled = styled(ErrorIcon)`
    color: ${GREY_3};
`;

const UploadIconStyled = styled(UploadIcon)`
    margin-bottom: 32px;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const LinkColor = styled.span`
    ${linkText};
`;

const IconButton = styled(TextButton)`
    position: absolute;
    right: 32px;
    top: 32px;
    svg {
        fill: ${WHITE_3};
        stroke: ${WHITE_3};
        height: 48px;
        width: 48px;
    }
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

const FILE_SIZE_LIMITS = {
    hard: {
        size: 250_000_000,
        pretty: '250MB',
    },
    soft: {
        size: 50_000_000,
        pretty: '50MB',
    },
};

const SmallInfoMessage = styled.div`
    ${smallInfoMessageText};
    margin-top: 32px
    text-align: center;
    max-width: 400px;
`;

const InfoMessage = styled(SmallInfoMessage)`
    ${infoMessageText};
`;

export function Uploader({ file, setFile, showError = true }) {
    const [errorState, setErrorState] = React.useState();
    const onDrop = React.useCallback(
        (acceptedFiles, rejectedFiles, event) => {
            const file = acceptedFiles[0];
            if (rejectedFiles[0]) {
                setErrorState('FILE_EXT');
                setFile(null);
            } else if (file.size >= FILE_SIZE_LIMITS.hard.size) {
                setErrorState('TOO_BIG');
                setFile(null);
            } else if (file.size >= FILE_SIZE_LIMITS.soft.size) {
                setErrorState('SIZE_WARNING');
                setFile(file);
            } else {
                setErrorState(null);
                setFile(file);
            }
        },
        [setFile]
    );

    const preventClickingWhileFull = e => {
        if (file) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const cancelUpload = e => {
        e.preventDefault();
        e.stopPropagation();
        setErrorState(null);
        setFile(null);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: MODEL_FILE_EXTS,
    });

    const handleBrowseClick = e => {
        e.preventDefault();
    };

    return (
        <div {...getRootProps({ onClick: preventClickingWhileFull })}>
            <input {...getInputProps({ multiple: false })} />
            <UploadFrame dragactive={isDragActive} currentFile={file}>
                {showError ? (
                    <FlexColumn>
                        <IconButton onClick={cancelUpload}>
                            <ErrorIconStyled />
                        </IconButton>

                        <InfoMessage>
                            Sorry, an unexpected error occurred. Please wait a
                            moment and try to save the model again.
                        </InfoMessage>
                    </FlexColumn>
                ) : file ? (
                    <FlexColumn>
                        <IconButton onClick={cancelUpload}>
                            <ExitIcon />
                        </IconButton>
                        <ModelPyramid />
                        <InfoMessage>
                            <strong>File:</strong> {file.name}
                        </InfoMessage>
                        {errorState === 'SIZE_WARNING' && (
                            <InfoMessage>
                                Notice: Files over{' '}
                                {FILE_SIZE_LIMITS.soft.pretty} may take a long
                                time to upload & process.
                            </InfoMessage>
                        )}
                    </FlexColumn>
                ) : errorState === 'TOO_BIG' ? (
                    <FlexColumn>
                        <IconButton onClick={cancelUpload}>
                            <ExitIcon />
                        </IconButton>
                        <ErrorIconStyled />
                        <InfoMessage>
                            File over {FILE_SIZE_LIMITS.hard.pretty}. Try{' '}
                            uploading a different file.
                        </InfoMessage>
                    </FlexColumn>
                ) : errorState === 'FILE_EXT' ? (
                    <FlexColumn>
                        <ErrorIconStyled />
                        <InfoMessage>
                            File extension not supported. Supported{' '}
                            file extensions include {MODEL_FILE_EXTS.map(e => e + ' ')}.
                        </InfoMessage>
                    </FlexColumn>
                ) : (
                    <FlexColumn>
                        <UploadIconStyled />
                        <InfoMessage>
                            Drag & Drop model
                            <br />
                            or{' '}
                            <TextButton onClick={handleBrowseClick}>
                                <LinkColor>browse</LinkColor>
                            </TextButton>{' '}
                            to choose file
                        </InfoMessage>
                    </FlexColumn>
                )}
                <SmallInfoMessage>
                    Files can be up to {FILE_SIZE_LIMITS.hard.pretty} each.
                    Files above {FILE_SIZE_LIMITS.soft.pretty} may take longer
                    to upload and process.
                </SmallInfoMessage>
            </UploadFrame>
        </div>
    );
}
