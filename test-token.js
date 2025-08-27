import https from 'https';

// 注意：这个脚本仅用于测试，不会保存或分享您的令牌
const token = process.argv[2];

if (!token) {
  console.error('请提供GitHub令牌作为命令行参数');
  process.exit(1);
}

const options = {
  hostname: 'api.github.com',
  path: '/user',
  method: 'GET',
  headers: {
    'Authorization': `token ${token}`,
    'User-Agent': 'GitHub Token Tester'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ 令牌有效！可以访问GitHub API。');
      try {
        const userData = JSON.parse(data);
        console.log(`访问的用户: ${userData.login}`);
      } catch (e) {
        console.log('但无法解析响应数据');
      }
    } else if (res.statusCode === 401) {
      console.error('❌ 令牌无效或已过期。');
    } else {
      console.error(`❌ 测试失败，HTTP状态码: ${res.statusCode}`);
      console.error('响应:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ 请求发生错误:', e.message);
});

req.end();