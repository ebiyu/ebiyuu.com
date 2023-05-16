const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItLinkAttributes = require('markdown-it-link-attributes');
const faviconPlugin = require("eleventy-favicon");
const { format: formatDate } = require('date-fns');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  // syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight);

  // favicon
  eleventyConfig.addPlugin(faviconPlugin, { destination: './dist' });

  // timestamp
  eleventyConfig.addGlobalData("builtAt", new Date());

  // image
  eleventyConfig.addPassthroughCopy("src/**/*.png");
  eleventyConfig.addPassthroughCopy("src/**/*.gif");

  // blog
  eleventyConfig.addLayoutAlias("blog", "blog.njk");
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/post/*/**/*").slice().reverse();
  });
  eleventyConfig.addCollection("recentPosts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/post/*/**/*").slice().reverse().slice(0, 5);
  });

  // filters
  eleventyConfig.addFilter("formatDate", (value) => formatDate(value, "yyyy/MM/dd"));
  eleventyConfig.addFilter("formatTime", (value) => formatDate(value, "yyyy/MM/dd HH:mm"));

  // markdown
  const mdOptions = {
    html: true,
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

  const markdownLibNoBlank = markdownIt(mdOptions)
    .use(markdownItAttrs).disable("code")

  eleventyConfig.addPairedShortcode(
    "markdownNoBlank",
    content => `<div class="md-block">${markdownLibNoBlank.render(content)}</div>`
  );

  // options
  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
