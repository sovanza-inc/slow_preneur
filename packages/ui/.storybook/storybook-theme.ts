import { create } from '@storybook/theming'

// @ts-ignore
import brandImage from './storybook-logo.svg'

export default create({
  base: 'dark',
  brandTitle: 'Saas UI',
  brandUrl: 'https://slowpreneur.dev',
  brandImage,
})
