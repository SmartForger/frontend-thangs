import React, { useState } from 'react';
import styled from 'styled-components';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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

export function ChangeablePicture() {
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30 });
    const [croppedImgUrl, setCroppedImgUrl] = useState(null);

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setSrc(reader.result);
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
            {src && (
                <ReactCrop
                    src={src}
                    crop={crop}
                    onImageLoaded={onImageLoaded}
                    onComplete={onCropComplete}
                    onChange={onCropChange}
                    circularCrop={true}
                />
            )}
        </form>
    );
}
