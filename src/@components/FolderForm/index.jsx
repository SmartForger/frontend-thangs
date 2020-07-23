import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import styled from 'styled-components/macro';
import Joi from '@hapi/joi';
import * as R from 'ramda';
import {Button, DarkButton} from '../Button';
import { Spinner } from '../Spinner';
import {useCreateFolder, useInviteToFolder} from '../../@customHooks/Folders';
import { formErrorText } from '../../@style/text';
import { WHITE_4 } from '../../@style/colors';
import teamLogo from "../../@svg/multi-users.svg";
import saveTeamLogo from "../../@svg/save-team.svg";
import saveTeamSuccess from "../../@svg/save-team-success.svg";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useStoreon} from "storeon/react";

const SpinnerStyled = styled(Spinner)`
    width: 18px;
    height: 18px;
    & .path {
        stroke: currentColor;
    }
`;

const Row = styled.div`
    display: flex;
`;

const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const PseudoForm = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const SaveTeamLabel = styled.label`
    color: #1B8CF8;
    cursor: pointer;
    margin-top: 26px;
`;

const SaveTeamSuccessLabel = styled.label`
    color: #585858;
    margin-top: 26px;
`;

const SaveLogo = styled.img`
    margin: 26px 7px 0 auto
`;

const Label = styled.label`
    margin-bottom: 8px;
`;

const FullWidthInput = styled.input`
    border: 0;
    padding: 8px 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    min-width: 0;
    background: ${WHITE_4};
`;

let initSchema = Joi.object({
    name: Joi.string().required(),
    members: Joi.array()
        .items(Joi.string().email({ tlds: { allow: false } }))
        .min(1)
        .required(),
    team: Joi.string().allow('')
});

const autocompleteSchema = Joi.object({
    name: Joi.string().required(),
    members: Joi.array()
    .items(Joi.string())
    .required(),
    team: Joi.string().allow('')
});

const schemaWithName = Joi.object({
    name: Joi.string().required(),
    members: Joi.array()
        .items(Joi.string().email({ tlds: { allow: false } }))
        .min(1)
        .required(),
    team: Joi.string().allow(''),
});

const schemaWithTeamMembers = Joi.object({
    members: Joi.array()
        .items(Joi.string().email({ tlds: { allow: false } }))
        .min(1)
        .required(),
    team: Joi.string().required()
});

const schemaWithoutName = Joi.object({
    members: Joi.array()
        .items(Joi.string().email({ tlds: { allow: false } }))
        .min(1)
        .required(),
});

const parseEmails = R.pipe(R.split(/, */), R.filter(R.identity));

const isEmptyMembers = ([key, info]) => {
    return key === 'members' && info.type === 'array.min';
};

const isEmptyTeamName = ([key, info]) => {
    return key === 'team' && info.type === 'string.empty';
};

const isEmptyName = ([key, info]) => {
    return key === 'name' && info.type === 'string.empty';
};

const isInvalidEmail = ([key, info]) => {
    return key === 'members' && info.type === 'string.email';
};

const isServerError = ([key, info]) => {
    return key === 'server';
};

const ErrorTextStyle = styled.h4`
    ${formErrorText};
    margin-top: 24px;
    background-color: ${props => props.theme.errorTextBackground};
    font-weight: 500;
    padding: 10px 16px;
    border-radius: 8px;
`;

export function DisplayErrors({ errors, className, serverErrorMsg }) {
    const messages = R.toPairs(errors);

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
        } else if (isEmptyName(error)) {
            return (
                <ErrorTextStyle className={className} key={i}>
                    Please provide a name for your folder
                </ErrorTextStyle>
            );
        } else if (isEmptyTeamName(error)) {
            return (
                <ErrorTextStyle className={className} key={i}>
                    Please provide a Team Name for your folder
                </ErrorTextStyle>
            );
        } else if (isServerError(error)) {
            return (
                <ErrorTextStyle className={className} key={i}>
                    {serverErrorMsg}
                </ErrorTextStyle>
            );
        }

        return null;
    });
}

