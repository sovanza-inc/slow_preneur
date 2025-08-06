import 'server-only'

import type { ApiAdapters } from '@acme/api'
import { createStripeAdapter } from '@acme/billing-stripe'

export const createAdapters = (): ApiAdapters => {
  return {
    billing: createStripeAdapter(),
  }
}
