import { ApiCheck, AssertionBuilder } from '@checkly/cli'

// Admin App Health Check
new ApiCheck('admin-app-health', {
  name: 'Admin App Health Check',
  alertChannels: [],
  request: {
    method: 'GET',
    url: '{{ADMIN_URL}}/health',
    followRedirects: true,
    skipSSL: false,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.responseTime().lessThan(5000),
    ],
  },
  setupScript: {
    entrypoint: 'admin-setup.ts',
  },
})

// Admin App Login Check
new ApiCheck('admin-login-check', {
  name: 'Admin Login Endpoint Check',
  alertChannels: [],
  request: {
    method: 'GET',
    url: '{{ADMIN_URL}}/login',
    followRedirects: true,
    skipSSL: false,
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.textBody().contains('login'),
    ],
  },
})

// Admin App API Health
new ApiCheck('admin-api-health', {
  name: 'Admin API Health Check',
  alertChannels: [],
  request: {
    method: 'GET',
    url: '{{ADMIN_URL}}/api/health',
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
