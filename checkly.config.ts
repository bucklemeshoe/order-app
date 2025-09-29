import { defineConfig } from '@checkly/cli'

export default defineConfig({
  projectName: 'Order App Health Checks',
  logicalId: 'order-app-health-checks',
  repoUrl: 'https://github.com/bucklemeshoe/order-app',
  checks: {
    locations: ['us-east-1', 'us-west-2', 'eu-west-1'],
    tags: ['order-app'],
    runtimeId: '2023.09',
    checkMatch: '**/__checks__/**/*.check.ts',
    browserChecks: {
      testMatch: '**/__checks__/**/*.spec.ts',
    },
  },
  cli: {
    runLocation: 'us-east-1',
    privateRun: true,
  },
})
