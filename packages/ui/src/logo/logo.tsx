import { Box, FlexProps, HTMLChakraProps, Image } from '@chakra-ui/react'

export const Logo = (props: FlexProps) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" {...props}>
      <Image src="/img/onboarding/logo.png" alt="Logo" width="60px" height="auto" />
    </Box>
  )
}

export const LogoIcon = (props: HTMLChakraProps<'svg'>) => {
  return (
    // logo
    <Box display="flex" justifyContent="center" alignItems="center" {...props}>
      <Image src="/img/onboarding/logo.png" alt="Logo" boxSize="4" />
    </Box>
  )
}
