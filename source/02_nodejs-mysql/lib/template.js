module.exports = {
    HTML:(title, list, body, control) => {
        return `
        <!doctype html>
        <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                <a href="/author">author</a>
                ${list}
                ${control}
                ${body}
            </body>
        </html>
        `;
    },
    list:(topics) => {
        let list = '<ul>';
        let i = 0;
        while(i < topics.length) {
            list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    },
    authorSelect:(authors, author_id) => {
        let tag = '';
        let i = 0;
        while(i < authors.length) {
            let selected = '';
            if(authors[i].id === author_id) {
                selected = ' selected';
            }
            tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
            i++;
        }
        return `
            <select name="author">
            ${tag}
            </select>
        `
    },
    authorTable:(authors) => {
        let tag = '<table>';
            let i = 0;
            while(i < authors.length) {
                tag += `
                    <tr>
                        <td>${authors[i].name}</td>
                        <td>${authors[i].profile}</td>
                        <td><a href="/author/update?id=${authors[i].id}">update</td>
                        <td>delete</td>
                    </tr>
                `;
                i++;
            }
            tag += '</table>';
            return tag;
    }
}
