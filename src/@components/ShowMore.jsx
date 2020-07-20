import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { TextButton } from './Button';
import { Spinner } from './Spinner';
import { linkText } from '../@style/text';

const MoreButton = styled(TextButton)`
    ${linkText};
    width: 114px;
    padding: 8px 12px;
`;

const SpinnerStyled = styled(Spinner)`
    width: 18px;
    height: 18px;
`;

export function ShowMore({ more, className }) {
    const [shouldShowMore, setShouldShowMore] = useState();
    return shouldShowMore ? (
        more
    ) : (
        <div className={className}>
            <MoreButton onClick={() => setShouldShowMore(true)}>
                Show More
            </MoreButton>
        </div>
    );
}

export function ShowMoreButton({ fetchMore }) {
    const [loading, setLoading] = useState();
    const [hadError, setHadError] = useState();
    const handleClick = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetchMore();
            setLoading(false);
        } catch (error) {
            setHadError(true);
        }
    };
    return (
        <MoreButton onClick={handleClick}>
            {hadError ? (
                'Server Error'
            ) : loading ? (
                <SpinnerStyled />
            ) : (
                'Show More'
            )}
        </MoreButton>
    );
}
