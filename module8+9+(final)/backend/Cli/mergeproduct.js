import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// ES modules path resolution
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// folder path - read from backend/data/
const DATA_DIR = path.resolve(__dirname, "../data");
// output folder - write to root /data/
const OUTPUT_DIR = path.resolve(__dirname, "../../data");

// get filter from CLI
const args = process.argv.slice(2);
const filterArg = args.find(arg => arg.startsWith("--filter="));
const filterCategory = filterArg ? filterArg.split("=")[1] : null;

// read all JSON files
async function readFiles() {
  try {
    const files = await fs.readdir(DATA_DIR);

    const jsonFiles = files.filter(file => file.endsWith(".json"));

    const data = await Promise.all(
      jsonFiles.map(async file => {
        try {
          const content = await fs.readFile(
            path.join(DATA_DIR, file),
            "utf-8"
          );
          return JSON.parse(content);
        } catch (err) {
          console.error(` Error reading ${file}`);
          return [];
        }
      })
    );

    return data.flat();
  } catch (err) {
    console.error(" Folder read error");
    return [];
  }
}

// main logic
async function run() {
  let products = await readFiles();

  // filter
  if (filterCategory) {
    products = products.filter(
      p => p.category === filterCategory
    );
  }

  // summary
  const total = products.length;

  const categories = [...new Set(products.map(p => p.category))];

  const avgPrice =
    products.reduce((sum, p) => sum + p.price, 0) / (total || 1);

  // output merged file
  await fs.writeFile(
    path.join(OUTPUT_DIR, "products.json"),
    JSON.stringify(products, null, 2)
  );

  // console table
  console.log("\n SUMMARY");
  console.table({
    totalProducts: total,
    categories: categories.join(", "),
    avgPrice: avgPrice.toFixed(2)
  });

  console.log(" products.json generated");
}

run();