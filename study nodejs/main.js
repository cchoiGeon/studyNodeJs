var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js')
var path = require('path');

var app = http.createServer(function(request,response){ // createServer 인수에 서버에서 요청을 받았을 때의 처리하는 함수를 작성한다 request = 요청한 값 response = 응답한 값  
    var _url = request.url;
    var queryData = url.parse(_url, true).query; //  쿼리는 /?id = CSS 일 때 {id : CSS} 와 같이 객체로 저장되는 형태이다 
    var pathname = url.parse(_url, true).pathname; // path는 /?id = CSS 전체를 의미한다 pathname은 쿼리 스트링을 제외한 경로 이름만 나타낸다
    var title = queryData.id;


    if(pathname === '/'){ // 루트라면 기존 코드를 실행 (루트 : 내가 정한 경로에 속해 있을 때) '/'는 내가 정한 루트 속에 접속하면 pathname 이 '/'가 출력됨
      if(title === undefined){ // title 즉 quertData.id가 정의되지 않았다는 것은 쿼리 스트링이 없다는 뜻으로 홈을 뜻한다.
        fs.readdir('./data',function(err, filelist){ // 기능이 실행되면 지정한 디렉터리에 있는 파일 목록이 filelist 변수에 저장된다.
          var title = 'Welcome'; // 홈 title 정하기 그냥 title을 사용하면 undefined가 뜨니까 바꿔주는 거임 
          var description = 'Hello, Node js';
          var list = template.list(filelist);
          var html = template.html(title,list,`<h2>${title}</h2><p>${description}</p>`,`<a href = "/create">create</a>`); // 홈에는 업데이트 필요 X/ 저번에 했던 코드에서 중복되는 코드들을 templateHTML함수로 묶어서 사용하는 것이다 함수를 변수로 정한다음 사용하는 것이다 
          response.writeHead(200); //response 객체의 메소드에서 헤더 정보를 응답에 작성해서 내보내는 것이다 200은 파일을 성공적으로 전송했다는 의미
          response.end(html);
        });
      }
      else{ // 홈이 아닐 때
        fs.readdir('./data',function(err, filelist){ // 기능이 실행되면 지정한 디렉터리에 있는 파일 목록이 filelist 변수에 저장된다.
          var filteredId= path.parse(queryData.id).base; // filteredId라는 변수에 path.parse(queryData.id).base를 대입시켜 queryDate.id 출력값은 둘이 똑같지만 보안상 문제가 되지 않는 path.parse(queryData.id).base로 변환시켜 변수에 저장시키는 작업이다.
          fs.readFile(`data/${filteredId}`,'utf8',function(err,description){ // queryData.id - > filteredId
            var title = queryData.id;
            var list = template.list(filelist);
            var html = template.html(title,list,`<h2>${title}</h2><p>${description}</p>`,
            `<a href = "/create">create</a>
             <a href = "/update?id=${title}">update</a>
             <form action="delet_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delet">
             </form>
             `); // 
            response.writeHead(200); //response 객체의 메소드에서 헤더 정보를 응답에 작성해서 내보내는 것이다 200은 파일을 성공적으로 전송했다는 의미
            response.end(html); 
          })
        });
      }
    }
    else if(pathname === '/create'){
      fs.readdir('./data',function(err, filelist){ 
        var title = 'Web - crate';
        var list = template.list(filelist);
        var html = template.html  /*action에 나오는 주소로 submit한다는 뜻이다 이 주소로 처리함 */(title,list,`
        <form action ="http://localhost:3000/create_process" method="post"> 
        <p>
            <input type ="text" name="title" placeholder="title">
        </p>
        <p>
            <textarea name ="description" placeholder="description"></textarea>
        </p>
        <p>
            <input type ="submit">
        </p>
        </form>
        `,'')
        response.writeHead(200); 
        response.end(html);
      });
  }
    else if(pathname === '/create_process'){
      var body = '';
      request.on('data',function(data){ //데이터를 처리하는 기능 , 데이터를 수신할 때마다 호출되는 콜백 함수 / request는 createServer 함수의 콜백으로 전달한 인수에서 찾을 수 있다 request = 요청할 때 웹 브라우저가 보낸 정보가 담겨있음 response = 응답할 때 웹 브라우저에 전송할 정보를 담음 
        body += data; // 데이터를 받을 때마다 body에 누적해서 합친다 
      });
      request.on('end',function(){ // 테이터 처리를 마무리하는 기능, 수신할 정보가 없으면 호출되는 콜백 함수 / 이 이벤트는 데이터 수신을 완료하면 발생하는 이벤트로 콜백에 데이터 처리를 마무리하는 기능이다 
        var post = qs.parse(body); // 누적된 body 데이터를 post에 담는다 
        var title = post.title; 
        var description = post.description;
        fs.writeFile(`data/${title}`,description,'utf8',function(err){ // writeFile로 create에서 쓴 title과 description의 내용들이 각 파일의 이름과 내용으로 저장해준다 저장 위치는 `data/${title}`이다.
          response.writeHead(302, {Location : `/?id=${title}`});  // 위에 말했던 것처럼 200은 파일 전송 완료를 뜻하고 302는 페이지를 다른 곳으로 리다이렉션(웹 페이지를 이동시키는 기능)하라는 의미이다 
          response.end();
        })
      });
    }
    else if(pathname === '/update'){ // 수정 화면 처리 코드를 작성해 놓은 곳이다.
      fs.readdir('./data',function(err, filelist){ // 기능이 실행되면 지정한 디렉터리에 있는 파일 목록이 filelist 변수에 저장된다.
        fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.html(title,list,
            `
            <form action ="/update_process" method="post"> 
            <input type = "hidden" name="id" value ="${title}">
            <p>
                <input type ="text" name="title" placeholder="title" value ='${title}'>
            </p>
            <p>
                <textarea name ="description" placeholder="description">${description}</textarea>
            </p>
            <p>
                <input type ="submit">
            </p>
            </form>
            `,
            `<a href = "/create">create</a> <a href = "/update/?id=${title}">update</a>`
            );
          response.writeHead(200); //response 객체의 메소드에서 헤더 정보를 응답에 작성해서 내보내는 것이다 200은 파일을 성공적으로 전송했다는 의미
          response.end(html); 
        });
      });
    }
    else if(pathname === '/update_process'){ // 수정했던 폼을 저장해주는 코드
      var body = '';
      request.on('data',function(data){ //데이터를 처리하는 기능 , 데이터를 수신할 때마다 호출되는 콜백 함수 / request는 createServer 함수의 콜백으로 전달한 인수에서 찾을 수 있다 request = 요청할 때 웹 브라우저가 보낸 정보가 담겨있음 response = 응답할 때 웹 브라우저에 전송할 정보를 담음 
        body += data; // 데이터를 받을 때마다 body에 누적해서 합친다 
      });
      request.on('end',function(){ // 테이터 처리를 마무리하는 기능, 수신할 정보가 없으면 호출되는 콜백 함수 / 이 이벤트는 데이터 수신을 완료하면 발생하는 이벤트로 콜백에 데이터 처리를 마무리하는 기능이다 
        var post = qs.parse(body); // 누적된 body 데이터를 post에 담는다 
        var title = post.title; 
        var id = post.id;
        var description = post.description; 
        fs.rename(`data/${id}`,`data/${title}`,function(err){ // rename()함수의 첫번째 인수 ${id}를 ${title}로 바꾼다는 뜻이다 이 행위를 하는 이유는 writeFile을 사용할 때 `date/${title}`로 찾는데 title값을 바꾸면 찾을 수가 없으니까 id값으로 예전 title값을 주고 새로운 title을 사용할 title로 교체시키는 작업이다.
          fs.writeFile(`data/${title}`,description,'utf8',function(err){  
            response.writeHead(302, {Location : `/?id=${title}`});  // 위에 말했던 것처럼 200은 파일 전송 완료를 뜻하고 302는 페이지를 다른 곳으로 리다이렉션(웹 페이지를 이동시키는 기능)하라는 의미이다 
            response.end();
          }) 
        })
      });
    }
    else if(pathname === '/delet_process'){ // 보안 문제로 <a href> 형태로 가지 않고 바로 삭제해주는 코든데 아직 잘 이해가 가지 않는다 
      var body = '';
      request.on('data',function(data){ //데이터를 처리하는 기능 , 데이터를 수신할 때마다 호출되는 콜백 함수 / request는 createServer 함수의 콜백으로 전달한 인수에서 찾을 수 있다 request = 요청할 때 웹 브라우저가 보낸 정보가 담겨있음 response = 응답할 때 웹 브라우저에 전송할 정보를 담음 
        body += data; // 데이터를 받을 때마다 body에 누적해서 합친다 
      });
      request.on('end',function(){ // 테이터 처리를 마무리하는 기능, 수신할 정보가 없으면 호출되는 콜백 함수 / 이 이벤트는 데이터 수신을 완료하면 발생하는 이벤트로 콜백에 데이터 처리를 마무리하는 기능이다 
        var post = qs.parse(body); // 누적된 body 데이터를 post에 담는다 
        var id = post.id;
        var filteredId= path.parse(queryData.id).base; // 근데 왜 삭제랑 처음부분에만 하는지는 잘 모르겠음 
        fs.unlink(`data/${filteredId}`,function(error){
          response.writeHead(302,{Location:`/`});
          response.end();
        })
      });
    }
    else{ // 내가 정한 경로에 속해 있지 않아서 루트 주소 뒤에 다른 경로가 있음 
      response.writeHead(404); // 404는 요청한 파일이 없다는 의미
      response.end('Not Find');
    }
});
app.listen(3000);
//app.listen(80) 세계에서 정한 기본 포트 주소창에 80을 입력하지 않아도 됨 ex) localhost:80 (o) localhost(o) 
//
