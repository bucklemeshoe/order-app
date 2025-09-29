import { ApiCheck, AssertionBuilder } from '@checkly/cli'

// Supabase Health Check
new ApiCheck('supabase-health', {
  name: 'Supabase Database Health Check',
  alertChannels: [],
  request: {
    method: 'GET',
    url: '{{SUPABASE_URL}}/rest/v1/',
    followRedirects: true,
    skipSSL: false,
    headers: [
      {
        key: 'apikey',
        value: '{{SUPABASE_ANON_KEY}}',
      },
    ],
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.responseTime().lessThan(3000),
    ],
  },
})

// Supabase Auth Health Check
new ApiCheck('supabase-auth-health', {
  name: 'Supabase Auth Health Check',
  alertChannels: [],
  request: {
    method: 'GET',
    url: '{{SUPABASE_URL}}/auth/v1/health',
    followRedirects: true,
    skipSSL: false,
    headers: [
      {
        key: 'apikey',
        value: '{{SUPABASE_ANON_KEY}}',
      },
    ],
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.jsonBody('status').equals('ok'),
    ],
  },
})

// Supabase Edge Functions Health Check
new ApiCheck('supabase-functions-health', {
  name: 'Supabase Edge Functions Health Check',
  alertChannels: [],
  request: {
    method: 'GET',
    url: '{{SUPABASE_URL}}/functions/v1/health',
    followRedirects: true,
    skipSSL: false,
    headers: [
      {
        key: 'apikey',
        value: '{{SUPABASE_ANON_KEY}}',
      },
    ],
    assertions: [
      AssertionBuilder.statusCode().equals(200),
      AssertionBuilder.responseTime().lessThan(5000),
    ],
  },
})
