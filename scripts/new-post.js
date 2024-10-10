const fs = require("fs");

function createNewPost(slug, markdown, title) {
  // variables for file path
  const year = new Date().getFullYear();
  const month = ("0" + (new Date().getMonth() + 1)).slice(-2);
  const day = ("0" + new Date().getDate()).slice(-2);
  console.log(`Creating ${year}/${month}/${slug}/index.md`);

  // dir
  const dir = `src/post/${year}/${month}/${slug}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }, (err, folder) => {
      if (err) throw err;
      console.log(folder);
    });
  }

  // file
  const filePath = dir + `/index.md`;
  if (fs.existsSync(filePath)) {
    console.log("Error: file already exists");
    process.exit();
  }

  // 書き込むデータ準備
  const data = `---
layout: blog
title: ${title || slug}
date: ${year}-${month}-${day}
---

${markdown}
`;

  // 書き込み
  fs.writeFile(filePath, data, (err) => {
    if (err) throw err;
    console.log("File created");
  });

  return dir;
}

if (require.main !== module) {
  module.exports = { createNewPost };
  return;
}

if (process.argv.length != 3) {
  console.log("usage: yarn new-post <slug>");
  process.exit();
}
createNewPost(process.argv[2], "");
