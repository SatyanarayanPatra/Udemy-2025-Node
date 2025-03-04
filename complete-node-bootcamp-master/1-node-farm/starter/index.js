const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const { replaceTemplate } = require('./modules/replaceTemplate');
/////////////////////////////////////////////////////////////////////
//// File System
// Blocking synchronous way :
// const textIn = fs.readFileSync('./txt/input.txt', "utf8");
// console.log(textIn);
//
// console.log(`This is what we know about avocado ${textIn}`);
// const textOut = `This is what we know about avocado ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('Writing the output');

// Non blocking asynchronous way 🥑
/*
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
	if (err) {
		return console.error('Error reading start.txt:', err);
	}
	fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
		if (err) {
			return console.error(`Error reading ${data1}.txt:`, err);
		}
		fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
			if (err) {
				return console.error('Error reading append.txt:', err);
			}
			fs.writeFile('./txt/final.txt', `${data2} \n${data3}`, (err) => {
				if (err) {
					return console.error('Error writing final.txt:', err);
				}
				console.log('Data is written successfully 😁');
			});
		});
	});
});

console.log('will read file'); 
*/

/////////////////////////////////////////////////////////////////////
//// HTTPS:


const data = fs.readFileSync('./dev-data/data.json');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));

const tempOverView = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	'utf-8'
);
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	'utf-8'
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	'utf-8'
);

const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true);

	// const pathname = req.url;

	// Overview Page
	if (pathname === '/' || pathname === '/overview') {
		const cardsHTML = dataObj
			.map((el) => replaceTemplate(tempCard, el))
			.join('');
		const output = tempOverView.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
		res.writeHead(200, { 'content-type': 'text/html' });
		res.end(output);

		// Product Page
	} else if (pathname === '/product') {
		const product = dataObj[query.id];
		const output = replaceTemplate(tempProduct, product);
		res.writeHead(200, { 'content-type': 'text/html' });
		res.end(output);

		// API
	} else if (pathname === '/api') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(data);
		// Not Found
	} else {
		res.writeHead(404, {
			'Content-Type': 'text/html',
			'my-own-header': 'hello world',
		});
		res.end('<h1>404- Page Not Found</h1>');
	}
});

server.listen(8080, () => {
	console.log('Server is running on port 8080');
});
