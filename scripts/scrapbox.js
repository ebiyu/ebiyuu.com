const { parse } = require("@progfay/scrapbox-parser");
const { pageToMarkdown, getImages } = require("./pageToMarkdown");
const { createNewPost } = require("./new-post");
//const fetch = require("node-fetch");
const fs = require("fs");

async function main() {
  if (process.argv.length != 4) {
    console.log("usage: yarn from-scrapbox <url> <slug>");
    process.exit();
  }

  const url = process.argv[2];
  const slug = process.argv[3];

  const apiUrl =
    url.replace("https://scrapbox.io/", "https://scrapbox.io/api/pages/") +
    "/text";

  const res = await fetch(apiUrl);
  const text = await res.text();
  console.log(text);

  const parsed = parse(text);
  console.log(parsed);
  console.log(JSON.stringify(parsed));

  const markdown = pageToMarkdown(parsed);
  console.log(markdown);
  const images = getImages();
  console.log(images);

  const title = parsed.filter((block) => block.type === "title")[0]?.text;

  const postDir = createNewPost(slug, markdown, title);

  // Fetch images
  // {"type":"image","raw":"[https://scrapbox.io/files/656efb402fbaab0024acd1b7.png]","src":"https://scrapbox.io/files/656efb402fbaab0024acd1b7.png","link":""}
  for (const image of images) {
    const res = await fetch("https://scrapbox.io/files/" + image, {
      redirect: "follow",
    });
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageDir = `${postDir}/img`;
    const path = `${imageDir}/${image}`;
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true }, (err, folder) => {
        if (err) throw err;
        console.log(folder);
      });
    }

    fs.writeFileSync(path, buffer);
  }
}
if (require.main !== module) {
  return;
}
main();
