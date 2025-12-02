(async () => {
  const { faker } = await import('@faker-js/faker');

  const PROXY_USERNAME = 'd7ddd6e520257dcceaaa';
  const PROXY_PASSWORD = '5c5ee764922cde9f';
  const PROXY_HOST = 'gw.dataimpulse.com';
  const PROXY_PORT = '823';

  const axios = require('axios');
  const HttpsProxyAgent = require('https-proxy-agent');

  async function registerUser() {
    console.log('[+] Starting user registration process');

    // Generate email
    const firstName = faker.name.firstName().toLowerCase();
    const lastName = faker.name.lastName().toLowerCase();
    const email = `${firstName}${lastName}@gmail.com`;
    console.log(`[+] Generated email: ${email}`);

    // Configure proxy agent
    const proxyAgent = new HttpsProxyAgent({
      host: PROXY_HOST,
      port: PROXY_PORT,
      auth: `${PROXY_USERNAME}:${PROXY_PASSWORD}`
    });
    console.log('[+] Proxy agent configured');

    try {
      console.log('[+] Sending registration request');

      // Send registration request
      const response = await axios.post(
        'https://ttj01.com/common/register/pwd',
        {
          code: "",
          email_code: "",
          referrer_code: "26PZAIW",
          email: email,
          login_pwd: "Raph@11",
          login_pwd_confirm: "Raph@11"
        },
        {
          headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
            "authorization": "dg+lhA2X3aTn190WSE9zIJxTB6oWdQ/NvOMt4kHHE06wJH1LRnd7NqHUbDIz5mhmvO+h9X5/y80SNlnHHiqC1azzZSQsOsd9wnYAufgCObXdTchQNWjoandAIKXIqkob",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "lang": "en",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "\"Android\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "time": "1764679110002",
            "Referer": "https://ttj01.com/register?invite=26PZAIW",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          httpAgent: proxyAgent,
          httpsAgent: proxyAgent
        }
      );

      console.log('[+] Registration successful');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('[!] Registration failed');
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  }

  registerUser();
})();