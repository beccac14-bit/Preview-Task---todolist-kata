const { v4: uuidv4 } = require('uuid'); //載入 uuid 模組
const http = require("http"); // 載入 node.js 本身 http 模組
const todos = [];
const headers = require('./headers.js'); // 載入 headers 物件資訊

// 載入 errorHandle.js 的 error 處理函式
const {errorTitleUndefined,
    errorTodoIdNotFound,
    errorJsonParsedFailed} = require("./errorHandle.js"); 

const requestListener = (req, res) => {

    let body = ""; 
    // 用來接 request body 資料，不可放在 req.on 函式內，不然傳不出來

    req.on('data',(chunk) => {
        body += chunk;
        // console.log(body);
    })
    
    // GET 取得所有待辦
    if(req.url == "/todos" & req.method == "GET"){
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            'status' : true,
            'data' : todos,
            'message':'待辦清單取得成功！'
        }));
        res.end();
    } 
    // POST 新增一筆待辦
    else if(req.url == "/todos" & req.method =="POST"){
        req.on('end',()=>{
            try{
                const todoTitle = JSON.parse(body).title;

                if(todoTitle !== undefined){
                    const todo = {
                    'title' : todoTitle,
                    'id': uuidv4()
                };
                todos.push(todo);

                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    'status' : true,
                    'data' : todos,
                    'message':'新增待辦成功'
                }));
                res.end();
                } else {
                    errorTitleUndefined(res);
                }
            }catch(error){
                errorJsonParsedFailed(res);
            }
        })
    } 
    // DELETE 刪除所有待辦
    else if(req.url == "/todos" & req.method =="DELETE"){
        todos.length = 0;
        res.writeHead(200, headers);
                res.write(JSON.stringify({
                    'status' : true,
                    'data' : todos,
                    'message':'待辦清單已全部刪除！'
                }));
                res.end();
    } 
    // DELETE 刪除指定一筆待辦
    else if(req.url.startsWith("/todos/") & req.method =="DELETE"){
        const todoId = req.url.split("/").pop();
        const todoIndex = todos.findIndex( Obj => Obj.id == todoId );
        
        if(todoIndex !== -1){
            todos.splice(todoIndex,1);
            res.writeHead(200, headers);
            res.write(JSON.stringify({
            'status' : true,
            'data' : todos,
            'message':'刪除成功！'
            }));
            res.end();
        } else {
            errorTodoIdNotFound(res);
        }

         
    } 
    // PATCH 編輯指定一筆待辦
    else if(req.url.startsWith("/todos/") & req.method =="PATCH"){
        const todoId = req.url.split("/").pop();
        const todoIndex = todos.findIndex( Obj => Obj.id == todoId );
        
        req.on('end',()=>{
            try{
                const todoTitle = JSON.parse(body).title;
                if(todoIndex !== -1 && todoTitle !== undefined ){
                    todos[todoIndex].title = todoTitle; 

                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                    'status' : true,
                    'data' : todos,
                    'message':'編輯成功！'
                    }));
                    res.end();
                } else if (todoIndex == -1){
                    errorTodoIdNotFound(res);
                } else {
                    errorTitleUndefined(res);
                }

            }catch(error){
                errorJsonParsedFailed(res);
            }
            

        })

        

    } 
    // OPTIONS Preflight 驗證
    else if(req.url == "/todos" & req.method == "OPTIONS"){
        res.writeHead(200, headers);
        res.end();
    } 
    // 404 輸入 URL 不正確
    else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            'status': false,
            'message':'造訪路由不存在'
        }));
        res.end();
    }
    
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);

