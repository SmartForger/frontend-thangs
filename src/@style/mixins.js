export const flexRow = {
  display: 'flex',
  flexDirection: 'row',
}

export const flexColumn = {
  display: 'flex',
  flexDirection: 'column',
}

export const scrollbar = {
  scrollbarWidth: 'thin',
  scrollbarColor: '#C7C7C7 white',

  '&::-webkit-scrollbar': {
    width: '.75rem',
  },
  '&::-webkit-scrollbar-track': {
    background: 'white',
    borderRadius: '.5rem',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#C7C7C7',
    border: '3px solid white',
    borderRadius: 20,
  },
}
