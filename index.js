(async () => {
  const { faker } = await import('@faker-js/faker');

  const PROXY_USERNAME = 'd7ddd6e520257dcceaaa';
  const PROXY_PASSWORD = '5c5ee764922cde9f';
  const PROXY_HOST = 'gw.dataimpulse.com';
  const PROXY_PORT = '823';

  const axios = require('axios');
  const {HttpsProxyAgent} = require('https-proxy-agent');
  const fs = require('fs').promises;
  const CryptoJS = require('crypto-js');

  const TOTAL_ACCOUNTS = 1;
  const CONCURRENT_LIMIT = 1;

  // Encryption keys
  const KEY1 = 'J8gD4uKpT2rV9ZbQ';
  const KEY2 = 'L1hW7gFqP3kM0VbY';

  // Encryption function
  function encrypt(data) {
    const key = CryptoJS.enc.Utf8.parse(KEY1);
    const iv = CryptoJS.enc.Utf8.parse(KEY2);
    const dataStr = typeof data !== 'string' ? JSON.stringify(data) : data;
    const encrypted = CryptoJS.AES.encrypt(dataStr, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  // Generate authorization header
  function generateAuthHeader(authInfo, uid, deviceId, referrerCode) {
    const time = Date.now();
    const info = {
      uid: uid || '',
      token: authInfo || '',
      time: time,
      device_id: deviceId || '',
      referrer_code: referrerCode || ''
    };
    return {
      authorization: encrypt(info),
      time: time.toString()
    };
  }

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

  async function loginUser(email, password, userAgent, proxyAgent, index, deviceId, referrerCode) {
    try {
      console.log(`[+] [${index}] Logging in: ${email}`);
      
      await randomDelay(500, 1500);

      const authHeader = generateAuthHeader('', '', deviceId, referrerCode);
      
      const loginResponse = await axios.post(
        'https://ttj01.com/common/login/pwd',
        {
          email: email,
          login_pwd: password
        },
        {
          headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
            "authorization": authHeader.authorization,
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
            "time": authHeader.time,
            "user-agent": userAgent,
            "Referer": "https://ttj01.com/login",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          httpAgent: proxyAgent,
          httpsAgent: proxyAgent,
          timeout: 30000
        }
      );

      console.log(`[+] [${index}] Login successful: ${email}`);
      return loginResponse.data;
    } catch (error) {
      console.error(`[!] [${index}] Login failed: ${email}`);
      if (error.response) {
        console.error(`    Status: ${error.response.status}, Data:`, error.response.data);
      } else {
        console.error(`    Error: ${error.message}`);
      }
      throw error;
    }
  }

  async function createDeal(authInfo, uid, userAgent, proxyAgent, index, email, deviceId, referrerCode) {
    try {
      console.log(`[+] [${index}] Creating deal for: ${email}`);
      
      await randomDelay(500, 1500);

      const authHeader = generateAuthHeader(authInfo, uid, deviceId, referrerCode);
      
      const dealResponse = await axios.post(
        'https://ttj01.com/deal/load/create',
        {
          deal_id: 2,
          money: "10.00"
        },
        {
          headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
            "authorization": authHeader.authorization,
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
            "time": authHeader.time,
            "user-agent": userAgent,
            "Referer": "https://ttj01.com/deal/confirm",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          httpAgent: proxyAgent,
          httpsAgent: proxyAgent,
          timeout: 30000
        }
      );

      console.log(`[+] [${index}] Deal created successfully: ${email}`);
      return dealResponse.data;
    } catch (error) {
      console.error(`[!] [${index}] Deal creation failed: ${email}`);
      if (error.response) {
        console.error(`    Status: ${error.response.status}, Data:`, error.response.data);
      } else {
        console.error(`    Error: ${error.message}`);
      }
      throw error;
    }
  }

  async function registerUser(index) {
    const email = `${faker.person.firstName().toLowerCase()}${faker.person.lastName().toLowerCase()}@gmail.com`;
    const password = "Raph@11";
    const userAgent = getRandomUserAgent();
    const deviceId = faker.string.uuid();
    const referrerCode = "644HE4W";

    // Configure proxy agent
    const proxyUrl = `http://${PROXY_USERNAME}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;
    const proxyAgent = new HttpsProxyAgent(proxyUrl);

    try {
      console.log(`[+] [${index}] Registering: ${email}`);

      // Random delay before request
      await randomDelay(500, 2000);

      const authHeader = generateAuthHeader('', '', deviceId, referrerCode);

      // Send registration request
      const registerResponse = await axios.post(
        'https://ttj01.com/common/register/pwd',
        {
          code: "",
          email_code: "",
          referrer_code: referrerCode,
          email: email,
          login_pwd: password,
          login_pwd_confirm: password
        },
        {
          headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
            "authorization": authHeader.authorization,
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
            "time": authHeader.time,
            "user-agent": userAgent,
            "Referer": "https://ttj01.com/register?invite=644HE4W",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          httpAgent: proxyAgent,
          httpsAgent: proxyAgent,
          timeout: 30000
        }
      );


      console.log(`[+] [${index}] Registration successful: ${email}`);
      
      // Login after registration
      const loginData = await loginUser(email, password, userAgent, proxyAgent, index, deviceId, referrerCode);
      
      console.log(`[+] [${index}] Login response:`, JSON.stringify(loginData, null, 2));
      
      // Extract authorization info from login response
      if (!loginData || !loginData.auth_info || !loginData.user_info) {
        throw new Error('Invalid login response format');
      }
      
      const authInfo = loginData.auth_info;
      const uid = loginData.user_info.uid;
      
      // Create deal
      const dealData = await createDeal(authInfo, uid, userAgent, proxyAgent, index, email, deviceId, referrerCode);
      
      // Save to acc.txt
      const accountInfo = `${email}:${password}\n`;
      await fs.appendFile('acc.txt', accountInfo, 'utf8');
      
      return { success: true, email, registerData: registerResponse.data, loginData, dealData };
    } catch (error) {
      console.error(`[!] [${index}] Process failed for: ${email}`);
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