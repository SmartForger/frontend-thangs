import React from 'react';
import styled from 'styled-components/macro';
import { NoResults } from '../NoResults';
import { FolderCard } from '../FolderCard';
import { ShowMoreButton } from '../ShowMore';
import { Grid } from './Grid';

const NOOP = () => null;

const ShowMoreContainer = styled.div`
    margin-top: 32px;
    text-align: center;
`;
export function FolderCollection({
    folders = [],
    maxPerRow = 4,
    noResultsText,
    fetchMore = NOOP,
    hasMore,
}) {
    if (!folders || folders.length < 1) {
        return <NoResults>{noResultsText}</NoResults>;
    }

    return (
        <>
            <Grid singleRow={folders.length < maxPerRow}>
                {folders.map((folder, index) => (
                    <FolderCard
                        key={`folder-${folder.id}:${index}`}
                        folder={folder}
                        withOwner={true}
                    />
                ))}
            </Grid>
            {hasMore && (
                <ShowMoreContainer>
                    <ShowMoreButton fetchMore={fetchMore} />
                </ShowMoreContainer>
            )}
        </>
    );
}
