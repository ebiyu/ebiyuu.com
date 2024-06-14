// Original: https://github.com/hogashi/sb2md/blob/main/src/pageToMarkdown.ts
// Modified by Yusuke Ebihara

// Original License:

// MIT License
//
// Copyright (c) 2022 Azuma Ikeda
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

let images = []; // Workaround. not good implementation.

const nodeToMarkdown = (node) => {
  if (node.type === "blank") {
    return node.text;
  }
  if (node.type === "code") {
    return `\`${node.text}\``;
  }
  if (node.type === "commandLine") {
    return `\`${node.raw}\``;
  }
  if (node.type === "decoration") {
    const prefix = "";
    const tags = [];
    node.decos.forEach((deco) => {
      if (deco[0] === "*") {
        const decoLevel = parseInt(deco.substring(2), 10);
        prefix.concat("#".repeat(Math.max(6 - decoLevel + 1, 1)));
        for (let i = 0; i < decoLevel - 6; i += 1) {
          tags.push("strong");
        }
      } else if (deco === "-") {
        tags.push("s");
      } else if (deco === "_") {
        tags.push("u");
      } else if (deco === "/") {
        tags.push("i");
      }
    });
    return node.nodes.map((childNode) => nodeToMarkdown(childNode)).join("");
  }
  if (node.type === "formula") {
    return `$$ ${node.formula} $$`;
  }
  if (node.type === "googleMap") {
    return node.url;
  }
  if (node.type === "hashTag") {
    return `[${node.raw}](${node.href})`;
  }
  if (node.type === "helpfeel") {
    return `\`? ${node.text}\``;
  }
  if (node.type === "icon") {
    return `(${node.path})`;
  }
  if (node.type === "image") {
    // replace image URLs
    const src = node.src.replace("https://scrapbox.io/files/", "");
    images.push(src);
    const img = `![img/${src}](img/${src})`;
    return node.link === "" ? img : `[${img}](${node.link})`;
  }
  if (node.type === "link") {
    const content = node.content === "" ? node.href : node.content;
    return `[${content}](${node.href})`;
  }
  if (node.type === "quote") {
    const content = node.nodes
      .map((childNode) => nodeToMarkdown(childNode))
      .join("\n");
    return `> ${content}`;
  }
  if (node.type === "strong") {
    const content = node.nodes
      .map((childNode) => nodeToMarkdown(childNode))
      .join("\n");
    return `<strong>${content}</strong>`;
  }
  if (node.type === "strongIcon") {
    return `<strong>(${node.path})</strong>`;
  }
  if (node.type === "strongImage") {
    return `![${node.src}](${node.src})`;
  }
  if (node.type === "numberList") {
    const content = node.nodes
      .map((childNode) => nodeToMarkdown(childNode))
      .join("\n");
    return `${node.number}. ${content}`;
  }
  // node.type === 'plain'
  return node.text;
};

const pageToMarkdown = (page) => {
  images = [];
  const lines = page.map((block) => {
    if (block.type === "title") {
      return `# ${block.text}`;
    }
    if (block.type === "codeBlock") {
      const headline = `\`\`\`${block.fileName}`;
      if (block.indent === 0) {
        return `${headline}\n${block.content}\n\`\`\``;
      }
      const indent = "  ".repeat(block.indent - 1);
      return [
        `${indent}- ${headline}`,
        `${block.content}\n\`\`\``
          .split("\n")
          .map((line) => `${indent}  ${line}`)
          .join("\n"),
      ];
    }
    if (block.type === "table") {
      const tableRows = block.cells.map((row) =>
        row.map((nodes) => {
          `| ${nodes.map((node) => nodeToMarkdown(node)).join(" | ")} |`;
        })
      );
      if (block.indent === 0) {
        return `${block.fileName}\n${tableRows.join("\n")}`;
      }
      const indent = "  ".repeat(block.indent - 1);
      return [
        `${indent}- ${block.fileName}`,
        tableRows.map((line) => `${indent}  ${line}`).join("\n"),
      ];
    }
    // block.type === 'line'
    const text = block.nodes.map((node) => nodeToMarkdown(node)).join("");
    if (block.indent === 0) {
      return text;
    }
    const indent = "  ".repeat(block.indent - 1);
    if (block.nodes[0].type === "numberList") {
      return `${indent}${text}`;
    }
    return `${indent}- ${text}`;
  });

  return lines.join("\n");
};

module.exports = { pageToMarkdown, getImages: () => images };
