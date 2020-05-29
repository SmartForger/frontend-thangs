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
