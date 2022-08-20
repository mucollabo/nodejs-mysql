const db = require('./db');
const template = require('./template');
const url = require('url'); 
const URLSearchParams = require('url-search-params');
const sanitizeHtml = require('sanitize-html');

exports.home = (request, response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        const title = 'Welcome';
        const description = 'Hello, Node.js';
        const list = template.list(topics);
        const html = template.HTML(sanitizeHtml(title), sanitizeHtml(list),
            `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(description)}`,
            `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
    });
}

exports.page = (request,response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if(error) {
            throw error;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], (error2, topic) => {
            if(error2) {
                throw error2;
            }
            const title = topic[0].title;
            const description = topic[0].description;
            const list = template.list(topics);
            const html = template.HTML(sanitizeHtml(title), sanitizeHtml(list),
                `<h2>${sanitizeHtml(title)}</h2>
                ${sanitizeHtml(description)}
                <p>by ${sanitizeHtml(topic[0].name)}</p>`,
                `<a href="/create">create</a>
                    <a href="/update?id=${queryData.id}">update</a>
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <input type="submit" value="delete">
                    </form>`
                );
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create = (request, response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        db.query('SELECT * FROM author', (error2, authors) => {
            const title = 'Create';
            const list = template.list(topics);
            const html = template.HTML(sanitizeHtml(title), sanitizeHtml(list), `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        ${template.authorSelect(authors)}
                    </p>
                    <p>
                        <input type="submit" value="create">
                    </p>
                </form>
                `,
                `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        })
    });
}

exports.create_process = (request, response) => {
    let body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            const post = new URLSearchParams(body);
            db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
                [post.get('title'), post.get('description'), post.get('author')],
                (error, result) => {
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302, {Location: `/?id=${result.insertId}`});
                    response.end();
                }
            );
        });
}

exports.update = (request, response) => {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic', (error, topics) => {
        if(error) {
            throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (error2, topic) => {
            if(error2) {
                throw error2;
            }
            db.query('SELECT * FROM author', (error2, authors) => {
                const list = template.list(topics);
                const html = template.HTML(sanitizeHtml(topic[0].title), list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}">
                        <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
                        </p>
                        <p>
                            ${template.authorSelect(authors, topic[0].author_id)}
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${topic[0].title}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.update_process = (request, response) => {
    let body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            const post = new URLSearchParams(body);
            db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?',
                [post.get('title'), post.get('description'), post.get('author'), post.get('id')], (error, result) => {
                response.writeHead(302, {Location: `/?id=${post.get('id')}`});
                response.end();
            });
        });
}

exports.delete_process = (request, response) => {
    let body = '';
        request.on('data', (data) => {
            body = body + data;
        });
        request.on('end', () => {
            const post = new URLSearchParams(body);
            db.query('DELETE FROM topic WHERE id=?', [post.get('id')], (error, result) => {
                if(error) {
                    throw error;
                }
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });
}
