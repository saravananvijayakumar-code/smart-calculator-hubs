{
  "id": "smart-calculator-hub",
  "build": {
    "docker": {
      "bundle_source": false
    }
  },
  "deploy": {
    "env": {
      "prod": {
        "frontend": {
          "domain": "smartcalculatorhubs.com"
        },
        "cdn": {
          "cache_invalidation": {
            "enabled": true,
            "paths": ["/*"]
          }
        }
      }
    }
  },
  "global": {
    "cors": {
      "debug": true,
      "allow_headers_without_credentials": ["Authorization", "Content-Type", "Accept", "*"],
      "allow_headers_with_credentials": ["Authorization", "Content-Type", "Accept"],
      "allowed_origins_without_credentials": ["*"],
      "allowed_origins_with_credentials": [
        "https://www.smartcalculatorhubs.com",
        "https://smartcalculatorhubs.com",
        "https://smart-calculator-hub-d3409cs82vjl9890lfm0.lp.dev"
      ],
      "allow_origins_with_matching_patterns": true
    }
  }
}