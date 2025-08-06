import { useCallback, useEffect } from 'react'

import {
  Text,
  useColorMode,
} from '@chakra-ui/react'
import { useStepperContext } from '@saas-ui/react'

import { OnboardingStep } from './onboarding-step'
import { appearanceSchema } from './schema/appearance.schema'



export function AppearanceStep() {
  const stepper = useStepperContext()
  const { setColorMode } = useColorMode()

  // Automatically set light mode
  useEffect(() => {
    setColorMode('light')
  }, [setColorMode])

  const handleSubmit = useCallback(async () => {
    stepper.nextStep()
  }, [stepper])

  return (
    <OnboardingStep
      schema={appearanceSchema}
      title="Setup complete!"
      description=""
      defaultValues={{}}
      onSubmit={handleSubmit}
      submitLabel="Continue"
    >
      <Text textAlign="center" color="gray.600">Your workspace is configured for the best experience.</Text>
    </OnboardingStep>
  )
}
