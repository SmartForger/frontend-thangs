import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { Spinner } from '@components'

import { useServices, useLocalStorage } from '@hooks'

import NewModelCommentForm from './NewModelCommentForm'
import Comment from './Comment'
import VersionComment from './VersionComment'

const useStyles = createUseStyles(_theme => {
  return {
    FileDiscussion: {
      width: '100%',
    },
    FileDiscussion_List: {
      listStyleType: 'none',
      margin: 0,
      padding: 0,
      '& > *': {
        marginBottom: '.75rem',
      },
    },
    FileDiscussion_Loading: {
      display: 'flex',
      justifyContent: 'center',
    },
  }
})

const noop = () => null

const getParsedBody = str => {
  try {
    const strQuotesReplaces = str.replace(/'/g, '"')
    return JSON.parse(strQuotesReplaces)
  } catch (e) {
    return str
  }
}

const renderTypedComment = ({ modelId, comment, key, currentUser, onChange }) => {
  const parsedBody = getParsedBody(comment.body)
  if (typeof parsedBody === 'object') {
    return <VersionComment key={key} comment={{ ...comment, body: parsedBody }} />
  } else {
    return (
      <Comment
        key={key}
        modelId={modelId}
        onChange={onChange}
        comment={comment}
        currentUser={currentUser}
      />
    )
  }
}

const FileDiscussion = props => {
  const c = useStyles()
  const { model } = props
  const { useFetchPerMount } = useServices()
  const {
    atom: { isLoading: loading, isLoaded: loaded, isError: error, data: comments = [] },
  } = useFetchPerMount(model.id, 'model-comments')
  const [currentUser] = useLocalStorage('currentUser', null)

  if (error) {
    return <div>Error loading discussions</div>
  }

  return (
    <div className={c.FileDiscussion}>
      <NewModelCommentForm modelId={model.id} currentUser={currentUser} />

      <ul className={c.FileDiscussion_List}>
        {comments && comments.length
          ? comments.map((comment, i) =>
              renderTypedComment({ modelId: model.id, comment, key: i, currentUser })
            )
          : null}
      </ul>
      {(loading || !loaded) && (
        <div className={c.FileDiscussion_Loading}>
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default FileDiscussion