export function CreateFolderForm({
    onErrorReceived,
    afterCreate,
    onCancel,
    membersLabel,
}) {
    const { dispatch, teams } = useStoreon('teams')

    const [saveTeamActive, setSaveTeamActive] = useState(false);

    let saveLogo = teams.isSaved ? saveTeamSuccess : (saveTeamActive ? saveTeamLogo : teamLogo);
    let errors;
    let teamNames = [];

    useEffect(() => {
        dispatch('fetch-teams');
    }, []);

    if(teams.data){
        teams.data.forEach((team) => {
            teamNames.push(team.name);
        });
    }

    const validationResolver = data => {
        const members = data.members ? parseEmails(data.members) : [];
        const input = {
            name: data.name,
            team: data.team,
            members
        };

        const { error, value: values } = initSchema.validate(input);

        errors = error
            ? error.details.reduce((previous, currentError) => {
                  return {
                      ...previous,
                      [currentError.path[0]]: currentError,
                  };
              }, {})
            : {};

        onErrorReceived(R.equals(errors, {}) ? undefined : errors);

        return {
            values: error ? {} : values,
            errors,
        };
    };

    const { register, handleSubmit, getValues, triggerValidation, control, setValue} = useForm({
        validationResolver,
        reValidateMode: 'onSubmit',
    });

    const isExistingTeam = () => {return teamNames.indexOf(getValues('members')) > -1};

    const [createFolder, { loading }] = useCreateFolder();

    const handleSave = async (data, e) => {
        e.preventDefault();
        console.log(data);
        try {
            const variables = {
                name: data.name,
                members: isExistingTeam() ? getValues("members") : data.members,
                team: data.team ? data.team : null
            };
            const mutation = await createFolder({
                variables,
            });
            const folder = mutation.data.createFolder.folder;
            afterCreate(folder);
        } catch (error) {
            onErrorReceived({
                server: error,
            });
        }
    };

    const handleCancel = e => {
        e.preventDefault();
        onCancel();
    };

    const addInputGroupField = () => {
        return(
            <>
              <Label htmlFor="team">Team Name</Label>
              <FullWidthInput name="team" ref={register()} />
            </>
            )
    }

    const addSaveGroupFields = () => {
        return(
            <>
            {saveTeamActive ? addInputGroupField() : null}
            <Row>
                <SaveLogo src={saveLogo} />
                {saveTeamActive && !teams.isSaved ? <SaveTeamLabel onClick={() => saveGroup()}>Save Team</SaveTeamLabel> : null}
                {!saveTeamActive && !teams.isSaved ? <SaveTeamLabel onClick={() => saveGroupActivate()}>Save Users As Team</SaveTeamLabel> : null}
                {saveTeamActive && teams.isSaved ? <SaveTeamSuccessLabel>Team Saved</SaveTeamSuccessLabel> : null}
            </Row>
            </>
        )
    }

    const saveGroupActivate = () => {
        setSaveTeamActive(true);
    }

    const saveGroup = ()  => {
        initSchema = schemaWithTeamMembers;
        const res = triggerValidation();
        if(!(errors.members || errors.team)){
            const data = {team: getValues("team"), members: getValues("members") ? parseEmails(getValues("members")) : []};
            dispatch('add-team', data);
        }
        initSchema = schemaWithName;
    }

    const onAutocompleteChange = (event) => {
        setValue("members", event.target?.value ? event.target.value : event[1]);
        if(isExistingTeam()) {
            initSchema = autocompleteSchema;
        } else {
            initSchema = schemaWithName;
            }
        const res = triggerValidation();
        };

    return (
        <Form onSubmit={handleSubmit(handleSave)}>
            <Label htmlFor="name">Folder Name</Label>
            <FullWidthInput name="name" ref={register({ required: true })} />
            <Label htmlFor="members">Add users or enter an existing team name</Label>
            <Controller
                name="members-autocomplete" control={control}
                onInputChange={(event) => onAutocompleteChange(event)}
                onChange={(event) => onAutocompleteChange(event)}
                as={
                    <Autocomplete
                        freeSolo
                        ListboxProps={{ style: { borderRadius: "3px", background: '#ececec', overflow: 'auto' } }}
                        options={teamNames}
                        defaultValue=""
                        getOptionLabel={team => team}
                        renderInput={(teams) =>
                            <Controller as={
                                <PseudoForm ref={teams.InputProps.ref}>
                                  <FullWidthInput {...teams.inputProps} />
                                </PseudoForm>
                            }
                        name="members"
                        control={control}/>}/>}/>
            {addSaveGroupFields()}
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
                    disabled={loading}
                >
                    {loading ? <SpinnerStyled /> : 'Save'}
                </Button>
            </Row>
        </Form>
    );
}

export function InviteUsersForm({
    folderId,
    onErrorReceived,
    afterInvite,
    onCancel,
}) {
    const validationResolver = data => {
        const members = data.members ? parseEmails(data.members) : [];
        const input = { members };

        const { error, value: values } = schemaWithoutName.validate(input);

        const errors = error
            ? error.details.reduce((previous, currentError) => {
                  return {
                      ...previous,
                      [currentError.path[0]]: currentError,
                  };
              }, {})
            : {};

        onErrorReceived(R.equals(errors, {}) ? undefined : errors);

        return {
            values: error ? {} : values,
            errors,
        };
    };

    const { register, handleSubmit } = useForm({
        validationResolver,
        reValidateMode: 'onSubmit',
    });

    const [inviteToFolder, { loading }] = useInviteToFolder(folderId);

    const handleSave = async (data, e) => {
        e.preventDefault();
        try {
            const variables = { emails: data.members };
            await inviteToFolder({
                variables,
            });
            afterInvite(data);
        } catch (error) {
            onErrorReceived({
                server: error,
            });
        }
    };

    const handleCancel = e => {
        e.preventDefault();
        onCancel();
    };

    return (
        <Form onSubmit={handleSubmit(handleSave)}>
            <Label htmlFor="members">Add Users</Label>
            <FullWidthInput
                name="members"
                ref={register({ required: true })}
                placeholder="example@example.com"
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
                    {loading ? <SpinnerStyled /> : 'Invite'}
                </Button>
            </Row>
        </Form>
    );
}
