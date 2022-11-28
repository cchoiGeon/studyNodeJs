module.exports = {
  HTML:function(title, list, body, control){
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
  },list:function(topics){ // id 링크를 걸어주는 내용
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`; 
    // topics[i]라고만 하면 객체형태인 topics의 내용들을 호출할 수 없기 때문에 topics[i].id나 topics[i].title과 같이 프로퍼티를 가리켜 정확한 값을 불러온다
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },authorSelect:function(authors,author_id){
    var tag =``;
    var i = 0;
    while(i < authors.length){
      var selected = ``;
      if(authors[i].id===author_id){
        selected = ` selected`;
      }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`
      i++;
    }
    return `
    <select name='author'>
    ${tag}
    </select>
    `
  },authorTable:function(authors){
    var tag = `<table>`;
    var i = 0;
    while (i < authors.length){
        tag += `
            <tr>
                <td>${authors[i].name}</td>
                <td>${authors[i].profile}</td>
                <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                <td>
                  <form action="/author/delete_process" method="post">
                    <input type="hidden" name="id" value="${authors[i].id}">
                    <input type=submit value="delete">
                </td>
            </tr>
        `
        i++;
    }
    tag += `</table>`;
    return tag;
  }
}
