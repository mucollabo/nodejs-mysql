const db = require('./db');
const template = require('./template.js');
const URLSearchParams = require('url-search-params');
const url = require('url');
const sanitizeHtml = require('sanitize-html');

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
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="profile"></textarea>
                    </p>
                    <p>
                        <input type="submit" value="create">
                    </p>
                </form>
                `,
                ``
            );
            response.writeHead(200);
            response.end(html);
        });
        })
}

exports.create_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
        body = body + data;
    });
    request.on('end', () => {
        const post = new URLSearchParams(body);
        db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`,
            [post.get('name'), post.get('profile')],
            (error, result) => {
                if(error) {
                    throw error;
                };
                response.writeHead(302, {Location: `/author`});
                response.end();
            }
        );
    });
}

exports.update = (request, response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        db.query(`SELECT * FROM author`, (error2, authors) => {
            const _url = request.url;
            const queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], (error3, author) => {
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
                    <form action="/author/update_process" method="post">
                        <p>
                            <input type="hidden" name="id" value="${queryData.id}">
                        </p>
                        <p>
                            <input type="text" name="name" value="${sanitizeHtml(author[0].name)}" placeholder="name">
                        </p>
                        <p>
                            <textarea name="profile" placeholder="profile">${sanitizeHtml(author[0].profile)}</textarea>
                        </p>
                        <p>
                            <input type="submit" value="update">
                        </p>
                    </form>
                    `,
                    ``
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
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
            [post.get('name'), post.get('profile'), post.get('id')],
            (error, result) => {
                if(error) {
                    throw error;
                };
                response.writeHead(302, {Location: `/author`});
                response.end();
            }
        );
    });
}

exports.delete_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
        body = body + data;
    });
    request.on('end', () => {
        const post = new URLSearchParams(body);
        db.query(`DELETE FROM topic WHERE author_id=?`,
            [post.get('id')],
            (error1, result1) => {
                if(error1) {
                    throw error1;
                }
                db.query(`DELETE FROM author WHERE id=?`,
                    [post.get('id')],
                    (error, result) => {
                        if(error) {
                            throw error;
                        };
                        response.writeHead(302, {Location: `/author`});
                        response.end();
                    }
                );
            }
        );
    });
}
