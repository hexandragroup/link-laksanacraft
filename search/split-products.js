const fs = require("fs");

const inputFile = "products.json";
const outputDir = "data";
const chunkSize = 5; // berapa item per file

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const all = JSON.parse(fs.readFileSync(inputFile, "utf8"));
let part = 1;

for (let i = 0; i < all.length; i += chunkSize) {
  const chunk = all.slice(i, i + chunkSize);
  const filename = `${outputDir}/products${part}.json`;
  fs.writeFileSync(filename, JSON.stringify(chunk, null, 2));
  console.log(`✅ Created ${filename} (${chunk.length} items)`);
  part++;
}

console.log("🎉 Split complete!");
