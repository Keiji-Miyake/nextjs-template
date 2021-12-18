import React from 'react'
import HomePage from '../../pages'
import { render } from '../utils'

test('ホームページ', () => {
  const { container } = render(<HomePage />)
  expect(container).toMatchSnapshot()
})
