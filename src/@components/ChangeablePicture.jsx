import React, { useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from 'react-modal';
import md5 from 'md5';

import { Button } from '@components';
import { ProfilePicture } from '@components/ProfilePicture';
import * as GraphqlService from '@services/graphql-service';

Modal.setAppElement('#root');

const graphqlService = GraphqlService.getInstance();

const HiddenInput = styled.input`
    position: absolute;
    left: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
`;

const ClickablePicture = styled(ProfilePicture)`
    cursor: pointer;
`;

const ModalStyled = styled(Modal)`
    position: fixed;
    border: 1px solid rgb(204, 204, 204);
    background: rgb(255, 255, 255);
    overflow: auto;
    border-radius: 4px;
    outline: none;
    padding: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const ModalOverlayStyles = createGlobalStyle`
    .img-cropper-modal-overlay {
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-color: rgba(0, 0, 0, 0.75);
        z-index: 1;
    }
    .ReactCrop__image {
        max-height: 80vh;
        max-width: 80vw;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 8px;
`;

const initialCrop = { unit: '%', width: 30, aspect: 1 / 1 };

const ChangeablePicture = ({ user }) => {
    const [cropSrc, setCropSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [croppedImg, setCroppedImg] = useState(null);
    const [img, setImg] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const imageEl = useRef(null);
    const [uploadAvatar] = graphqlService.useUploadUserAvatarMutation(
        user,
        croppedImg,
    );

    const submitCrop = () => {
        uploadAvatar();
        setIsCropping(false);
    };

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setCropSrc(reader.result);
                setIsCropping(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const onImageLoaded = img => {
        setCrop(initialCrop);
        setImg(img);
        return false;
    };

    const onCropComplete = async crop => {
        await makeClientCrop(crop);
    };

    const onCropChange = crop => setCrop(crop);

    async function makeClientCrop(crop) {
        if (img && crop.width && crop.height) {
            const croppedImg = await getCroppedImage(
                img,
                crop,
                md5(imageEl.current.files[0].name),
            );
            setCroppedImg(croppedImg);
        }
    }

    const getCroppedImage = (image, crop, fileName) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = fileName;
                resolve(blob);
            });
        }, 'image/jpeg');
    };

    return (
        <form>
            <label htmlFor="avatar">
                <ClickablePicture user={user} />
            </label>
            <HiddenInput
                type="file"
                name="Change Image"
                id="avatar"
                onChange={onSelectFile}
                accept="image/x-png,image/jpeg"
                ref={imageEl}
            />
            <ModalOverlayStyles />
            <ModalStyled
                isOpen={isCropping}
                overlayClassName="img-cropper-modal-overlay"
            >
                <ReactCrop
                    src={cropSrc}
                    crop={crop}
                    onImageLoaded={onImageLoaded}
                    onComplete={onCropComplete}
                    onChange={onCropChange}
                    circularCrop={true}
                />
                <ButtonContainer>
                    <Button onClick={submitCrop} name="Save" />
                </ButtonContainer>
            </ModalStyled>
        </form>
    );
};

const allowCssProp = props => (props.css ? props.css : '');

const Form = styled.form`
    position: relative;

    ${allowCssProp};
`;

const NewButton = styled.button`
    color: ${props => props.theme.primaryButtonText};
    background-color: ${props => props.theme.primaryButton};
    font-size: 14px;
    padding: 8px 36px;
    border: none;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    font-weight: bold;
    cursor: pointer;

    ${props => props.theme.shadow};
    ${allowCssProp};
`;

const NewCancelButton = styled.button`
    color: ${props => props.theme.primaryButtonText};
    background-color: ${props => props.theme.deleteButton};
    font-size: 14px;
    padding: 8px 36px;
    border: none;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    font-weight: bold;
    cursor: pointer;

    ${props => props.theme.shadow};
    ${allowCssProp};
`;

function NewChangePicture({ user, button, buttonRef, css }) {
    const [cropSrc, setCropSrc] = useState(null);
    const [crop, setCrop] = useState();
    const [croppedImg, setCroppedImg] = useState(null);
    const [img, setImg] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const imageEl = useRef(null);
    const formRef = useRef(null);
    const [uploadAvatar] = graphqlService.useUploadUserAvatarMutation(
        user,
        croppedImg,
    );

    const submitCrop = () => {
        uploadAvatar();
        setIsCropping(false);
    };

    const cancel = () => {
        formRef.current.reset();
        setIsCropping(false);
    };

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setCropSrc(reader.result);
                setIsCropping(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const onImageLoaded = img => {
        setCrop(initialCrop);
        setImg(img);
        return false;
    };

    const onCropComplete = async crop => {
        await makeClientCrop(crop);
    };

    const onCropChange = crop => setCrop(crop);

    async function makeClientCrop(crop) {
        if (img && crop.width && crop.height) {
            const croppedImg = await getCroppedImage(
                img,
                crop,
                md5(imageEl.current.files[0].name),
            );
            setCroppedImg(croppedImg);
        }
    }

    const getCroppedImage = (image, crop, fileName) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = fileName;
                resolve(blob);
            });
        }, 'image/jpeg');
    };

    const onButtonClick = e => {
        buttonRef.current.focus();
        e.persist();
    };

    return (
        <Form css={css} ref={formRef}>
            <label htmlFor="avatar">{button}</label>
            <HiddenInput
                type="file"
                name="Change Image"
                id="avatar"
                onChange={onSelectFile}
                onClick={onButtonClick}
                accept="image/x-png,image/jpeg"
                ref={imageEl}
            />
            <ModalOverlayStyles />
            <ModalStyled
                isOpen={isCropping}
                overlayClassName="img-cropper-modal-overlay"
            >
                <ReactCrop
                    src={cropSrc}
                    crop={crop}
                    onImageLoaded={onImageLoaded}
                    onComplete={onCropComplete}
                    onChange={onCropChange}
                    circularCrop={true}
                />
                <ButtonContainer>
                    <NewButton
                        onClick={submitCrop}
                        css={`
                            margin-right: 8px;
                        `}
                    >
                        Save
                    </NewButton>
                    <NewCancelButton onClick={cancel}>Cancel</NewCancelButton>
                </ButtonContainer>
            </ModalStyled>
        </Form>
    );
}

export { ChangeablePicture, NewChangePicture };
