import React, { useCallback, useMemo } from 'react'
import { ActionMenu, Button, Spacer } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ShareIcon } from '@svg/share-icon.svg'
import { ReactComponent as ShareFacebook } from '@svg/share-facebook.svg'
import { ReactComponent as ShareTwitter } from '@svg/share-twitter.svg'
import { ReactComponent as ShareReddit } from '@svg/share-reddit.svg'
import { ReactComponent as SharePinterest } from '@svg/share-pinterest.svg'
import {
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share'
import { useCopy } from '@hooks'
import { buildThumbnailUrl, track } from '@utilities'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    ShareActionMenu: {},
    ShareActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ShareActionMenu__desktop: {
      display: 'none',

      [md_viewer]: {
        display: 'flex',
      },
    },
    ShareActionMenu__mobile: {
      display: 'flex',

      [md_viewer]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const ShareTarget = ({ onClick = noop, iconOnly = false }) => {
  const c = useStyles({})
  return (
    <Button className={c.ShareActionMenu_ClickableButton} onClick={onClick}>
      <ShareIcon />
      {!iconOnly && (
        <>
          <Spacer size={'.5rem'} />
          Share
        </>
      )}
    </Button>
  )
}

const ShareActionMenu = ({ iconOnly, model, profileId, title, user }) => {
  const shareUrl = `${window.location.origin}/${
    model ? `m/${model.id}` : `u/${profileId}` || window.location.pathname
  }`
  const mediaUrl = model
    ? buildThumbnailUrl(model, false)
    : user && user.profile && user.profile.avatarUrl
  const { copied, copy } = useCopy(shareUrl)
  const options = useMemo(
    () => [
      {
        label: 'Facebook',
        Icon: ShareFacebook,
        value: 'Facebook',
        Component: FacebookShareButton,
        props: {
          url: shareUrl,
          quote: title,
        },
      },
      {
        label: 'Twitter',
        Icon: ShareTwitter,
        value: 'Twitter',
        Component: TwitterShareButton,
        props: {
          url: shareUrl,
          title,
        },
      },
      {
        label: 'Reddit',
        Icon: ShareReddit,
        value: 'Reddit',
        Component: RedditShareButton,
        props: {
          url: shareUrl,
          title,
        },
      },
      {
        label: 'Pinterest',
        Icon: SharePinterest,
        value: 'Pinterest',
        Component: PinterestShareButton,
        props: {
          media: mediaUrl,
          description: title,
          url: String(window.location),
        },
      },
      {
        label: copied === false ? 'Copy Share URL' : 'Copied URL',
        Icon: ShareIcon,
        value: 'Copy Share URL',
        onClick: copy,
      },
    ],
    [copied, copy, mediaUrl, shareUrl, title]
  )
  const onShare = useCallback(
    source => {
      track(`Share ${model ? 'model' : 'portfolio'} - ${source}`, {
        subject: window.location.pathname,
      })
    },
    [model]
  )

  const menuProps = useMemo(() => {
    return { onChange: onShare, actionBarTitle: 'Share', options, tabletLayout: false }
  }, [onShare, options])

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={ShareTarget}
      TargetComponentProps={{ iconOnly }}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default ShareActionMenu
