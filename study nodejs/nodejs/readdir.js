var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder/*./data라는 뜻*/,function(err, filelist){ // 기능이 실행되면 지정한 디렉터리에 있는 파일 목록이 filelist 변수에 저장된다.
    console.log(filelist) //data에 있는 파일 목록은 ['CSS','HTML','JavaScript']로 filelist에 저장된다는 걸 알 수 있다
})