import React from 'react'
import SearchCard from '../SearchCard'

const SearchCards = ({ items = [] }) =>
  Array.isArray(items) &&
  items.map((search, index) => (
    <SearchCard key={`search=${search.id}:${index}`} search={search} />
  ))

export default SearchCards
