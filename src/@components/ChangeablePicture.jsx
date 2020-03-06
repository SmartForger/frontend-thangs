import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from 'react-modal';

const ProfilePicStyled = styled.div`
    background: grey;
    border-radius: 50%;
    height: 250px;
    width: 250px;
    cursor: pointer;
`;

const HiddenInput = styled.input`
    visibility: hidden;
    position: absolute;
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
    }
    .ReactCrop__image {
        max-height: 50vh;
        max-width: 50vw;
    }
`;

export function ChangeablePicture() {
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 / 1 });
    const [croppedImgUrl, setCroppedImgUrl] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setSrc(reader.result);
                setIsCropping(true);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    let imageRef = null;

    function onImageLoaded(image) {
        imageRef = image;
    }

    function onCropComplete(crop) {
        setCrop(crop);
    }

    function onCropChange(crop) {
        setCrop(crop);
    }

    async function makeClientCrop(crop) {
        if (imageRef && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImage(
                imageRef,
                crop,
                'newFile.jpeg',
            );
            setCroppedImgUrl(croppedImageUrl);
        }
    }

    function getCroppedImage(image, crop, fileName) {
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
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileurl);
            });
        }, 'image/jpeg');
    }

    return (
        <form>
            <label htmlFor="avatar">
                <ProfilePicStyled />
            </label>
            <HiddenInput
                type="file"
                name="Change Image"
                id="avatar"
                onChange={onSelectFile}
            />
            <ModalOverlayStyles />
            <ModalStyled
                isOpen={isCropping}
                overlayClassName="img-cropper-modal-overlay"
            >
                <ReactCrop
                    src={src}
                    crop={crop}
                    onImageLoaded={onImageLoaded}
                    onComplete={onCropComplete}
                    onChange={onCropChange}
                    circularCrop={true}
                />
            </ModalStyled>
        </form>
    );
}
