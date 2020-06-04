import React from 'react';
import styled from 'styled-components/macro';
import { action } from '@storybook/addon-actions';
import { DropdownMenu, DropdownItem } from './';
import { ReactComponent as UploadModelToFolderIcon } from '../../@svg/upload-model-to-folder-icon.svg';
import { ReactComponent as NewFolderIcon } from '../../@svg/folder-plus-icon.svg';
import { ReactComponent as TrashCanIcon } from '../../@svg/trash-can-icon.svg';
import { ReactComponent as ModelSquareIcon } from '../../@svg/model-square-icon.svg';

const ModelSquareIconStyled = styled(ModelSquareIcon)`
    margin-left: -3px;
    margin-right: 11px !important;
`;

export default {
    title: 'DropdownMenu',
    component: DropdownMenu,
};

export function WithOnlyTextUncontrolled() {
    return (
        <div>
            <DropdownMenu
                noIcons
                css={`
                    margin: auto;
                `}
            >
                <DropdownItem to="/">Invite users</DropdownItem>
                <DropdownItem to="/">Edit Profile</DropdownItem>
                <DropdownItem to="/">Liked Models</DropdownItem>
            </DropdownMenu>
        </div>
    );
}

export function WithOnlyTextControlledOpen() {
    return (
        <div>
            <DropdownMenu
                noIcons
                css={`
                    margin: auto;
                `}
                isOpen={true}
            >
                <DropdownItem to="/">Invite users</DropdownItem>
                <DropdownItem to="/">Edit Profile</DropdownItem>
                <DropdownItem to="/">Liked Models</DropdownItem>
            </DropdownMenu>
        </div>
    );
}

export function WithIconsUncontrolled() {
    return (
        <div>
            <DropdownMenu
                css={`
                    margin: auto;
                `}
            >
                <DropdownItem onClick={action('deleted folder')}>
                    <TrashCanIcon />
                    <span>Delete Folder</span>
                </DropdownItem>
                <DropdownItem to="/">
                    <UploadModelToFolderIcon />
                    <span>Upload Model to Folder</span>
                </DropdownItem>
                <DropdownItem to="/">
                    <ModelSquareIconStyled />
                    <span>Upload Model</span>
                </DropdownItem>
                <DropdownItem to="/">
                    <NewFolderIcon />
                    <span>Add Folder</span>
                </DropdownItem>
            </DropdownMenu>
        </div>
    );
}

export function WithIconsControlledOpen() {
    return (
        <div>
            <DropdownMenu
                css={`
                    margin: auto;
                `}
                isOpen={true}
            >
                <DropdownItem onClick={action('deleted folder')}>
                    <TrashCanIcon />
                    <span>Delete Folder</span>
                </DropdownItem>
                <DropdownItem to="/">
                    <UploadModelToFolderIcon />
                    <span>Upload Model to Folder</span>
                </DropdownItem>
                <DropdownItem to="/">
                    <ModelSquareIconStyled />
                    <span>Upload Model</span>
                </DropdownItem>
                <DropdownItem to="/">
                    <NewFolderIcon />
                    <span>Add Folder</span>
                </DropdownItem>
            </DropdownMenu>
        </div>
    );
}
