(async () => {
  const { faker } = await import('@faker-js/faker');

  const PROXY_USERNAME = 'd7ddd6e520257dcceaaa';
  const PROXY_PASSWORD = '5c5ee764922cde9f';
  const PROXY_HOST = 'gw.dataimpulse.com';
  const PROXY_PORT = '823';

  const axios = require('axios');
  const {HttpsProxyAgent} = require('https-proxy-agent');
  const fs = require('fs').promises;

  const TOTAL_ACCOUNTS = 1;
  const CONCURRENT_LIMIT = 1;

  // Generate random user agent
  function getRandomUserAgent() {
    const browsers = ['Chrome', 'Edge', 'Firefox', 'Safari'];
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const version = Math.floor(Math.random() * 30) + 100;
    
    if (browser === 'Firefox') {
      return `Mozilla/5.0 (Android ${Math.floor(Math.random() * 5) + 10}; Mobile) Gecko/${version}.0 Firefox/${version}.0`;
    }
    return `Mozilla/5.0 (Linux; Android ${Math.floor(Math.random() * 5) + 10}) AppleWebKit/537.36 (KHTML, like Gecko) ${browser}/${version}.0.0.0 Mobile Safari/537.36`;
  }

  // Generate random delay
  function randomDelay(min = 1000, max = 3000) {
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));
  }

  async function registerUser(index) {
    const email = `${faker.person.firstName().toLowerCase()}${faker.person.lastName().toLowerCase()}@gmail.com`;
    const userAgent = getRandomUserAgent();
    const timestamp = Date.now().toString();

    // Configure proxy agent
    const proxyUrl = `http://${PROXY_USERNAME}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;
    const proxyAgent = new HttpsProxyAgent(proxyUrl);

    try {
      console.log(`[+] [${index}] Registering: ${email}`);

      // Random delay before request
      await randomDelay(500, 2000);

      // Send registration request
      const response = await axios.post(
        'https://ttj01.com/common/register/pwd',
        {
          code: "",
          email_code: "",
          referrer_code: "644HE4W",
          email: email,
          login_pwd: "Raph@11",
          login_pwd_confirm: "Raph@11"
        },
        {
          headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
            "cache-control": "no-cache",
            "content-type": "application/json",
            "lang": "en",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "sec-ch-ua": `"Not A(Brand";v="8", "Chromium";v="${Math.floor(Math.random() * 10) + 120}", "Microsoft Edge";v="${Math.floor(Math.random() * 10) + 120}"`,
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "\"Android\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "time": timestamp,
            "user-agent": userAgent,
            "Referer": "https://ttj01.com/register?invite=644HE4W",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          httpAgent: proxyAgent,
          httpsAgent: proxyAgent,
          timeout: 30000
        }
      );

      console.log(`[+] [${index}] Success: ${email}`);
      
      // Save to acc.txt
      const accountInfo = `${email}:Raph@11\n`;
      await fs.appendFile('acc.txt', accountInfo, 'utf8');
      
      return { success: true, email, data: response.data };
    } catch (error) {
      console.error(`[!] [${index}] Failed: ${email}`);
      if (error.response) {
        console.error(`    Status: ${error.response.status}, Data:`, error.response.data);
      } else {
        console.error(`    Error: ${error.message}`);
      }
      return { success: false, email, error: error.message };
    }
  }

  // Main execution
  async function main() {
    console.log(`[+] Starting bulk registration: ${TOTAL_ACCOUNTS} accounts with ${CONCURRENT_LIMIT} concurrent`);
    
    // Initialize acc.txt file
    await fs.writeFile('acc.txt', '', 'utf8');
    console.log('[+] Initialized acc.txt file');
    
    const results = {
      total: TOTAL_ACCOUNTS,
      successful: 0,
      failed: 0,
      accounts: []
    };

    // Process in batches
    for (let i = 0; i < TOTAL_ACCOUNTS; i += CONCURRENT_LIMIT) {
      const batch = [];
      const batchSize = Math.min(CONCURRENT_LIMIT, TOTAL_ACCOUNTS - i);
      
      console.log(`\n[+] Processing batch ${Math.floor(i / CONCURRENT_LIMIT) + 1}/${Math.ceil(TOTAL_ACCOUNTS / CONCURRENT_LIMIT)}`);
      
      for (let j = 0; j < batchSize; j++) {
        batch.push(registerUser(i + j + 1));
      }

      const batchResults = await Promise.all(batch);
      
      batchResults.forEach(result => {
        if (result.success) {
          results.successful++;
          results.accounts.push(result.email);
        } else {
          results.failed++;
        }
      });

      // Delay between batches
      if (i + CONCURRENT_LIMIT < TOTAL_ACCOUNTS) {
        console.log(`[+] Waiting before next batch...`);
        await randomDelay(3000, 5000);
      }
    }

    console.log('\n[+] Registration complete!');
    console.log(`    Total: ${results.total}`);
    console.log(`    Successful: ${results.successful}`);
    console.log(`    Failed: ${results.failed}`);
    console.log('\n[+] Successful accounts saved to acc.txt');
    results.accounts.forEach(email => console.log(`    - ${email}`));
  }

  main();
})();