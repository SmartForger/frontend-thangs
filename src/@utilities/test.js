import Chance from 'chance'

export const chance = new Chance()

export const createNode = (subs = []) => ({
  id: chance.guid(),
  name: chance.guid(),
  subs,
})
