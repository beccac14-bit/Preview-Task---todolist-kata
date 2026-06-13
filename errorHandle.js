const headers = require('./headers.js'); // 載入 headers 物件資訊

// 錯誤情況 {title,id} 的 title 拼錯導致 undefined
function errorTitleUndefined(res){
    res.writeHead(400, headers);
    res.write(JSON.stringify({
        'status': false,
        'message':'請確認待辦 title 是否正確'
    }));
    res.end();
};

// 錯誤情況 查無輸入的 todoID
function errorTodoIdNotFound(res){
    res.writeHead(400, headers);
    res.write(JSON.stringify({
        'status': false,
        'message':'查無此待辦'
    }));
    res.end();
};

// 錯誤情況 物件格式解析失敗（如：物件格式少 }、" 等）
function errorJsonParsedFailed(res){
    res.writeHead(400, headers);
    res.write(JSON.stringify({
        'status': false,
        'message':'物件解析失敗，請確認資料格式是否正確'
    }));
    res.end();
};

module.exports = {
    errorTitleUndefined,
    errorTodoIdNotFound,
    errorJsonParsedFailed
};
