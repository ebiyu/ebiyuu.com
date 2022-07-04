const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItLinkAttributes = require('markdown-it-link-attributes');
const faviconPlugin = require("eleventy-favicon");
const { format: formatDate } = require('date-fns');

module.exports = function (eleventyConfig) {
  // favicon
  eleventyConfig.addPlugin(faviconPlugin, { destination: './dist' });

  // timestamp
  eleventyConfig.addGlobalData("builtAt", formatDate(new Date(), 'yyyy/MM/dd HH:mm'))

  // image
  eleventyConfig.addPassthroughCopy("src/**/*.png");
  eleventyConfig.addPassthroughCopy("src/**/*.gif");

  // blog
  eleventyConfig.addLayoutAlias("blog", "blog.njk");
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/post/*/**/*");
  });

  // markdown
  const mdOptions = {
    html: true,
    breaks: true,
    linkify: true,
  }
  const markdownLib = markdownIt(mdOptions)
    .use(markdownItAttrs).disable("code")
    .use(markdownItLinkAttributes, {
      attrs: {
        target: "_blank",
        rel: "noopener",
      }
    })
  eleventyConfig.setLibrary("md", markdownLib)

  // options
  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
