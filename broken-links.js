'use strict';
const blc = require('broken-link-checker');
const StaticServer = require('static-server');

const includeExternal = process.argv[2] === 'all';

var server = new StaticServer({
  rootPath: './dist',
  host: 'localhost',
  port: '8081'
});

server.start(() => {
  let results = {}, count = 0;

  let siteChecker = new blc.SiteChecker({
    filterLevel: 2,
    excludeExternalLinks: !includeExternal,
    maxSocketsPerHost: includeExternal ? 2 : Infinity,
  }, {
    link: result => {
      if (result.broken) {
        results[result.url.original] = results[result.url.original] || [];
        results[result.url.original].push(result);
      }
      ++count % 10 || process.stdout.write('.');
    },
    end: () => {
      console.log('DONE');
      let length = Math.max.apply(Math, Object.keys(results).map(r => r.length)) + 3;
      let broken = Object.keys(results).length;
      for (let url in results) {
        console.log(`${url}${' '.repeat(length - url.length)}${blc[results[url][0].brokenReason]}`);
        results[url].forEach((result, i, results) => console.log(` ${i === results.length - 1 ? '└' : '├'}╴${result.base.original}`));
      }
      console.log(`${broken} broken files (${count} links checked)`);
      process.exit(broken === 0 ? 0 : 1);
    }
  });

  siteChecker.enqueue(`http://localhost:${server.port}/`);
});
