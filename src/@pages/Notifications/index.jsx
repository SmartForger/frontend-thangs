import React from 'react';
import styled from 'styled-components/macro';
import { headerText } from '@style/text';
import { WithNewThemeLayout } from '@style/Layout';
import { NotificationsList } from '@components/NotificationsList';
import { Button } from '@components/Button';
import { Spinner } from '@components/Spinner';
import { useUpdateLastCheckedNotifications } from '@customHooks/Notifications';
import {connect} from "react-redux";

const Header = styled.h1`
    ${headerText};
`;

const SpinnerStyled = styled(Spinner)`
    height: 24px;
    width: 24px;
    & .path {
        stroke: currentColor;
    }
`;

const ButtonStyled = styled(Button)`
    min-width: 160px;
    margin: 16px 0;
`;

function Page(props) {
    const [
        updateLastChecked,
        { loading, error },
    ] = useUpdateLastCheckedNotifications();

    const handleClick = e => {
        e.preventDefault();
        return updateLastChecked();
    };

    return (
        <div>
            <Header>Notifications</Header>
            {props.notificationInfo.data}
            <ButtonStyled disabled={loading} onClick={handleClick}>
                {loading ? (
                    <SpinnerStyled />
                ) : error ? (
                    'Error'
                ) : (
                    'Clear Notifications'
                )}
            </ButtonStyled>
            <NotificationsList
                css={`
                    margin-top: 48px;
                `}
            />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        notificationInfo: state
    };
};

export const Notifications = connect(mapStateToProps)(WithNewThemeLayout(Page));

