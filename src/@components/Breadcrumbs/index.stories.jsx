import React from 'react'
import Breadcrumbs from './'

export default {
  title: 'Breadcrumbs',
  component: Breadcrumbs,
}

export const FolderBreadcrumbs = () => {
  const folderFixture = {
    name: '4 Cylinder Engine Project',
    id: 9,
  }
  return <Breadcrumbs modelsCount={6} folder={folderFixture}></Breadcrumbs>
}
