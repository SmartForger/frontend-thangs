import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as ChatIcon } from '@svg/chat-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { Card, ModelThumbnail, UserInline } from '@components'
import { THUMBNAILS_HOST } from '@utilities/constants'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelCard: {},
    ModelCard_Thumbnail: {
      paddingBottom: 0,
      minHeight: '12.25rem',
      margin: 'auto',
      maxWidth: 'calc(100% - 7.375rem)',
      width: '100%',
      borderRadius: '.5rem .5rem 0 0',
    },
    ModelCard_Content: {
      padding: '.5rem 1rem',
    },
    ModelCard_Name: {
      ...theme.mixins.text.regularText,
    },
    ModelCard_Row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '.5rem',
    },
    ModelCard_ActivityIndicators: {
      display: 'flex',
      flexDirection: 'row',

      '& > span:not(:last-child)': {
        marginRight: '1rem',
      },
    },
    ModelCard_ActivityCount: {
      ...theme.mixins.text.thumbnailActivityCountText,
      display: 'flex',
      alignItems: 'center',
      letterSpacing: 0,
    },
    ModelCard_LikedIcon: {
      fill: theme.colors.gold[500],
      stroke: theme.colors.gold[500],
      '& path': {
        fill: theme.colors.gold[500],
      },
    },
  }
})

const ModelDetails = ({ c, model, showOwner }) => {
  return (
    <div className={c.ModelCard_Content}>
      <div className={c.ModelCard_Name}>{model.name}</div>
      <div className={c.ModelCard_Row}>
        {showOwner && <UserInline user={model.owner} />}
        <div className={c.ModelCard_ActivityIndicators}>
          <span className={c.ModelCard_ActivityCount}>
            <ChatIcon className={c.ModelCard_Icon} />
            &nbsp;{model.commentsCount}
          </span>
          <span className={c.ModelCard_ActivityCount}>
            <HeartIcon
              className={classnames(c.ModelCard_Icon, { [c.ModelCard_LikedIcon]: true })}
            />
            &nbsp;{model.likesCount}
          </span>
        </div>
      </div>
    </div>
  )
}

const CardContents = ({ className, c, model, showOwner }) => {
  return (
    <>
      <Card className={className}>
        <ModelThumbnail
          className={c.ModelCard_Thumbnail}
          name={model.name}
          thumbnailUrl={model.thumbnailUrl || `${THUMBNAILS_HOST}/${model.uploadedFile}`}
        ></ModelThumbnail>
      </Card>
      <ModelDetails c={c} model={model} showOwner={showOwner} />
    </>
  )
}

const ModelCard = ({ className, model, withOwner }) => {
  const c = useStyles()
  const showOwner = withOwner && model.owner
  const [hovered, setHovered] = useState(false)
  const handleMouseEnter = useCallback(() => setHovered(true), [])
  const handleMouseLeave = useCallback(() => setHovered(false), [])

  return (
    <Link
      to={`/model/${model.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <CardContents
        className={className}
        model={model}
        showOwner={showOwner}
        hovered={hovered}
        c={c}
      />
    </Link>
  )
}

export default ModelCard
