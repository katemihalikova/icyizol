'use strict';

const Handlebars = require('handlebars');
const metalsmith = require('metalsmith');
const paths = require('metalsmith-paths');
const inPlace = require('metalsmith-in-place');
const markdown = require('metalsmith-markdown');
const marked = require('marked');
const layouts = require('metalsmith-layouts');
const sass = require('metalsmith-sass');
const serve = require('metalsmith-serve');
const watch = require('metalsmith-watch');

require('handlebars-helpers')();
Handlebars.registerHelper('string', String);
Handlebars.registerHelper('empty', arr => !arr || arr.length === 0);
Handlebars.registerHelper('price', price => String(price).replace(/(\d)(?=(\d{3})+$)/g, '$1 '));

let renderer = new marked.Renderer();
renderer.heading = function(text, level) {
  var escapedText = text
    .toLowerCase()
    .replace(/á/ig, 'a')
    .replace(/č/ig, 'c')
    .replace(/ď/ig, 'd')
    .replace(/[éě]/ig, 'e')
    .replace(/í/ig, 'i')
    .replace(/ň/ig, 'n')
    .replace(/ó/ig, 'o')
    .replace(/ř/ig, 'r')
    .replace(/š/ig, 's')
    .replace(/ť/ig, 't')
    .replace(/[ůú]/ig, 'u')
    .replace(/ý/ig, 'y')
    .replace(/ž/ig, 'z')
    .replace(/[^\w]+/g, '-');
  return '<h' + level + ' id="' + escapedText + '">' + text + '</h' + level + '>';
};

const isWatchMode = process.argv[2] === 'watch';

metalsmith(__dirname)
  .source('./src/')
  .destination('./dist/')
  .use(clear)
  .use(isWatchMode ? watchMode : noop)
  .use(inPlace({
    engine: 'handlebars',
    pattern: '**/*.@(html|md)',
    partials: './templates/',
  }))
  .use(markdown({
    renderer: renderer,
  }))
  .use(paths({
    property: 'path',
    directoryIndex: 'index.html',
  }))
  .use(fixPaths)
  .use(layouts({
    engine: 'handlebars',
    pattern: '**/*.html',
    directory: './templates/',
    partials: './templates/',
  }))
  .use(fixHtmlInMd)
  .use(sass({
    sourceMap: true,
    sourceMapContents: true,
  }))
  .use(isWatchMode ? serve() : noop)
  .use(isWatchMode ? watch({
    paths: {
      './src/**/*.!(scss|md)': true,
      './src/**/*.scss': '**/*.scss',
      './src/**/*.md': '**/*.@(html|md)',
      './templates/**/*': '**/*.@(html|md)',
    },
    livereload: true,
  }) : noop)
  .build(function(err) {
    if (err) {
      throw err;
    }
    console.log('[metalsmith-build] Build finished succesfully');
  });

function clear(files, metalsmith, done) {
  metalsmith.metadata({});
  done();
}

function fixPaths(files, metalsmith, done) {
  for (let file in files) {
    if (files[file].path) {
      for (let property in files[file].path) {
        files[file].path[property] = files[file].path[property].replace(/\\/g, '/');
      }
    }
  }
  done();
}

function fixHtmlInMd(files, metalsmith, done) {
  for (let file in files) {
    if (/\.html$/.test(file)) {
      files[file].contents = files[file].contents.toString('utf8').replace(/<!--|-->/g, '');
    }
  }
  done();
}

function watchMode(files, metalsmith, done) {
  metalsmith.metadata().watchMode = true;
  done();
}

function noop(files, metalsmith, done) {
  done();
}
