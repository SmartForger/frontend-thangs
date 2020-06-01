import { authenticationService } from '../@services';
import * as GraphqlService from '@services/graphql-service';
const graphqlService = GraphqlService.getInstance();

export function useCreateFolder() {
    const userId = authenticationService.getCurrentUserId();
    const [
        createFolder,
        { loading, error },
    ] = graphqlService.useCreateFolderMutation(userId);

    return [createFolder, { loading, error }];
}

export function useInviteToFolder(folderId) {
    const [
        inviteToFolder,
        { loading, error },
    ] = graphqlService.useInviteToFolderMutation(folderId);

    return [inviteToFolder, { loading, error }];
}

export function useRevokeAccess(folderId, userId) {
    const [
        revokeAccess,
        { loading, error },
    ] = graphqlService.useRevokeAccessMutation(folderId, userId);
    return [revokeAccess, { loading, error }];
}

export function useFolder(folderId) {
    const { loading, error, folder } = graphqlService.useFolderById(folderId);
    return { loading, error, folder };
}
