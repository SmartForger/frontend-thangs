import React from 'react'
import FolderCard from '../FolderCard'

const FolderCards = ({ folders = [] }) =>
  Array.isArray(folders) &&
  folders.map((folder, index) => (
    <FolderCard key={`folder=${folder.id}:${index}`} folder={folder} />
  ))

export default FolderCards
