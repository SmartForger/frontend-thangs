import React from 'react';
import styled from 'styled-components/macro';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import Joi from '@hapi/joi';
import * as R from 'ramda';
import { Button, DarkButton } from '../Button';
import { ReactComponent as NewFolderIcon } from '../../@svg/folder-plus-icon.svg';
import { useCreateFolder } from '../../@customHooks/Folders';
import { headerText, lightText, formErrorText } from '../../@style/text';
import { WHITE_1, WHITE_4 } from '../../@style/colors';

Modal.setAppElement('#root');

const ModalStyled = styled(Modal)`
    position: fixed;
    padding: 40px 64px 64px;
    background: ${WHITE_1};
    overflow: auto;
    border-radius: 8px;
    outline: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    ${props => props.theme.shadow};
`;

const Header = styled.h2`
    ${headerText};
`;

const Text = styled.div`
    ${lightText};
`;

const Row = styled.div`
    display: flex;
`;

const FullWidthInput = styled.input`
    border: 0;
    padding: 8px 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    min-width: 0;
    background: ${WHITE_4};
`;

const validationSchema = Joi.object({
    name: Joi.string().required(),
    members: Joi.array()
        .items(Joi.string().email({ tlds: { allow: false } }))
        .min(1)
        .required(),
});

const parseEmails = R.pipe(R.split(/, */), R.filter(R.identity));

const validationResolver = data => {
    const { error, value: values } = validationSchema.validate({
        name: data.name,
        members: parseEmails(data.members),
    });
    return {
        values: error ? {} : values,
        errors: error
            ? error.details.reduce((previous, currentError) => {
                  return {
                      ...previous,
                      [currentError.path[0]]: currentError,
                  };
              }, {})
            : {},
    };
};

const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    margin-bottom: 8px;
`;

const ErrorTextStyle = styled.h4`
    ${formErrorText};
    margin-top: 24px;
    background-color: ${props => props.theme.errorTextBackground};
    font-weight: 500;
    padding: 10px 16px;
    border-radius: 8px;
`;

const isEmptyMembers = ([key, info]) => {
    return key === 'members' && info.type === 'array.min';
};

const isInvalidEmail = ([key, info]) => {
    return key === 'members' && info.type === 'string.email';
};

function DisplayErrors({ errors, className, creationError }) {
    const messages = R.toPairs(errors);
    if (creationError) {
        return (
            <ErrorTextStyle className={className}>
                Unable to create folder. Please try again later.
            </ErrorTextStyle>
        );
    }

    return messages.map((error, i) => {
        if (isEmptyMembers(error)) {
            return (
                <ErrorTextStyle className={className} key={i}>
                    Please invite at least one other member
                </ErrorTextStyle>
            );
        } else if (isInvalidEmail(error)) {
            return (
                <ErrorTextStyle className={className} key={i}>
                    Please check that you have provided valid emails
                </ErrorTextStyle>
            );
        }
        return null;
    });
}

export function FolderCreateModal({ onCancel, onSave }) {
    const { register, handleSubmit, errors, getValues, setValue } = useForm({
        validationResolver,
        reValidateMode: 'onSubmit',
    });
    const [
        createFolder,
        { loading, error: creationError, data },
    ] = useCreateFolder();

    const handleSave = async (data, e) => {
        e.preventDefault();
        await createFolder({
            variables: { name: data.name, members: data.members },
        });
        onSave(data);
    };

    const handleCancel = e => {
        e.preventDefault();
        onCancel();
    };

    return (
        <ModalStyled isOpen>
            <NewFolderIcon
                css={`
                    margin-bottom: 16px;
                `}
            />
            <Header
                css={`
                    margin-bottom: 16px;
                `}
            >
                Add Folder
            </Header>
            <Text>
                Create a team and share models with other teamates  privately
                for collaboration.
            </Text>
            <DisplayErrors
                errors={errors}
                creationError={creationError}
                css={`
                    margin-bottom: 16px;
                `}
            />
            <Row
                css={`
                    margin-top: 48px;
                `}
            >
                <Form onSubmit={handleSubmit(handleSave)}>
                    <Label htmlFor="name">Folder Name</Label>
                    <FullWidthInput
                        name="name"
                        ref={register({ required: true })}
                    />
                    <Label htmlFor="members">Share Folder</Label>
                    <FullWidthInput
                        name="members"
                        ref={register({ required: true })}
                        css={`
                            margin-bottom: 24px;
                        `}
                    />
                    <Row
                        css={`
                            justify-content: flex-end;
                            margin-top: 48px;
                        `}
                    >
                        <DarkButton
                            onClick={handleCancel}
                            css={`
                                margin-right: 16px;
                                min-width: 116px;
                            `}
                            type="button"
                        >
                            Cancel
                        </DarkButton>
                        <Button
                            type="submit"
                            css={`
                                min-width: 106px;
                            `}
                        >
                            Save
                        </Button>
                    </Row>
                </Form>
            </Row>
        </ModalStyled>
    );
}
