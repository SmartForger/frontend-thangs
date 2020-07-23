import { graphql, rest } from 'msw'

const mockUser = {
  __typename: 'UserType',
  id: null,
  username: null,
  email: null,
  firstName: null,
  lastName: null,
  fullName: null,
  profile: {
    __typename: 'UserProfileType',
    description: null,
    avatarUrl: null,
  },
  inviteCode: null,
  likedModels: [],
  models: [],
  isBeingFollowedByRequester: false,
  foldersCount: null,
  modelsCount: null,
  likedModelsCount: null,
}

const mockModel = {
  __typename: 'ModelType',
  id: 1,
  name: 'Test model',
  likes: [
    {
      __typename: 'LikeType',
      isLiked: true,
      owner: mockUser,
    },
  ],
  owner: mockUser,
  likesCount: 11,
  commentsCount: 32,
  uploadStatus: 'COMPLETE',
  description: '',
  category: 'INDUSTRIAL',
  weight: '10',
  height: '10',
  material: 'None',
  uploadedFile: '',
}

const modelsById = {
  'model-processing': {
    ...mockModel,
    id: 'model-processing',
    uploadStatus: 'PROCESSING',
    relatedModels: [],
  },
  'model-complete': {
    ...mockModel,
    id: 'model-complete',
    relatedModels: [mockModel, mockModel, mockModel],
  },
  'model-error': {
    ...mockModel,
    id: 'model-error',
    uploadStatus: 'ERROR',
    relatedModels: [],
  },
}

export const handlers = [
  rest.post('/api/token/refresh/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        refresh: 'valid',
      })
    )
  }),
  graphql.query('getUser', (req, res, ctx) => {
    return res(ctx.data({ user: mockUser }))
  }),
  graphql.query('getModel', (req, res, ctx) => {
    const { variables } = req
    const model = modelsById[variables.id]
    return res(ctx.data({ model }))
  }),
  graphql.query('folderQuery', (req, res, ctx) => {
    const { variables } = req
    const model = modelsById[variables.id]
    return res(ctx.data({ model }))
  }),
  graphql.query('modelCommentsPaged', (req, res, ctx) => {
    return res(
      ctx.data({
        modelCommentsPaged: {
          pageInfo: {
            hasNextPage: null,
            endCursor: null,
          },
          edges: [
            {
              node: {
                id: null,
                owner: mockUser,
                body: null,
                created: null,
              },
            },
          ],
        },
      })
    )
  }),
  graphql.mutation('createModelComment', (req, res, ctx) => {
    const { input } = req.variables
    return res(
      ctx.data({
        createModelComment: {
          __typename: 'CreateModelComment',
          comment: {
            __typename: 'ModelCommentType',
            id: null,
            body: input.body,
            created: null,
            owner: mockUser,
          },
        },
      })
    )
  }),
  graphql.mutation('createFolder', (req, res, ctx) => {
    const { variables } = req
    return res(
      ctx.data({
        createFolder: {
          __typename: 'CreateFolder',
          folder: {
            __typename: 'FolderType',
            id: null,
            name: variables.name,
          },
        },
      })
    )
  }),
  graphql.mutation('inviteToFolder', (req, res, ctx) => {
    const { variables } = req
    return res(
      ctx.data({
        inviteToFolder: {
          __typename: 'InviteToFolder',
          folder: {
            __typename: 'FolderType',
            id: null,
            name: variables.name,
            members: [mockUser],
          },
        },
      })
    )
  }),
]
