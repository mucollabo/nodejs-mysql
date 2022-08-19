const db = require('./db');
const template = require('./template.js');

exports.home = (request, response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        db.query(`SELECT * FROM author`, (error2, authors) => {
            const title = 'author';
            const list = template.list(topics);
            const html = template.HTML(title, list,
                `
                ${template.authorTable(authors)}
                <style>
                    table {
                        border-collapse: collapse;
                    }
                    td {
                        border:1px solid black;
                    }
                </style>
                `,
                `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
        });
        })
}