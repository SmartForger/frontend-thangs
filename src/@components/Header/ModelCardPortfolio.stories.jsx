import React from 'react'
import { ProfileDropdownMenuContainer } from './ProfileDropdown'
import { MemoryRouter } from 'react-router'

const user = JSON.parse(
  '{"id":85,"username":"username","firstName":"R.J.","lastName":"MacReady","fullName":"R.J. MacReady","profile":{"avatarUrl":"https://storage.googleapis.com/staging-thangs-uploads/uploads/avatars/2dc11fd0-a80b-4967-8453-b5c9af4f795b?GoogleAccessId=gcp-and-physna%40appspot.gserviceaccount.com&Expires=1611824902&Signature=GJne0Bjw4zghYUyzUJ1Iz9K%2B6jPwD3M84TSwd61fPpH3hkLqB2IGp0X3EisKWbAqoNTve6cijko9J3XSpkkAh0uOeLeKhmhGKrd2Zsz6T6TpfcKATusO0kBnQDmkkdeA3Z4fDtwBgbLn7oJcFuLvxKticgroVYKdQfh6tfL%2FdWf2pdliu2f1oXvztq4RJkLUdPzLJkwfA071R%2Bk3WIDq8LnjymvMBe0Ssj1pHY5uh0JA%2B7ol76CP4nLDCGychiZ4oHrdWUMa5vycZVc2KBkYr8oOHvsuoY1I3ZmpKCw4Qdno4u8i%2F%2F1v%2FNl%2B30vlc2Lx%2FZuUehaxGegUu4tu4QLqaA%3D%3D","description":""},"isBeingFollowedByRequester":false}'
)

export default {
  title: 'Organism/UserMenu',
  decorators: [story => <MemoryRouter>{story()}</MemoryRouter>],
}

export const ProfileDropdownMenuTest = () => {
  return <ProfileDropdownMenuContainer user={user} />
}
