export default {
  stories: [
    {
      directory: '../../',
      files: '*/!(node_modules)/**/*.@(stories.@(tsx))',
    },
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-toolbars',
    '@storybook/addon-viewport',
    '@storybook/addon-controls',
    '@saas-ui/storybook-addon',
    '@chromatic-com/storybook',
  ],
  staticDirs: ['./static'],
  typescript: {
    reactDocgen: false,
  },
  refs: () => {
    const refs = {
      '@chakra-ui/react': {
        disable: true, // Make sure Chakra gets loaded last
      },

      chakra: {
        title: 'Chakra UI',
        url: 'https://storybook.chakra-ui.com',
      },
    }
    return {
      '@saas-ui-pro/react': {
        title: 'Slowpreneur Pro',
        url: 'https://storybook.saas-ui.pro/',
      },
      '@saas-ui/react': {
        title: 'Slowpreneur',
        url: 'https://storybook.saas-ui.dev/',
      },
      ...refs,
    }
  },
  framework: {
    name: '@storybook/react-vite',
  },
  docs: {},
}
