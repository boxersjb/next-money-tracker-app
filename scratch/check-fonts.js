const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ url, statusCode: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, statusCode: 'ERROR', error: err.message });
    });
  });
}

async function run() {
  const results = await Promise.all([
    checkUrl('http://localhost:3000/_next/static/media/2c55a0e60120577a-s.0-dom-5bn10r2.woff2'),
    checkUrl('http://localhost:3000/_next/static/media/d598b2fbe51cc254-s.p.0i_3uaypf58iu.woff2'),
    checkUrl('http://localhost:3000/')
  ]);
  console.log(JSON.stringify(results, null, 2));
}

run();
