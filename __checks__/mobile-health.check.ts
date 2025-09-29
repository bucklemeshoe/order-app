import { ApiCheck, AssertionBuilder } from '@checkly/cli'

// Mobile App Health Check
new ApiCheck('mobile-app-health', {
  name: 'Mobile App Health Check',
  alertChannels: [],
  request: {
    method: 'GET',
    url: '{{MOBILE_URL}}/health',
    followRedirects: true,
    skipSSL: false,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.responseTime().lessThan(5000),
    ],
  },
})

// Mobile App Menu Check
new ApiCheck('mobile-menu-check', {
  name: 'Mobile Menu Endpoint Check',
  alertChannels: [],
  request: {
    method: 'GET',
    url: '{{MOBILE_URL}}/menu',
    followRedirects: true,
    skipSSL: false,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.textBody().contains('menu'),
    ],
  },
})

// Mobile App API Health
new ApiCheck('mobile-api-health', {
  name: 'Mobile API Health Check',
  alertChannels: [],
  request: {
    method: 'GET',
    url: '{{MOBILE_URL}}/api/health',
    followRedirects: true,
    skipSSL: false,
    headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
      },
    ],
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('status').equals('ok'),
    ],
  },
})
