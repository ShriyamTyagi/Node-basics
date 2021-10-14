// const hello = "Hello World!";
// console.log(hello);

const fs = require("fs");
const http = require("http");
const url = require("url");

// const textInSystem = fs.readFileSync("./txt/input.txt", "utf-8");
// // fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
// //   console.log(data);
// // });
// // console.log("file read is: ");

// fs.writeFileSync("./txt/output.txt", textInSystem, "utf-8");

const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);

const productCard = fs.readFileSync(
  `${__dirname}/templates/product_card.html`,
  "utf-8"
);

const product = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const dataObj = JSON.parse(data);

const replaceTemplate = (template, item) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, item.productName);
  output = output.replace(/{%IMAGE%}/g, item.image);
  output = output.replace(/{%FROM%}/g, item.from);
  output = output.replace(/{%DESCRIPTION%}/g, item.description);
  output = output.replace(/{%NUTRIENTS%}/g, item.nutrients);
  output = output.replace(/{%QUANTITY%}/g, item.quantity);
  output = output.replace(/{%PRICE%}/g, item.price);
  output = output.replace(/{%ID%}/g, item.id);

  if (!item.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

const server = http.createServer((req, res) => {
  // const PathName = req.url;
  console.log(url.parse(req.url, true));

  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj.map((el) => replaceTemplate(productCard, el));

    const output = overview.replace(/{%PRODUCTCARDS%}/, cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    // res.end(`<h1>This is product ${query.id}</h1>`);
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const productDetail = replaceTemplate(product, dataObj[query.id]);

    res.end(productDetail);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page Not Found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
