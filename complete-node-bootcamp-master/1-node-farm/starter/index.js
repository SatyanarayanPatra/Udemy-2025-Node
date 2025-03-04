const fs = require('fs');
const http = require('http');
const url = require('url');
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

const replaceTemplate = (temp, product) => {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%FROM%}/g, product.from);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	// output = output.replace(/{%NOT_ORGANIC%}/g, product.organic);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.id);
	if (!product.organic)
		output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
	return output;
};

const data = fs.readFileSync('./dev-data/data.json');
const dataObj = JSON.parse(data);

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
	console.log(url.parse(req.url, true));
	const pathName = req.url;

	// Overview Page
	if (pathName === '/' || pathName === '/overview') {
		const cardsHTML = dataObj
			.map((el) => replaceTemplate(tempCard, el))
			.join('');
		const output = tempOverView.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
		res.writeHead(200, { 'content-type': 'text/html' });
		res.end(output);

		// Product Page
	} else if (pathName === '/products') {
		res.writeHead(200, { 'content-type': 'text/html' });
		res.end(tempProduct);

		// API
	} else if (pathName === '/api') {
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
