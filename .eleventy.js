module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/**/*.png");
  eleventyConfig.addPassthroughCopy("src/**/*.gif");
  eleventyConfig.addLayoutAlias("blog", "blog.njk");
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/post/*/**/*");
  });
  // Return your Object options:
  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };  
};
