const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');
module.exports = function(configData) {
  let allTags = [];
  const postDir = path.join(__dirname, '..', 'post');

  // get by "src/post/*/**/*.md"
  const postFiles = glob.sync(path.join(postDir, '**/*.md'));

  postFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');

    // get tags from yaml part
    const yamlMatch = content.match(/^---([\s\S]*?)---/);
    if (!yamlMatch) {
      return;
    }
    const yamlStr = yamlMatch[1];

    // parse yaml
    const yamlData = yaml.safeLoad(yamlStr);
    if (!yamlData) {
      return;
    }

    const tags = yamlData.tags;
    if (!tags) {
      return;
    }

    tags.forEach((tag) => {
      if (!allTags.includes(tag)) {
        allTags.push(tag);
      }
    });
  });

  // TODO
  return allTags

  return ["minecraft", "docker", "aws"]
};
