const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItLinkAttributes = require('markdown-it-link-attributes');
const faviconPlugin = require("eleventy-favicon");
const { format: formatDate } = require('date-fns');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginTOC = require('eleventy-plugin-toc')
const eleventyBacklinks = require("eleventy-plugin-backlinks");

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

  eleventyConfig.addPassthroughCopy("src/**/*.txt");

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
    .use(markdownItAnchor)
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

  eleventyConfig.addPlugin(pluginTOC);

  // When `eleventyExcludeFromCollections` is true, the file is not included in any collections
	eleventyConfig.addGlobalData("eleventyComputed.eleventyExcludeFromCollections", function() {
		return (data) => {
			// Always exclude from non-watch/serve builds
			if (data.draft) {
				return true;
			}

			return data.eleventyExcludeFromCollections;
		}
	});

  // backlink
  eleventyConfig.addPlugin(eleventyBacklinks, {
		folder: 'post'
  });


  // options
  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
