import fs from "fs";

const tableHTML = fs.readFileSync(".table.html", "utf8");
const indexHTML = fs.readFileSync(".index.html", "utf8");

function buildPage(SIZE) {
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

  const winner = `body:is(.DEVMODE, ${ids
    .map((id) => `:has(input[name="${id}"]:valid)`)
    .join("")})`;

  selectors += `${winner} {
    background-color: var(--winner);
}

${winner} .confetti {
    --confetti-display: flex;
}

${winner} .grid {
  opacity: 0.5;
}
`;

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

  fs.writeFileSync(
    `${SIZE}.css`,
    "/** GENERATED FILE: DO NOT EDIT DIRECTLY */\n" + selectors
  );

  const gridSize = SIZE + 1;

  const html = tableHTML
    .replace("%INPUTS%", inputs)
    .replace("%GRID_STYLE%", `--grid-size: ${gridSize};`)
    .replaceAll("%SIZE%", SIZE);
  fs.writeFileSync(
    `${SIZE}.html`,
    "<!-- GENERATED FILE: DO NOT EDIT DIRECTLY -->\n" + html
  );
}

let links = "";

for (let i = 1; i < 13; i++) {
  links += `<a href="${i}.html">${i} by ${i} table</a>`;
  buildPage(i);
}

const html = indexHTML.replace("%LINKS%", links);
fs.writeFileSync(
  "index.html",
  "<!-- GENERATED FILE: DO NOT EDIT DIRECTLY -->\n" + html
);
