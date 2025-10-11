const https = require('https');
const http = require('http');
const { parse } = require('url');

// List of all your internal links to check
const linksToCheck = [
  'https://natureswaysoil.com/',
  'https://natureswaysoil.com/about',
  'https://natureswaysoil.com/products',
  'https://natureswaysoil.com/product/hay-fertilizer',
  'https://natureswaysoil.com/product/humic-fulvic',
  'https://natureswaysoil.com/product/biochar-soil',
  'https://natureswaysoil.com/product/hydroponic-organic',
  'https://natureswaysoil.com/product/living-compost',
  'https://natureswaysoil.com/product/kelp-seaweed',
  'https://natureswaysoil.com/product/bone-meal-liquid',
  'https://natureswaysoil.com/product/dog-urine-lawn',
  'https://natureswaysoil.com/product/tomato-organic-fertilizer',
  // Add any other links you want to check
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const parsedUrl = parse(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
  
    const req = client.request({
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.path,
      method: 'HEAD',
      timeout: 5000
    }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        ok: res.statusCode >= 200 && res.statusCode < 400
      });
    });
  
    req.on('error', () => {
      resolve({
        url,
        status: 'ERROR',
        ok: false
      });
    });
  
    req.on('timeout', () => {
      resolve({
        url,
        status: 'TIMEOUT',
        ok: false
      });
    });
  
    req.end();
  });
}

async function checkAllLinks() {
  console.log('🔍 Checking all links...\n');

  const results = await Promise.all(linksToCheck.map(checkUrl));

  const brokenLinks = results.filter(result => !result.ok);
  const workingLinks = results.filter(result => result.ok);

  console.log('✅ Working Links:');
  workingLinks.forEach(link => {
    console.log(`  ${link.url} - ${link.status}`);
  });

  console.log('\n❌ Broken Links:');
  brokenLinks.forEach(link => {
    console.log(`  ${link.url} - ${link.status}`);
  });

  console.log(`\n📊 Summary: ${workingLinks.length} working, ${brokenLinks.length} broken`);

  return brokenLinks;
}

// Run the check
checkAllLinks().then(brokenLinks => {
  if (brokenLinks.length > 0) {
    console.log('\n🚨 Action Required: Fix the broken links above');
    process.exit(1);
  } else {
    console.log('\n🎉 All links are working!');
  }
});
