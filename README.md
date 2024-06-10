# 基本機能
・単語送信
・しりとりのルール(最後の単語と最初の単語を同じにする。最後の単語がんだったら終わり。一度使った単語は使えない)に則ってプレイできます。
・以前の単語を表示(1個前まで)。
・しりとりのリセット機能(初期単語表示、服歴消去)

# 追加した機能
・enterキーで送信を代替出来るようにしました。
・ゲームオーバーにならないようにしました。(すべて警告)
・「ー」伸ばしの音で終わる単語はその前の文字を参照するようにしました。
・ページのリロードをしたときにinputフィールドに値が残らないようにしました。
・ページの背景を自作の物にしました。
・最初の単語をランダムにしました。
・漢字で保存し、読みを送るようにしました。(保存する単語とルールを成り立たせるためのよみがなに分ける)
・上の段(平仮名専門)で平仮名と長音以外が入力されたらエラーを返します。
・捨て仮名(「ぁ」や「ゃ」など小さい平仮名)で終わる単語の場合、次の単語は普通サイズの平仮名(「あ」や「や」)などで始まれば良いようにしました。
・現在何回単語を出したかひょうじするようにしたましました。

# 補足
今回は「ん」で終わる単語を入力したり以前入力した単語を入力したりしてもエラーが帰ってくるように設計しました。gemeOverはリセット機能の応用にて実装可能ですがしりとりは長く続けるのが目的の場合が多いためにエラーだけの表示です。

# アプリの動作方法
<https://usatan6012-siritori-44-6vve8dg2085d.deno.dev/>にアクセスするだけです。ページにルールが乗っています。上段にふりがな、下段に元の単語を書きます。

# Denoプロジェクト
https://dash.deno.com/projects/usatan6012-siritori-44

# 制作にあたり、参考にしたwebサイト様
[JavaScript配列の取り扱い]<https://qiita.com/takeharu/items/d75f96f81ff83680013f>
[JavaScriptの関数]<ttps://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Functions>
[イコール2つとイコール3つの違い]<http://piyopiyocs.blog115.fc2.com/blog-entry-229.html>
[キー入力検知(方法)]<https://qiita.com/riversun/items/3ff4f5ecf5c21b0548a4>
[キー入力検知(実際の実装)]<https://lorem-co-ltd.com/key-code/>
[Array.findの使い方]<https://ribbit.konomi.app/blog/javascript-array-find/>
[乱数]<https://qiita.com/sho-17/items/4a89f13e13fa9dcc250a>
[配列の最後の文字取得]<https://qiita.com/kerupani129/items/64ce1e80eb8efb4c2b21>
[配列が平仮名のみかを調べる方法]<https://058.jp/javascript/?p=107>
[UTF-8コード表(1)]<https://www.seiai.ed.jp/sys/text/java/utf8table.html>
[エラーメッセージの解決(存在しない変数参照のエラー)]<https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Errors/Not_defined?utm_source=mozilla&utm_medium=firefox-console-errors&utm_campaign=default>
[HTML改行]<https://developer.mozilla.org/ja/docs/Web/HTML/Element/br>
[HTML文字サイズ]<http://masaboo.cside.com/new_html1/ht_05.htm#google_vignette>
[cssとHTMLで背景画像の設定]<https://zero-plus.io/media/background-image/>
[css文字色変更]<https://www.sejuku.net/blog/56207#google_vignette>
[push/pullのエラー403解決方法]<https://trios.pro/github-403-error/>
[ブランチ名を省略したgit pullが通らないときの対処法]<https://qiita.com/antyuntyuntyun/items/f9f20cf346e60599235e>
[githubコミット方法]<https://zenn.dev/romu/articles/a6f3d863d321b6>
[README.md文法]<https://qiita.com/oreo/items/82183bfbaac69971917f>



