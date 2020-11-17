import React from 'react'
import { Button, DropdownMenu, DropdownItem, Spacer, LabelText } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ShareIcon } from '@svg/share-icon.svg'
import { ReactComponent as ShareFacebook } from '@svg/share-facebook.svg'
import { ReactComponent as ShareTwitter } from '@svg/share-twitter.svg'
import { ReactComponent as ShareReddit } from '@svg/share-reddit.svg'
import { FacebookShareButton, RedditShareButton, TwitterShareButton } from 'react-share'

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
export const ShareDropdownMenu = ({ TargetComponent, iconOnly, title }) => {
  const c = useStyles({})
  const shareUrl = `${window.location.origin}/social/${window.location.pathname}`
  return (
    <DropdownMenu
      className={c.ShareDropdown}
      TargetComponent={TargetComponent}
      iconOnly={iconOnly}
    >
      <div>
        <DropdownItem>
          <FacebookShareButton url={shareUrl} quote={title}>
            <Spacer size={'.5rem'} />
            <div className={c.ShareDropdown_Row}>
              <Spacer size={'.5rem'} />
              <ShareFacebook />
              <LabelText>Facebook</LabelText>
              <Spacer size={'.5rem'} />
            </div>
            <Spacer size={'.5rem'} />
          </FacebookShareButton>
        </DropdownItem>
        <DropdownItem>
          <TwitterShareButton url={shareUrl} title={title}>
            <Spacer size={'.5rem'} />
            <div className={c.ShareDropdown_Row}>
              <Spacer size={'.5rem'} />
              <ShareTwitter />
              <LabelText>Twitter</LabelText>
              <Spacer size={'.5rem'} />
            </div>
            <Spacer size={'.5rem'} />
          </TwitterShareButton>
        </DropdownItem>
        <DropdownItem>
          <RedditShareButton url={shareUrl} title={title}>
            <Spacer size={'.5rem'} />
            <div className={c.ShareDropdown_Row}>
              <Spacer size={'.5rem'} />
              <ShareReddit />
              <LabelText>Reddit</LabelText>
              <Spacer size={'.5rem'} />
            </div>
            <Spacer size={'.5rem'} />
          </RedditShareButton>
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
      {!iconOnly && 'Share'}
    </Button>
  )
}
