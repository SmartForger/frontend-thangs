import React from 'react'
import { SingleLineBodyText, MultiLineBodyText, LabelText } from './'

export default {
  title: 'Text',
}

export const SingleLineBody = () => (
  <SingleLineBodyText>This is a SingleLineBodyText</SingleLineBodyText>
)
export const MultiLineBody = () => (
  <MultiLineBodyText>
    This is a <br />
    MultiLineBodyText
  </MultiLineBodyText>
)
export const Label = () => <LabelText>This is LabelText Component</LabelText>
