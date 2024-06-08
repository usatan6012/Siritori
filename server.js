// server.js

import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
// 直前の単語を保持しておく
let wordHistories = ["しりとり"];
let previousWord = wordHistories[0];

// localhostにDenoのHTTPサーバーを展開
Deno.serve(async (request) => {
    const pathname = new URL(request.url).pathname;
    console.log(`pathname: ${pathname}`);

    // GET /shiritori: 直前の単語を返す
    if (request.method === "GET" && pathname === "/shiritori") {
        return new Response(previousWord);
    }
    // POST /shiritori: 次の単語を入力する
    if (request.method === "POST" && pathname === "/shiritori") {
        // リクエストのペイロードを取得
        const requestJson = await request.json();
        // JSONの中からnextWordを取得
        const nextWord = requestJson["nextWord"];

        //--------------------//
        //以下入力された単語のルールチェック
        //--------------------//

        // previousWordの末尾とnextWordの先頭が同一か確認
        if (previousWord.slice(-1) !== nextWord.slice(0, 1)) {
            // 同一でない単語の入力時に、エラーを返す
            return new Response(
            JSON.stringify({
                "errorMessage": "前の単語に続いていません",
                "errorCode": "10001"
            }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                }
            );
        }
        //単語の末尾が「ん」で終わっていないか確認
        if(nextWord.slice(-1) === 'ん'){
            //「ん」ならゲームオーバー
            return new Response(
            JSON.stringify({
                "errorMessage": "「ん」で終わる単語です。",
                "errorCode": "10002"
            }),
                {
                 status: 402,
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                }
            );
        }

        //以前その単語が出ていないか確認
        if(wordHistories.find(value => value === nextWord) != null){
            console.log("検出");
            //その単語が以前に出ていれば、ゲームオーバー
            return new Response(
                JSON.stringify({
                    "errorMessage": "以前出た単語です。",
                    "errorCode": "10003"
                }),
                {
                    status: 403,
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                }
            );
        }

        //console.log(wordHistories.find(value => value.name === nextWord));
        // 同一でがつ最後が「ん」でなければあれば、previousWordを更新
        previousWord = nextWord;
        //また、以前出た単語一覧「wordHistories」にも追加
        wordHistories.push(nextWord);

        //--------------------//
        //ルールチェック終わり
        //--------------------//

        // 現在の単語を返す
        return new Response(previousWord);
    }

    //しりとりリセット
    if(request.method === "Reset" && pathname === "/shiritori"){
        wordHistories = ["しりとり"];
        previousWord = wordHistories[0];
        return new Response(previousWord);
    }

    if (request.method === "Test" && pathname === "/shiritori") {
        console.log('キー検知成功です');
        return new Response(previousWord);
    }


    // ./public以下のファイルを公開
    return serveDir(
        request,
        {
            /*
            - fsRoot: 公開するフォルダを指定
            - urlRoot: フォルダを展開するURLを指定。今回はlocalhost:8000/に直に展開する
            - enableCors: CORSの設定を付加するか
            */
            fsRoot: "./public/",
            urlRoot: "",
            enableCors: true,
        }
    );
});
