import { extendTheme } from '@chakra-ui/react'
import {
  theme as baseTheme,
  /* withColorScheme */
} from '@saas-ui-pro/react'

// import { theme as glassTheme } from '@saas-ui-pro/theme-glass'
import { components } from './components'
import { semanticTokens } from './foundations/semantic-tokens'

// import colorScheme from './color-schemes/galaxy'
// import colorScheme from './color-schemes/earth'

export const theme = extendTheme(
  {
    colors: {
      primary: {
        50: '#f0edff',
        100: '#d4cbff',
        200: '#b8a8ff',
        300: '#9b85ff',
        400: '#7f62ff',
        500: '#4e40ef',
        600: '#3e33bf',
        700: '#2e268f',
        800: '#1f1a5f',
        900: '#0f0d2f',
      },
    },
    semanticTokens,
    components,
  },
  /**
   * Uncomment this to use any of the built-in color schemes.
   */
  // withColorScheme(colorScheme),
  // glassTheme,
  baseTheme,
)
