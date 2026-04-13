export interface ProxyEndpoint {
  url: string;
  method: string;
  injectSecret: (secret: string) => Record<string, string>;
}

export const PROXY_PROVIDERS: Record<string, Record<string, ProxyEndpoint>> = {
  openai: {
    'chat.completions': {
      url: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      injectSecret: (secret) => ({ 'Authorization': `Bearer ${secret}` })
    },
    'models.list': {
      url: 'https://api.openai.com/v1/models',
      method: 'GET',
      injectSecret: (secret) => ({ 'Authorization': `Bearer ${secret}` })
    }
  },
  stripe: {
    'customers.list': {
      url: 'https://api.stripe.com/v1/customers',
      method: 'GET',
      injectSecret: (secret) => ({ 'Authorization': `Bearer ${secret}` })
    },
    'checkout.sessions.create': {
      url: 'https://api.stripe.com/v1/checkout/sessions',
      method: 'POST',
      // Stripe typically expects form-encoded, but their API technically supports auth bearer headers
      // Usually stripe SDK uses auth. We just inject the header.
      injectSecret: (secret) => ({ 'Authorization': `Bearer ${secret}` })
    }
  },
  github: {
    'repos.list': {
      url: 'https://api.github.com/user/repos',
      method: 'GET',
      injectSecret: (secret) => ({ 
        'Authorization': `Bearer ${secret}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'PhantomAPI-Proxy'
      })
    }
  }
};
