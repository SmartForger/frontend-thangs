import React from 'react'
import { text, date } from '@storybook/addon-knobs'
import { Comment } from './'

const ownerDefault = JSON.parse(
  '{"id":"1","username":"harveyjoanna","fullName":"Joanna Harvey","avatarUrl":"https://storage.googleapis.com/staging-thangs-general/uploads/avatars/f82602c3-ffd9-48be-8ce3-991034e6ad60?GoogleAccessId=thangs%40appspot.gserviceaccount.com&Expires=1613038893&Signature=ZRpoDyUESZpdrqvvq6z%2F0dUMQr9DFOZZ1UnOYpqumBw571caeXZtkflVW9imCHVS5Bf5UM57ORaZ7tUNrQyIPn%2FjHWV8NR2qVmZ7%2BE34zXj2x18gSlqUlNVpJQnBUVKLpJ%2FX7YD%2BIoe%2FQQxJyF9XEincRrYEwkiddSwlPWut%2BmieBj68YINlHLqMq4sjWWwuiWII2NdMPeFJdu6B%2B4sN4Vy3X3yLlIhFG9O4MIJ7GY2%2B%2BeofqYX3M%2BTcyT0zTAgVZPKy4dQF8bCgsBk%2Fcv24QzpcIqBuuDcHuEETO3FitShZCyj%2FblTbQMIubuAvaiIeTkxD17aYM%2FwfpPVpImChxg%3D%3D"}'
)
const bodyDefault = 'The molecule must have been partly de-phased by the anyon beam'
const avatarDefaultSrc = 'https://st.renderu.com/logo/307899'

export const CommentTest = () => {
  const props = {
    comment: {
      owner: {
        ...ownerDefault,
        username: text('Username', 'SirSalazar'),
        avatarUrl: text('Avatar url', avatarDefaultSrc),
      },
      created: date('Created', new Date('Jan 20 2017')),
      body: text('Body', bodyDefault),
    },
  }

  return <Comment currentUser={{ id: '111' }} {...props} />
}

export default {
  title: 'Molecules/Comment',
}
