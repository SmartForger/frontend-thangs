import React, { useCallback } from 'react'
import { Button, DropdownMenu, DropdownItem, Spacer, LabelText } from '@components'
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
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    ShareDropdown: {
      width: 'auto',
      right: 0,
    },
    ShareDropdown_Arrow: {
      '& > path': {},
    },
    ShareDropdown_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ShareDropdown_DropdownMenuDivider: {
      margin: '.25rem 0',
      border: 'none',
      borderTop: `1px solid ${theme.colors.grey[100]}`,
    },
    ShareDropdown_Row: {
      display: 'flex',
      flexDirection: 'row',
    },
    ShareDropdown_Column: {
      display: 'flex',
      flexDirection: 'column',
    },
  }
})

const noop = () => null
export const ShareDropdownMenu = ({
  TargetComponent,
  iconOnly,
  model,
  title,
  urlPathname,
}) => {
  const c = useStyles({})
  const shareUrl = `${window.location.origin}/m${
    model ? `/${model.id}` : urlPathname || window.location.pathname
  }`

  const onFBShare = useCallback(() => {
    track(`Share ${urlPathname ? 'portfolio' : 'model'} - Facebook`, {
      subject: window.location.pathname,
    })
  }, [urlPathname])

  const onTwitterShare = useCallback(() => {
    track(`Share ${urlPathname ? 'portfolio' : 'model'} - Twitter`, {
      subject: window.location.pathname,
    })
  }, [urlPathname])

  const onRedditShare = useCallback(() => {
    track(`Share ${urlPathname ? 'portfolio' : 'model'} - Reddit`, {
      subject: window.location.pathname,
    })
  }, [urlPathname])

  const onPinterestShare = useCallback(() => {
    track(`Share ${urlPathname ? 'portfolio' : 'model'} - Pinterest`, {
      subject: window.location.pathname,
    })
  }, [urlPathname])

  return (
    <DropdownMenu
      className={c.ShareDropdown}
      TargetComponent={TargetComponent}
      iconOnly={iconOnly}
    >
      <div>
        <DropdownItem onClick={onFBShare}>
          <FacebookShareButton url={shareUrl} quote={title}>
            <div className={c.ShareDropdown_Row}>
              <ShareFacebook />
              <Spacer size={'.75rem'} />
              <LabelText>Facebook</LabelText>
            </div>
          </FacebookShareButton>
        </DropdownItem>
        <Spacer size={'.5rem'} />
        <DropdownItem onClick={onTwitterShare}>
          <TwitterShareButton url={shareUrl} title={title}>
            <div className={c.ShareDropdown_Row}>
              <ShareTwitter />
              <Spacer size={'.75rem'} />
              <LabelText>Twitter</LabelText>
            </div>
          </TwitterShareButton>
        </DropdownItem>
        <Spacer size={'.5rem'} />
        <DropdownItem onClick={onRedditShare}>
          <RedditShareButton url={shareUrl} title={title}>
            <div className={c.ShareDropdown_Row}>
              <ShareReddit />
              <Spacer size={'.75rem'} />
              <LabelText>Reddit</LabelText>
            </div>
          </RedditShareButton>
        </DropdownItem>
        <Spacer size={'.5rem'} />
        <DropdownItem onClick={onPinterestShare}>
          <PinterestShareButton url={shareUrl} media={title}>
            <div className={c.ShareDropdown_Row}>
              <SharePinterest />
              <Spacer size={'.75rem'} />
              <LabelText>Pinterest</LabelText>
            </div>
          </PinterestShareButton>
        </DropdownItem>
      </div>
    </DropdownMenu>
  )
}

export const ShareDropdown = ({ onClick = noop, iconOnly = false }) => {
  const c = useStyles({})

  return (
    <Button className={c.ShareDropdown_ClickableButton} onClick={onClick}>
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
