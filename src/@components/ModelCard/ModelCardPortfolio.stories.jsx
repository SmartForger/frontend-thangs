import React from 'react'
import { ModelCardLanding } from './'
import { UserInline } from '@components'
import { withKnobs, number, text } from '@storybook/addon-knobs'
import { MemoryRouter } from 'react-router'
import { StoreContext } from 'storeon/react'
import store from 'store'

const modelData =
  '{"id":"7398","name":"JS Clamp","parts":[{"name":"Js Clamp","size":156014,"parts":[{"name":"part4","size":156014,"parts":null,"partId":0,"filename":"677e1599-0145-477f-a933-bdd0c80a3ce1/Part4.SLDPRT","parentId":9,"originalFileName":"Part4.SLDPRT"},{"name":"part3","size":156014,"parts":null,"partId":1,"filename":"677e1599-0145-477f-a933-bdd0c80a3ce1/Part3.SLDPRT","parentId":9,"originalFileName":"Part3.SLDPRT"},{"name":"part1","size":156014,"parts":null,"partId":3,"filename":"677e1599-0145-477f-a933-bdd0c80a3ce1/Part1.SLDPRT","parentId":9,"originalFileName":"Part1.SLDPRT"},{"name":"part5","size":156014,"parts":null,"partId":4,"filename":"677e1599-0145-477f-a933-bdd0c80a3ce1/Part5.SLDPRT","parentId":9,"originalFileName":"Part5.SLDPRT"},{"name":"part6","size":156014,"parts":null,"partId":5,"filename":"677e1599-0145-477f-a933-bdd0c80a3ce1/Part6.SLDPRT","parentId":9,"originalFileName":"Part6.SLDPRT"},{"name":"assem3","size":156014,"parts":[{"name":"part2","size":156014,"parts":null,"partId":2,"filename":"677e1599-0145-477f-a933-bdd0c80a3ce1/Part2.SLDPRT","parentId":7,"originalFileName":"Part2.SLDPRT"},{"name":"assem2","size":156014,"parts":[{"name":"Hex Screw","size":156014,"parts":null,"partId":8,"filename":"677e1599-0145-477f-a933-bdd0c80a3ce1/Hex screw M4 x 20.SLDPRT","parentId":6,"originalFileName":"Hex screw M4 x 20.SLDPRT"}],"partId":6,"filename":"677e1599-0145-477f-a933-bdd0c80a3ce1/Assem2.SLDASM","parentId":7,"originalFileName":"Assem2.SLDASM"}],"partId":7,"filename":"677e1599-0145-477f-a933-bdd0c80a3ce1/Assem3.SLDASM","parentId":9,"originalFileName":"Assem3.SLDASM"}],"partId":9,"filename":"677e1599-0145-477f-a933-bdd0c80a3ce1/JS Clamp - H215.SLDASM","parentId":null,"originalFileName":"JS Clamp - H215.SLDASM"}],"units":"mm","category":"industrial","isAssembly":true,"description":"Star wars villain","accessTypeId":0,"matchingData":[],"owner":{"id":51,"username":"Colin the greatest","firstName":"Colin","lastName":"Casto","fullName":"Colin Casto","profile":{"avatarUrl":"https://storage.googleapis.com/staging-thangs-uploads/uploads/avatars/3fb2db6cccf4a23383383394b28b2b31?GoogleAccessId=gcp-and-physna%40appspot.gserviceaccount.com&Expires=1611753581&Signature=acir1w9M%2FPsF2AN2buMGbLxYDUKG1sy%2FFR%2FfmVFe4X1XNCfjtuMX9sCNCb4bOhl7%2FBVZT2r%2B780ZtzNWf2longpeimtmt2xcSZNiTljRY943lksZlCzxbRXLjGwW4z5U%2Bsu49Hetf8arajcc%2BiJUkGNDY%2FvHkLPC%2F%2BUMybXxWqMZ3i83nfGezutQak6IPeDBS4vYr5FK9keomOQo7vbaazVbyr4cqxRUWhzYn9DK4XNQF0Zlo5srZKZasR7c0MVsaLeV%2F83ZE6ihPScSDeaDYMw8KVVxp9zqvI5Ebgria1PLSZWP%2FAs82h8IgIgnHqv6ATtiwMxihF6i4GV5hNlQEg%3D%3D","description":""},"isBeingFollowedByRequester":false},"created":"2021-01-26T23:19:34.368Z","likesCount":0,"commentsCount":0,"downloadCount":0,"identifier":"Colin-the-greatest/JS-Clamp-7398"}'

const userData = username =>
  `{"id":85,"username":"${username}","firstName":"R.J.","lastName":"MacReady","fullName":"R.J. MacReady","profile":{"avatarUrl":"https://storage.googleapis.com/staging-thangs-uploads/uploads/avatars/2dc11fd0-a80b-4967-8453-b5c9af4f795b?GoogleAccessId=gcp-and-physna%40appspot.gserviceaccount.com&Expires=1611824902&Signature=GJne0Bjw4zghYUyzUJ1Iz9K%2B6jPwD3M84TSwd61fPpH3hkLqB2IGp0X3EisKWbAqoNTve6cijko9J3XSpkkAh0uOeLeKhmhGKrd2Zsz6T6TpfcKATusO0kBnQDmkkdeA3Z4fDtwBgbLn7oJcFuLvxKticgroVYKdQfh6tfL%2FdWf2pdliu2f1oXvztq4RJkLUdPzLJkwfA071R%2Bk3WIDq8LnjymvMBe0Ssj1pHY5uh0JA%2B7ol76CP4nLDCGychiZ4oHrdWUMa5vycZVc2KBkYr8oOHvsuoY1I3ZmpKCw4Qdno4u8i%2F%2F1v%2FNl%2B30vlc2Lx%2FZuUehaxGegUu4tu4QLqaA%3D%3D","description":""},"isBeingFollowedByRequester":false}`

export default {
  title: 'Model card',
  decorators: [withKnobs],
}

export const UserLineTest = () => {
  const usernameKnob = text('Username', 'beveryday')

  const user = JSON.parse(userData(usernameKnob))

  return (
    <UserInline
      user={user}
      size={number('Size', 24)}
      maxLength={number('Max length', 20)}
    />
  )
}

export const ModelCardTest = () => {
  return (
    <MemoryRouter>
      <StoreContext.Provider value={store}>
        <ModelCardLanding model={JSON.parse(modelData)} />
      </StoreContext.Provider>
    </MemoryRouter>
  )
}
