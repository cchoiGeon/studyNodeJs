module.exports = {
  html:function(title, list, body,control){ // body가 아닌 description으로 받을 수도 있지만 페이지의 형태에 따라 제목과 설명이 있는 형식이 아닐 수도 있어 body를 수동적으로 바꿔야 하므로 description이 아닌 body로 씀
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body} 
    </body>
    </html>
    `;
  },list: function(filelist){ // 나는 변수에 익명 함수를 저장하는 식으로 했는데 그러면 헷갈릴 수 있으니 예제처럼 함수를 먼저 정의한 다음에 변수에 저장해서 여러 변수로 쓸 수 있게끔 만들자
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){ // 자바스크립트 공부할 때 자주 나왔던 코드니 외워두기 !!
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i +=1;
    }
    list += '</ul>';
    return list;
  }
}
