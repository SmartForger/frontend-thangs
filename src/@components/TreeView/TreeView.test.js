import React from 'react'
import { shallow } from 'enzyme'
import { createNode } from '@utilities/test'
import TreeView from './index'
import TreeNode from './TreeNode'
import Spinner from '../Spinner'

describe('TreeView', () => {
  let defaultProps = {
    nodes: [createNode([createNode()])],
    // eslint-disable-next-line react/display-name
    renderNode: node => <div data-jest='node'>{node.name}</div>,
  }

  it('should render component', () => {
    const component = shallow(<TreeView {...defaultProps} />)
    expect(component.find(TreeNode)).toHaveLength(1)
  })

  it('should render loading spiner', () => {
    const props = {
      ...defaultProps,
      loading: true,
    }
    const component = shallow(<TreeView {...props} />)
    expect(component.find(Spinner)).toHaveLength(1)
  })
})
