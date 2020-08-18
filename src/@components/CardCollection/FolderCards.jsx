import React from 'react'
import FolderCard from '../FolderCard'

const FolderCards = ({ items = [] }) =>
  Array.isArray(items) &&
  items.map((folder, index) => (
    <FolderCard key={`folder=${folder.id}:${index}`} folder={folder} />
  ))

export default FolderCards
