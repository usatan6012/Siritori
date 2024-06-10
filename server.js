// server.js

import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
// 直前の単語を保持しておく
let wordHistorie = SetStartWord();//ひらがな
let wordHistories = [wordHistorie];//元の単語

//現在要素数「10」個
function SetStartWord(wordNo){
    //この中の語群からランダムにひとつ返す。
    const StartWords = ["しりとり","さんへいほう","おいらー","いんてぐらる",
        "てーらーてんかい","かい","がうす","さんかくひ","きょくち","しゅうそく"];
    return StartWords[wordNo % StartWords.length];//いくつが入っても確実に値を返せる。
}
function SetStartWord2(wordNo){
    //この中の語群からランダムにひとつ返す。
    const StartWords = ["しりとり","三平方","オイラー","インテグラル",
        "テーラー展開","解","ガウス","三角比","極地","収束"];
    return StartWords[wordNo % StartWords.length];//いくつが入っても確実に値を返せる。
}
function IsHiragana(word){
    //wordがすべてひらがなだとtrueを返す。
    return /^[ぁ-ゖー]*$/.test(word);
}

let previousWord = wordHistorie;

// localhostにDenoのHTTPサーバーを展開
Deno.serve(async (request) => {
    const pathname = new URL(request.url).pathname;
    console.log(`pathname: ${pathname}` + "  からアクセスがありました。");

    // GET /shiritori: 直前の単語を返す
    if (request.method === "GET" && pathname === "/shiritori") {
        const StartWordId = Math.floor( Math.random() * 10 );//初期単語の要素数に*の後の実数のあたいを合わせる。
        previousWord = SetStartWord(StartWordId);//前の単語(ひらがな)
        wordHistories = [SetStartWord2(StartWordId)];//以前使ったの単語集(全種類の文字)
        return new Response(previousWord + "(" + wordHistories[wordHistories.length-1] + ")");
    }
    // POST /shiritori: 次の単語を入力する
    if (request.method === "POST" && pathname === "/shiritori") {
        // リクエストのペイロードを取得
        const requestJson = await request.json();
        console.log(requestJson)//取得した文字列をコンソールに出力
        // JSONの中からnextWordを取得
        const nextWord = requestJson["nextWord"];
        const nextWord2 = requestJson["nextWord2"];

        //--------------------//
        //以下入力された単語のルールチェック
        //--------------------//

        function LastChar(Word) {
            const SmallWord = ['ぁ','ぃ','ぅ','ぇ','ぉ','ゕ','ゖ','っ','ゃ','ゅ','ょ','ゎ']
            const BigWord = ['あ','い','う','え','お','か','け','つ','や','ゆ','よ','わ'];
            let Index = SmallWord.indexOf(Word[Word.length-1]);
            if(Index !== -1){
                //最後の文字が捨て仮名(小さい平仮名)だったら実行
                //console.log("最後の文字が捨て仮名です " + Index);
                return BigWord[Index];
            }
            if(Word[Word.length-1] === 'ぁ') {
                return 'あ';
            }
            if(Word[Word.length-1] === "ー"){
                return Word[Word.length-2] 
            }
            return Word[Word.length-1];
        }
        //console.log(LastChar(previousWord));
          
        // previousWordの末尾とnextWordの先頭が同一か確認
        // ただし、伸ばし棒のときはその前の文字が参照される
        if (LastChar(previousWord) !== nextWord.slice(0, 1)) {
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

        //上段がすべて平仮名で構成されているかどうか(ー)はOK
        if(!IsHiragana(nextWord)){
            return new Response(
                JSON.stringify({
                    "errorMessage": "上段に平仮名以外が含まれています(ーは打てます)。",
                    "errorCode": "10004"
                }),
                {
                 status: 404,
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                }
            );
        }

        //以前その単語が出ていないか確認
        if(wordHistories.find(value => value === nextWord2) != null){
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
        wordHistories.push(nextWord2);

        //--------------------//
        //ルールチェック終わり
        //--------------------//

        // 現在の単語を返す
        return new Response(previousWord + "(" + wordHistories[wordHistories.length-1] + ")");
    }

    //しりとりリセット
    if(request.method === "Reset" && pathname === "/shiritori"){
        const StartWordId = Math.floor( Math.random() * 10 );//初期単語の要素数に*の後の実数のあたいを合わせる。
        previousWord = SetStartWord(StartWordId);
        wordHistories = [SetStartWord2(StartWordId)];
        return new Response(previousWord + "(" + wordHistories[wordHistories.length-1] + ")");
    }

    //if (request.method === "Test" && pathname === "/shiritori") {
    //    console.log('キー検知成功です');
    //    return new Response(previousWord);
    //}


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
