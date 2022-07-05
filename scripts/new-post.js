const fs = require('fs');
const { exit } = require('process');

if (process.argv.length != 3) {
    console.log('usage: yarn new-post <slug>')
    process.exit();
}

// variables for file path
const slug = process.argv[2];
const year = (new Date()).getFullYear();
const month = ('0' + ((new Date()).getMonth() + 1)).slice(-2);
const day = ('0' + ((new Date()).getDate() )).slice(-2);
console.log(`Creating ${year}/${month}/${slug}.md`);

// year
const yearDir = `src/post/${year}`;
if (!fs.existsSync(yearDir)) {
  fs.mkdirSync(yearDir, (err, folder) => {
    if (err) throw err;
    console.log(folder);
  });
}

// month
const monthDir = yearDir + `/${month}`;
if (!fs.existsSync(monthDir)) {
  fs.mkdirSync(monthDir, (err, folder) => {
    if (err) throw err;
    console.log(folder);
  });
}

// file
const filePath = monthDir + `/${slug}.md`
if (fs.existsSync(filePath)) {
  console.log('Error: file already exists')
  process.exit();
}

// 書き込むデータ準備
const data = `---
layout: blog
title: ${slug}
date: ${year}-${month}-${day}
---



`

// 書き込み
fs.writeFile(filePath, data, (err) => {
  if (err) throw err;
  console.log('File created');
});