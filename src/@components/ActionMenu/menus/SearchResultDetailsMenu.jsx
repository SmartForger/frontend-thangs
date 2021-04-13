import React from 'react'

import DotStackActionMenu from './DotStackActionMenu'

const REPORT_MODEL = 'report_model'

const SearchResultDetailsMenu = ({ model, onReportModel }) => {
  const options = [
    {
      label: 'Report Model',
      value: REPORT_MODEL,
    },
  ]

  const handleSelect = eventType => {
    switch (eventType) {
      case REPORT_MODEL:
        onReportModel(model)
        break
      default:
        break
    }
  }

  return <DotStackActionMenu options={options} onChange={handleSelect} />
}

export default SearchResultDetailsMenu
