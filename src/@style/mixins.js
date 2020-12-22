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
    width: 12,
  },
  '&::-webkit-scrollbar-track': {
    background: 'white',
    borderRadius: '.5rem',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#C7C7C7',
    borderRadius: 20,
    border: '3px solid white',
  },
}
