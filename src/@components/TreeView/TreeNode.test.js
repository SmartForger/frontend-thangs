import React from 'react'
import { shallow } from 'enzyme'
import TreeNode from './TreeNode'
import { createNode } from '@utilities/test'
import Spacer from '@components/Spacer'

describe('TreeNode', () => {
  let defaultProps = {
    level: 0,
    levelPadding: 40,
    node: createNode(),
    // eslint-disable-next-line react/display-name
    renderNode: node => <div data-jest='node'>{node.name}</div>,
    classes: {},
    subnodeField: 'subs',
    isSelected: () => false,
  }

  it('should render component', () => {
    const component = shallow(<TreeNode {...defaultProps} />)
    expect(component.find('[data-jest="node"]')).toHaveLength(1)
  })

  it('should indent properly', () => {
    const props = {
      ...defaultProps,
      level: 2,
      levelPadding: 20,
    }
    const component = shallow(<TreeNode {...props} />)
    expect(component.find(Spacer).first().prop('width')).toBe(
      props.level * props.levelPadding + 'px'
    )
  })

  it('should render children', () => {
    const props = {
      ...defaultProps,
      defaultExpanded: true,
      node: createNode([createNode(), createNode()]),
    }

    const component = shallow(<TreeNode {...props} />)
    expect(component.find(TreeNode)).toHaveLength(props.node.subs.length)
  })

  it('should expand children', () => {
    const props = {
      ...defaultProps,
      node: createNode([createNode(), createNode()]),
    }

    const component = shallow(<TreeNode {...props} />)
    component.find('[data-jest="toggle"]').simulate('click')
    expect(component.find(TreeNode)).toHaveLength(props.node.subs.length)
  })
})
