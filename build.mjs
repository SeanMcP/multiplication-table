import fs from "fs";

const SIZE = 10;

let inputs = ``;
const rows = {};
const columns = {};

const ids = [];

for (let x = 0; x <= SIZE; x++) {
  for (let y = 0; y <= SIZE; y++) {
    if (x === 0 && y === 0) {
      inputs += "<span>✖</span>";
    } else if (x === 0) {
      inputs += `<span>${y}</span>`;
    } else if (y === 0) {
      inputs += `<span>${x}</span>`;
    } else {
      const id = `${x}x${y}`;

      if (!rows[x]) rows[x] = [];
      rows[x].push(id);

      if (!columns[y]) columns[y] = [];
      columns[y].push(id);

      ids.push(id);

      const product = x * y;
      inputs += `<input name="${id}" pattern="^${product}$" required size="${
        String(product).length
      }" />\n`;
    }
  }
}

let selectors = ``;
const styles = `background-color: var(--complete, gold);`;

const winner = `body${ids
  .map((id) => `:has(input[name="${id}"]:valid)`)
  .join("")}`;

selectors += `${winner} {
    background-color: var(--winner);
}

${winner} .confetti {
    --confetti-display: flex;
}\n`;

Object.entries(rows).forEach(([key, value]) => {
  let selector = `.grid`;
  value.forEach((id) => {
    selector += `:has(input[name="${id}"]:valid)`;
  });
  selector += ` [name^="${key}x"] { ${styles} }\n`;
  selectors += selector;
});

Object.entries(columns).forEach(([key, value]) => {
  let selector = `.grid`;
  value.forEach((id) => {
    selector += `:has(input[name="${id}"]:valid)`;
  });
  selector += ` [name$="x${key}"] { ${styles} }\n`;
  selectors += selector;
});

fs.writeFileSync("selectors.css", "/** GENERATED FILE: DO NOT EDIT DIRECTLY */\n" + selectors);

const gridSize = SIZE + 1;

const template = fs.readFileSync(".template.html", "utf8");
const html = template
  .replace("<!-- INPUTS -->", inputs)
  .replace("/** GRID_STYLE */", `--grid-size: ${gridSize};`);
fs.writeFileSync("index.html", "<!-- GENERATED FILE: DO NOT EDIT DIRECTLY -->\n" + html);
