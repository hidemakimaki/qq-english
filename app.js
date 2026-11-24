/* QQ English 瞬間英作文 — app logic (vanilla JS) */
(function () {
  "use strict";

  var KEY = "qq-shunkan-v1";
  var FOCUS_THRESHOLD = 3; /* 誤答がこの回数以上で「重点復習」 */
  var MIX_ID = "qq-mix";   /* 総合問題。中身は実行時に全セットから引く */
  var MIX_SIZE = 10;

  /* ============================================================
     収録セット（レッスンのふりかえりから作成 / 正本は sets.json）
     ============================================================ */

  var SET_LESSON_03 = {
    id: "qq-lesson-03",
    date: "2026-11-19",
    teacher: "未記入",
    title: "第3回 ふりかえり",
    basic: [
      {
        id: "b1",
        ja: "もっと速く英語を話せるようになりたいです。",
        en: "I want to be able to speak English faster.",
        alt: ["I want to work on speaking more fluently."],
        note: "more fast は不可。fast は1音節なので比較級は faster。「〜できるようになりたい」は want to be able to 〜。"
      },
      {
        id: "b2",
        ja: "ingredients ってどういう意味ですか？",
        en: "What does \"ingredients\" mean?",
        alt: ["What's the meaning of \"ingredients\"?"],
        note: "分からない単語は黙らずこの一文で聞く。does のあとの動詞は原形 mean。"
      },
      {
        id: "b3",
        ja: "前向きな気持ちなら a few、がっかりしているなら few です。",
        en: "If I'm happy about it, I'd say \"a few.\" If I'm disappointed, I'd say \"few.\"",
        alt: [],
        note: "a few＝「少しある」で肯定的、few＝「ほとんどない」で否定的。両方 a few にしてしまわないよう注意。"
      },
      {
        id: "b4",
        ja: "それは本当に悲しいですね。",
        en: "That's really sad.",
        alt: ["I'm so sorry to hear that."],
        note: "accident は「事故」。出来事に同情するだけなら That's really sad. で足りる。"
      },
      {
        id: "b5",
        ja: "じゃがいもはひとつもありません。",
        en: "There aren't any potatoes.",
        alt: ["There are no potatoes."],
        note: "potatoes は複数なので there aren't。There isn't any potatoes は主語と動詞が合っていない。"
      },
      {
        id: "b6",
        ja: "（壁に）写真は何枚か飾ってありますか？",
        en: "Are there any pictures on the wall?",
        alt: ["Are there any pictures?"],
        note: "any のうしろの可算名詞は複数形 pictures。Are there any picture? は不可。"
      },
      {
        id: "b7",
        ja: "その部屋にカーペットは敷いてありますか？",
        en: "Is there a carpet in the room?",
        alt: ["Is there a rug in the room?"],
        note: "carpet は1枚と数えられるので a carpet。any carpet だと「カーペットという素材が少しでも」という響きになる。"
      },
      {
        id: "b8",
        ja: "エアコンはありますか？",
        en: "Is there an air conditioner?",
        alt: ["Is there air conditioning?"],
        note: "air は母音で始まるので a ではなく an。1台を指すので any ではなく an。"
      },
      {
        id: "b9",
        ja: "3人います。",
        en: "There are three people.",
        alt: ["There are three of us."],
        note: "person の複数は people。three persons は法律文書のような硬い言い方で、会話では使わない。"
      },
      {
        id: "b10",
        ja: "（お肉は）いいえ、ひとつもありません。",
        en: "No, there isn't any.",
        alt: ["No, there's none."],
        note: "Is there any meat? への即答。15秒考えこまずに返せるよう、形ごと覚える。"
      }
    ],
    similar: [
      {
        id: "s1",
        ja: "もっと上手に発音できるようになりたいです。",
        en: "I want to be able to pronounce words better.",
        alt: ["I want to work on my pronunciation."],
        note: "基本1と同じ型。good／well の比較級は better。more good は不可。"
      },
      {
        id: "s2",
        ja: "この単語はどういう意味ですか？",
        en: "What does this word mean?",
        alt: ["What's the meaning of this word?"],
        note: "基本2と同じ型。主語が this word でも does のあとは原形 mean。"
      },
      {
        id: "s3",
        ja: "時間が少しだけあります。",
        en: "I have a little time.",
        alt: ["I have a bit of time."],
        note: "基本3の不可算版。可算は a few / few、不可算は a little / little。little だけなら「ほとんどない」。"
      },
      {
        id: "s4",
        ja: "それは本当によかったですね。",
        en: "That's really great.",
        alt: ["I'm so glad to hear that."],
        note: "基本4と同じ That's really 〜. の型。感情は形容詞1語で足りる。"
      },
      {
        id: "s5",
        ja: "牛乳がまったくありません。",
        en: "There isn't any milk.",
        alt: ["There's no milk."],
        note: "基本5の逆パターン。milk は不可算なので there isn't。可算の複数なら aren't。"
      },
      {
        id: "s6",
        ja: "何か質問はありますか？",
        en: "Are there any questions?",
        alt: ["Do you have any questions?"],
        note: "基本6と同じ。any のあとは複数形 questions。"
      },
      {
        id: "s7",
        ja: "その部屋にテレビはありますか？",
        en: "Is there a TV in the room?",
        alt: ["Does the room have a TV?"],
        note: "基本7と同じ。1台なら a TV。"
      },
      {
        id: "s8",
        ja: "傘はありますか？",
        en: "Is there an umbrella?",
        alt: ["Do you have an umbrella?"],
        note: "基本8と同じ。umbrella も母音で始まるので an。"
      },
      {
        id: "s9",
        ja: "子どもが2人います。",
        en: "There are two children.",
        alt: ["There are two kids."],
        note: "基本9と同じ不規則な複数形。child → children。childs は不可。"
      },
      {
        id: "s10",
        ja: "はい、少しあります。",
        en: "Yes, there are some.",
        alt: ["Yes, there's some."],
        note: "基本10の肯定版。可算の複数なら there are some、不可算なら there is some。"
      }
    ]
  };
  var SET_LESSON_04 = {
    id: "qq-lesson-04",
    date: "2026-11-20",
    teacher: "未記入",
    title: "第4回 ふりかえり",
    basic: [
      {
        id: "b1",
        ja: "悪くないけど少し疲れています。今日は仕事で忙しくて。",
        en: "Not bad, but I'm a little tired. I've been busy with work today.",
        alt: ["Not bad, but I'm a bit tired — work has been keeping me busy."],
        note: "I tired ではなく I'm tired。work は不可算なので a work と言わない。「ずっと忙しかった」は I've been busy with work。"
      },
      {
        id: "b2",
        ja: "もう「book」と言ったので、繰り返さずに「mine」と言えるんですね？",
        en: "So if I've already said \"book,\" I can say \"mine\" instead of repeating it?",
        alt: ["So instead of saying \"book\" again, I can just say \"mine\"?"],
        note: "所有代名詞は同じ名詞の繰り返しを避けるために使う。理解を確認するときは So 〜? と聞き返す。"
      },
      {
        id: "b3",
        ja: "少し混乱しています。なぜ「my family's house」が「ours」と同じなのですか？",
        en: "I'm a little confused. Why is \"my family's house\" the same as \"ours\"?",
        alt: [],
        note: "混乱しているのは自分なので I'm confused。confusing は「（相手を）混乱させる」という意味になる。"
      },
      {
        id: "b4",
        ja: "難しかったです。boots が複数だと忘れていました。",
        en: "That was difficult. I forgot that \"boots\" is plural, so I should say \"they are.\"",
        alt: ["That was hard. I forgot \"boots\" is plural."],
        note: "終わったことなので That was difficult.。It is difficult. だと「今も難しい」という意味になる。"
      },
      {
        id: "b5",
        ja: "ウェイターは本当に「This table will be yours」と言うのですか？",
        en: "Do waiters really say \"This table will be yours\"?",
        alt: ["Is that something waiters actually say?"],
        note: "職業一般の話は複数形の主語＋do。Does waiter 〜? とはしない。"
      },
      {
        id: "b6",
        ja: "「James's」は言いにくいです。",
        en: "\"James's\" sounds strange to me.",
        alt: ["\"James's\" is hard for me to say."],
        note: "It is strange, James では「ジェームズ、それは変だね」と呼びかけになる。引用した語を主語にして sounds 〜 to me。"
      },
      {
        id: "b7",
        ja: "先生の説明はとても分かりやすいです。",
        en: "You explain things really well.",
        alt: ["You're a great teacher.", "Your explanations are really clear."],
        note: "You teach me very good. は不可。動詞 explain / teach を修飾するのは副詞 well。"
      },
      {
        id: "b8",
        ja: "plural ってどういう意味ですか？",
        en: "What does plural mean?",
        alt: ["What's the meaning of plural?", "Could you explain what plural means?"],
        note: "does のある疑問文では動詞は原形 mean。What does plural means? は不可。関係節の中（what plural means）では means になる。"
      },
      {
        id: "b9",
        ja: "これはあなたのヘッドホンですか？",
        en: "Are these your headphones?",
        alt: [],
        note: "headphones は左右で1組＝複数。Is this your headphone? は不可。"
      },
      {
        id: "b10",
        ja: "それはベンのブーツですよ。",
        en: "They're Ben's boots.",
        alt: ["Those are Ben's boots."],
        note: "boots は2足で1組＝複数なので It's ではなく They're。shoes, socks, gloves も同じ。"
      }
    ],
    similar: [
      {
        id: "s1",
        ja: "少し眠いです。今朝はずっと勉強で忙しくて。",
        en: "I'm a little sleepy. I've been busy studying this morning.",
        alt: ["I'm kind of sleepy — I've been studying all morning."],
        note: "基本1と同じ型。be 動詞＋形容詞、そして I've been busy ＋ -ing。"
      },
      {
        id: "s2",
        ja: "そのブーツは彼のものです。",
        en: "They're his.",
        alt: ["Those are his.", "They belong to him."],
        note: "They are he / him は不可。所有を表すのは所有代名詞 his。"
      },
      {
        id: "s3",
        ja: "少し混乱しています。なぜ「his」ではなく「hers」なのですか？",
        en: "I'm a little confused. Why is it \"hers\" and not \"his\"?",
        alt: [],
        note: "基本3と同じ型。Why is it A and not B? の形で聞き返せる。"
      },
      {
        id: "s4",
        ja: "難しかったです。glasses が複数だと忘れていました。",
        en: "That was difficult. I forgot that \"glasses\" is plural.",
        alt: [],
        note: "基本4と同じ。glasses, scissors, pants はいつも複数扱い。"
      },
      {
        id: "s5",
        ja: "先生は本当にそう言うのですか？",
        en: "Do teachers really say that?",
        alt: ["Is that something teachers actually say?"],
        note: "基本5と同じ。一般的な話は複数形の主語＋do。"
      },
      {
        id: "s6",
        ja: "「clothes」は私には言いにくいです。",
        en: "\"Clothes\" is hard for me to say.",
        alt: ["\"Clothes\" sounds difficult to me."],
        note: "基本6と同じ型。発音は「クロウズ」に近く th はほぼ消える。cross と聞き分けられるよう注意。"
      },
      {
        id: "s7",
        ja: "彼女は教えるのがとても上手です。",
        en: "She's really good at teaching.",
        alt: ["She's a really good teacher."],
        note: "基本7の別の型。be good at ＋動名詞。good を動詞に直接つけない。"
      },
      {
        id: "s8",
        ja: "この表現はどういう意味ですか？",
        en: "What does this expression mean?",
        alt: ["What's the meaning of this expression?"],
        note: "基本8と同じ。主語が this expression でも does のあとは原形 mean。"
      },
      {
        id: "s9",
        ja: "これはあなたのサングラスですか？",
        en: "Are these your sunglasses?",
        alt: [],
        note: "基本9と同じ。sunglasses も複数扱い。It's Mark's glasses ではなく They're Mark's sunglasses。"
      },
      {
        id: "s10",
        ja: "それはそのサッカー選手のボールです。",
        en: "It's the soccer player's ball.",
        alt: [],
        note: "特定の選手を指すので the が必要。It's soccer player's ball は冠詞抜け。ball は1個なので It's。"
      }
    ]
  };
  var SET_TOKKUN_01 = {
    id: "qq-tokkun-01",
    date: "2026-11-22",
    teacher: "未記入",
    title: "#1 特訓",
    basic: [
      {
        id: "b1",
        ja: "なぜ私の答えはあなたの答えと同じなの？",
        en: "Why is my answer the same as yours?",
        alt: [],
        note: "the same as のあとは所有代名詞 yours（= your answer）。your だけでは文を終われない。"
      },
      {
        id: "b2",
        ja: "なぜ彼女ではなく彼なの？",
        en: "Why is it him and not her?",
        alt: [],
        note: "Why is it 〜? の形。be 動詞のあとでも、この言い方では目的格 him / her を使う。"
      },
      {
        id: "b3",
        ja: "なぜこの単語はあの単語と同じなの？",
        en: "Why is this word the same as that word?",
        alt: [],
        note: "比べる相手が名詞のときは the same as ＋名詞。as のあとに like は付けない。"
      },
      {
        id: "b4",
        ja: "なぜ月曜日ではなく火曜日なの？",
        en: "Why is it Tuesday and not Monday?",
        alt: [],
        note: "曜日は大文字で始める。and not 〜 で「〜ではなく」を後ろに足す。"
      },
      {
        id: "b5",
        ja: "なぜ私の考えは彼女の考えと同じなの？",
        en: "Why is my idea the same as hers?",
        alt: [],
        note: "hers = her idea。her idea と繰り返さず1語で済ませる。"
      },
      {
        id: "b6",
        ja: "なぜ赤ではなく青なの？",
        en: "Why is it blue and not red?",
        alt: [],
        note: "色は数えないので a は付けない。it は話題になっているものを指す。"
      },
      {
        id: "b7",
        ja: "なぜこの質問は前の質問と同じなの？",
        en: "Why is this question the same as the previous one?",
        alt: [],
        note: "one は question の代わり。the previous question と繰り返さなくてよい。"
      },
      {
        id: "b8",
        ja: "なぜ彼のものではなく彼女のものなの？",
        en: "Why is it hers and not his?",
        alt: [],
        note: "所有代名詞どうしの対比。her ではなく hers、he ではなく his。"
      },
      {
        id: "b9",
        ja: "なぜこの問題は昨日の問題と同じなの？",
        en: "Why is this problem the same as yesterday's?",
        alt: [],
        note: "yesterday's = yesterday's problem。's のあとの名詞は省ける。"
      },
      {
        id: "b10",
        ja: "なぜ英語ではなく日本語なの？",
        en: "Why is it Japanese and not English?",
        alt: [],
        note: "言語名は大文字で始める。a Japanese とはしない。"
      }
    ],
    similar: []
  };
  var SET_TOKKUN_02 = {
    id: "qq-tokkun-02",
    date: "2026-11-23",
    teacher: "未記入",
    title: "#2 特訓（道案内）",
    basic: [
      {
        id: "b1",
        ja: "何かお困りですか？",
        en: "Do you need any help?",
        alt: ["Do you need some help?", "Is everything okay?"],
        note: "声をかけるときの定番。May I help you? は店員の言い方なので、道では Do you need any help? が自然。"
      },
      {
        id: "b2",
        ja: "どこに行きたいですか？",
        en: "Where are you trying to go?",
        alt: ["Where are you headed?", "Where do you want to go?"],
        note: "try to 〜 で「〜しようとしている」。Where do you want to go? より柔らかく聞こえる。"
      },
      {
        id: "b3",
        ja: "地図を見せてもらえますか？",
        en: "Can you show me on the map?",
        alt: ["Could you show me on the map?"],
        note: "on the map で「地図の上で指して」。show me the map だと地図そのものを見せての意味になる。"
      },
      {
        id: "b4",
        ja: "ここから歩いて10分くらいです。",
        en: "It's about a 10-minute walk from here.",
        alt: ["It takes about 10 minutes on foot."],
        note: "a 10-minute walk。ハイフンでつないで形容詞にするときは minutes と複数にしない。"
      },
      {
        id: "b5",
        ja: "この道をまっすぐ進んでください。",
        en: "Go straight down this street.",
        alt: ["Go straight along this street."],
        note: "この down は「下る」ではなく「道沿いに」。along でも同じ意味になる。"
      },
      {
        id: "b6",
        ja: "次の角を右に曲がってください。",
        en: "Turn right at the next corner.",
        alt: ["Make a right at the next corner."],
        note: "角は at the corner。on the corner とは言わない。turn right に to は不要。"
      },
      {
        id: "b7",
        ja: "駅の向かい側にあります。",
        en: "It's across from the station.",
        alt: ["It's opposite the station."],
        note: "「向かい側」は across from。in front of は「正面」で道をはさまない。"
      },
      {
        id: "b8",
        ja: "ここからだと少し遠いですよ。",
        en: "It's a little far from here.",
        alt: ["It's a bit far from here."],
        note: "far は肯定文では a little / quite などを添えると自然。a few far は不可（far は不可算の感覚）。"
      },
      {
        id: "b9",
        ja: "よかったら、そこまで案内しますよ。",
        en: "I can show you the way if you'd like.",
        alt: ["I can take you there if you'd like."],
        note: "show A the way で「道案内する」。teach は使わない。if you'd like は「よろしければ」。"
      },
      {
        id: "b10",
        ja: "無事に着けるといいですね！",
        en: "I hope you find it!",
        alt: ["I hope you get there okay!"],
        note: "hope のあとは未来のことでも現在形でよい。I hope you will find it. としなくてよい。"
      }
    ],
    similar: []
  };
  var SET_MIX = {
    id: "qq-mix",
    date: "",
    teacher: "未記入",
    title: "総合問題",
    basic: [],
    similar: []
  };
  var SEED_SETS = [SET_LESSON_03, SET_LESSON_04, SET_TOKKUN_01, SET_TOKKUN_02, SET_MIX];

  /* 正答数の帯ごとの応援スタンプ（10問なら 〜5問 / 6〜9問 / 全問正解）。
     perfect は10問を一度も間違えずに通したときだけ */
  var CHEER_PACKS = {
    low: ["cheer/low-1.jpg", "cheer/low-2.jpg", "cheer/low-3.jpg", "cheer/low-4.jpg"],
    mid: ["cheer/mid-1.jpg", "cheer/mid-2.jpg", "cheer/mid-3.jpg"],
    high: ["cheer/high-1.jpg", "cheer/high-2.jpg", "cheer/high-3.jpg"],
    perfect: ["cheer/perfect-1.jpg", "cheer/perfect-2.jpg",
              "cheer/perfect-3.jpg", "cheer/perfect-4.jpg"]
  };

  var CHEERS = [
    "声に出すのがいちばんの練習。いきましょう！",
    "3秒で出てこなくても大丈夫。口を動かすのが先。",
    "きょうの10問、いっしょに片づけよう。",
    "前に間違えた文こそ、伸びしろ。",
    "詰まったところが、次に言える文になる。"
  ];

  var STEP_LABEL = { basic: "STEP 1・基本文", similar: "STEP 2・類似問題" };

  /* ============================================================
     状態
     ============================================================ */

  var state = null;
  var ui = { tab: "practice", step: "basic", dataMsg: null, confirm: null };
  var session = null;
  var tickTimer = null;
  var toastTimer = null;

  function ymd(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function todayKey() { return ymd(new Date()); }

  function daysAgo(n) {
    var d = new Date();
    return ymd(new Date(d.getFullYear(), d.getMonth(), d.getDate() - n));
  }

  function recentDays(n) {
    var out = [];
    for (var i = n - 1; i >= 0; i--) out.push(daysAgo(i));
    return out;
  }

  function defaultState() {
    return {
      version: 1,
      sets: SEED_SETS.slice(),
      progress: {},
      daily: {},
      lastStudied: null,
      cheerImage: null,
      currentSetId: (function () {
        /* はじめて開いたときは総合問題ではなく、いちばん新しい通常のセット */
        for (var i = SEED_SETS.length - 1; i >= 0; i--) {
          if (!isMix(SEED_SETS[i].id)) return SEED_SETS[i].id;
        }
        return SEED_SETS[0].id;
      })()
    };
  }

  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { raw = null; }
    if (!raw) return defaultState();
    var data;
    try { data = JSON.parse(raw); } catch (e) { return defaultState(); }
    if (!data || typeof data !== "object") return defaultState();
    var s = defaultState();
    if (Array.isArray(data.sets) && data.sets.length) s.sets = data.sets;
    /* コード側で増えたセットは、保存済みのデータにも自動で足す */
    SEED_SETS.forEach(function (seed) {
      if (!getSet(seed.id, s)) s.sets.push(seed);
    });
    if (data.progress && typeof data.progress === "object") s.progress = data.progress;
    if (data.daily && typeof data.daily === "object") s.daily = data.daily;
    s.lastStudied = data.lastStudied || null;
    s.cheerImage = data.cheerImage || null;
    s.currentSetId = data.currentSetId || s.sets[0].id;
    if (!getSet(s.currentSetId, s)) s.currentSetId = s.sets[0].id;
    return s;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      toast("保存できませんでした。ブラウザの設定（プライベートモードなど）を確認してください。");
    }
  }

  function getSet(id, st) {
    var list = (st || state).sets;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function currentSet() { return getSet(state.currentSetId); }

  function prog(setId) {
    var p = state.progress[setId];
    if (!p) { p = state.progress[setId] = { basic: {}, similar: {}, lastStudied: null }; }
    if (!p.basic) p.basic = {};
    if (!p.similar) p.similar = {};
    if (typeof p.laps !== "number") p.laps = 0;        /* 基本・類似とも全問クリアした回数 */
    if (typeof p.lapCounted !== "boolean") p.lapCounted = false;
    return p;
  }

  /* 次の周に入る。クリア判定だけ戻し、正誤の回数（重点復習や記録の元データ）は残す */
  function startNewLap(setId) {
    var p = prog(setId);
    ["basic", "similar"].forEach(function (step) {
      Object.keys(p[step]).forEach(function (qid) { p[step][qid].cleared = false; });
    });
    p.lapCounted = false;
  }

  function qstat(setId, step, qid) {
    var bucket = prog(setId)[step];
    var st = bucket[qid];
    if (!st) { st = bucket[qid] = { correct: 0, wrong: 0, cleared: false }; }
    return st;
  }

  function clearedCount(setId, step) {
    var set = getSet(setId);
    if (!set || !Array.isArray(set[step])) return 0;
    var n = 0;
    for (var i = 0; i < set[step].length; i++) {
      if (qstat(setId, step, set[step][i].id).cleared) n++;
    }
    return n;
  }

  function stepTotal(setId, step) {
    var set = getSet(setId);
    return set && Array.isArray(set[step]) ? set[step].length : 0;
  }

  function hasStep(setId, step) { return stepTotal(setId, step) > 0; }

  function isMix(setId) { return setId === MIX_ID; }

  function setDateLabel(set) { return set.date || "総合"; }

  /* 総合問題：ほかのセット全部からランダムに MIX_SIZE 問を引き直す */
  function drawMix() {
    var mix = getSet(MIX_ID);
    if (!mix) return null;
    var pool = [];
    state.sets.forEach(function (s) {
      if (s.id === MIX_ID) return;
      ["basic", "similar"].forEach(function (step) {
        (s[step] || []).forEach(function (q) {
          pool.push({
            id: s.id + "/" + step + "/" + q.id,
            ja: q.ja, en: q.en,
            alt: (q.alt || []).slice(),
            note: q.note || ""
          });
        });
      });
    });
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    mix.basic = pool.slice(0, MIX_SIZE);

    /* 引いた10問は未クリアの状態から始める（正誤の回数はそのまま残す） */
    var pg = prog(MIX_ID);
    mix.basic.forEach(function (q) {
      if (pg.basic[q.id]) pg.basic[q.id].cleared = false;
    });
    pg.lapCounted = false;
    save();
    return mix;
  }

  /* 問題のある STEP がすべて埋まったか（類似のないセットは基本だけで判定） */
  function isSetCleared(setId) {
    var any = false;
    var all = ["basic", "similar"].every(function (step) {
      if (!hasStep(setId, step)) return true;
      any = true;
      return isStepCleared(setId, step);
    });
    return any && all;
  }

  function isStepCleared(setId, step) {
    var total = stepTotal(setId, step);
    return total > 0 && clearedCount(setId, step) === total;
  }

  /* ============================================================
     ヘルパー
     ============================================================ */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function pct(a, b) { return b > 0 ? Math.round((a / b) * 100) : 0; }

  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2600);
  }

  function fmtDate(iso) {
    if (!iso) return "—";
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    return m ? m[2] + "/" + m[3] : iso;
  }

  /* ============================================================
     シェル
     ============================================================ */

  var SHELL =
    '<header class="appbar">' +
      '<div class="appbar-main">' +
        '<p class="eyebrow">QQ English 瞬間英作文</p>' +
        '<button class="setpick" data-act="tab" data-tab="sets"><span id="setLabel">—</span></button>' +
      '</div>' +
      '<div class="today-chip" id="todayChip">—</div>' +
    '</header>' +
    '<main id="views">' +
      '<section class="view" id="v-practice"></section>' +
      '<section class="view" id="v-stats" hidden></section>' +
      '<section class="view" id="v-sets" hidden></section>' +
    '</main>' +
    '<nav class="tabbar">' +
      '<button data-act="tab" data-tab="practice" aria-current="true"><span class="ic">🎙️</span>練習</button>' +
      '<button data-act="tab" data-tab="stats"><span class="ic">📈</span>記録</button>' +
      '<button data-act="tab" data-tab="sets"><span class="ic">🗂️</span>セット</button>' +
    '</nav>' +
    '<div class="toast" id="toast" hidden></div>' +
    '<input type="file" id="cheerFile" accept="image/*" hidden>';

  /* ============================================================
     練習ビュー
     ============================================================ */

  function stepChip(step, kicker) {
    var set = currentSet();
    var total = stepTotal(set.id, step);
    var done = clearedCount(set.id, step);
    var locked = step === "similar" && !isStepCleared(set.id, "basic");
    var selected = ui.step === step;
    var cleared = total > 0 && done === total;
    return '<button class="step-chip" data-act="pick-step" data-step="' + step + '"' +
      ' aria-selected="' + (selected ? "true" : "false") + '"' + (locked ? " disabled" : "") + '>' +
      (locked ? '<span class="lock">🔒</span>' : (cleared ? '<span class="done">✓</span>' : "")) +
      '<span class="step-k">' + kicker + '</span>' +
      '<span class="step-n">' + (step === "basic" ? "基本文" : "類似問題") + '</span>' +
      '<span class="step-m">' + done + " / " + total + '</span>' +
      '<span class="mini-bar"><i class="' + (cleared ? "full" : "") + '" style="width:' + pct(done, total) + '%"></i></span>' +
      '</button>';
  }

  function focusItems(setId) {
    var set = getSet(setId);
    var out = [];
    if (!set) return out;
    ["basic", "similar"].forEach(function (step) {
      (set[step] || []).forEach(function (q) {
        var st = qstat(setId, step, q.id);
        if (st.wrong >= FOCUS_THRESHOLD) out.push({ step: step, q: q, wrong: st.wrong, cleared: st.cleared });
      });
    });
    out.sort(function (a, b) { return b.wrong - a.wrong; });
    return out;
  }

  function cheerBand(done, total) {
    if (!total) return "low";
    if (done >= total) return "high";               /* 全問正解のときだけ */
    if (done > Math.floor(total / 2)) return "mid"; /* 10問なら6〜9問 */
    return "low";                                   /* 10問なら5問まで */
  }

  function cheerStamp(band) {
    var pack = CHEER_PACKS[band] || [];
    if (!pack.length) return null;
    return pack[Math.floor(Math.random() * pack.length)];
  }

  /* forceBand を渡すと正解数にかかわらずその帯のスタンプを出す
     （練習前の画面は常に low。大きいご褒美は結果画面のためにとっておく） */
  function cheerBlock(msg, done, total, forceBand) {
    var hasRate = typeof done === "number" && typeof total === "number";
    var band = hasRate ? (forceBand || cheerBand(done, total)) : null;
    var stamp = band ? cheerStamp(band) : null;
    var img = state.cheerImage;
    var src = stamp || img;
    return '<div class="cheer">' +
      '<div class="cheer-slot' + (src ? " has" : "") + (stamp ? " stamp " + band : "") + '"' +
        (stamp ? "" : ' data-act="pick-cheer" role="button" tabindex="0"') + '>' +
        (src ? '<img src="' + esc(src) + '" alt="応援スタンプ">' : "画像を<br>追加") +
      '</div>' +
      '<div class="cheer-text"><p>' + esc(msg) + '</p>' +
        '<small>' + (stamp
          ? total + "問中 " + done + "問クリア"
          : (img ? "タップで画像を変更" : "好きな画像を選ぶと、ここで応援してくれます")) + '</small>' +
      '</div>' +
    '</div>';
  }

  function renderPractice() {
    var el = document.getElementById("v-practice");
    var set = currentSet();
    if (!set) {
      el.innerHTML = '<div class="card"><h2>問題セットがありません</h2>' +
        '<p class="lede">「追加」タブから JSON を貼り付けてセットを取り込んでください。</p></div>';
      return;
    }

    if (session) { el.innerHTML = renderSession(); afterSessionRender(); return; }

    var mix = isMix(set.id);
    if (mix && !set.basic.length) drawMix();
    var twoSteps = hasStep(set.id, "similar");
    if (!twoSteps) ui.step = "basic";
    var html = twoSteps
      ? '<div class="steps">' + stepChip("basic", "STEP 1") + stepChip("similar", "STEP 2") + "</div>"
      : '<div class="steps one">' + stepChip("basic", mix ? "総合" : "特訓") + "</div>";

    var step = ui.step;
    var locked = step === "similar" && !isStepCleared(set.id, "basic");
    var total = stepTotal(set.id, step);
    var done = clearedCount(set.id, step);
    var remain = total - done;
    var p = prog(set.id)[step];
    var tries = 0, hits = 0;
    Object.keys(p).forEach(function (k) { tries += p[k].correct + p[k].wrong; hits += p[k].correct; });

    if (locked) {
      html += '<div class="card"><h2>STEP 2 はまだロック中</h2>' +
        '<p class="lede">基本文を 10 問すべて正解すると解放されます。あと <strong>' +
        (stepTotal(set.id, "basic") - clearedCount(set.id, "basic")) + '</strong> 問。</p>' +
        '<div class="stack" style="margin-top:14px">' +
        '<button class="btn primary big" data-act="pick-step" data-step="basic">基本文にもどる</button></div></div>';
    } else {
      var cleared = total > 0 && remain === 0;
      html += '<div class="card stack">' +
        "<div><h2>" + (mix ? "総合問題" : STEP_LABEL[step]) + (cleared ? "・クリア済み" : "") + "</h2>" +
        '<p class="lede">' + (mix
          ? "すべてのセットからランダムに" + MIX_SIZE + "問。引き直すたびに顔ぶれが変わります。"
          : cleared
            ? "全問クリア。復習としてもう一度まわせます。"
            : "日本語を見たら3秒以内に声に出す。言えたら「言えた」を押す。") + "</p></div>" +
        '<div class="pills">' +
          '<span class="pill' + (cleared ? " done" : "") + '">クリア ' + done + "/" + total + "</span>" +
          '<span class="pill">のべ解答 ' + tries + "</span>" +
          '<span class="pill">正解率 ' + pct(hits, tries) + "%</span>" +
        "</div>" +
        (mix
          ? (cleared
              ? '<button class="btn primary big" data-act="start" data-mode="all">新しい' + MIX_SIZE + '問をひく</button>'
              : '<button class="btn primary big" data-act="start" data-mode="remain">練習をはじめる（未正解 ' + remain + ' 問）</button>' +
                '<button class="btn ghost" data-act="start" data-mode="all">' + MIX_SIZE + '問を引き直す</button>')
          : '<button class="btn primary big" data-act="start" data-mode="remain">' +
              (cleared ? "10問を復習する" : "練習をはじめる（未正解 " + remain + " 問）") + "</button>" +
            (cleared ? "" : '<button class="btn ghost" data-act="start" data-mode="all">' + total + "問すべて通す</button>")) +
        "</div>";
    }

    html += cheerBlock(CHEERS[Math.floor(Math.random() * CHEERS.length)], done, total, "low");

    var focus = focusItems(set.id);
    if (focus.length) {
      html += '<div class="card stack"><h3>重点復習</h3>' +
        '<p class="lede" style="margin:0">' + FOCUS_THRESHOLD + '回以上つまずいた文。ここが伸びしろです。</p>' +
        '<ul class="focus-list">' +
        focus.slice(0, 6).map(function (f) {
          return "<li><span class=\"fj\">" + esc(f.q.ja) + "</span>" +
            '<span class="fx">×' + f.wrong + "</span>" +
            '<span class="fe">' + esc(f.q.en) + "</span></li>";
        }).join("") +
        "</ul></div>";
    }

    el.innerHTML = html;
  }

  /* ============================================================
     セッション
     ============================================================ */

  function startSession(step, mode) {
    var set = currentSet();
    if (!set) return;
    /* 総合問題は「すべて通す」で新しい10問を引く */
    if (isMix(set.id) && (mode === "all" || !set.basic.length)) drawMix();
    var all = (set[step] || []).slice();
    if (!all.length) { toast("この STEP に問題がありません。"); return; }

    var pool;
    if (mode === "all") {
      pool = all;
    } else {
      pool = all.filter(function (q) { return !qstat(set.id, step, q.id).cleared; });
      if (!pool.length) pool = all;
    }
    /* ランダムに並べ替える（Fisher-Yates） */
    pool = pool.slice();
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }

    session = {
      setId: set.id,
      step: step,
      queue: pool.map(function (q) { return q.id; }),
      idx: 0,
      revealed: false,
      correct: 0,
      wrong: 0,
      missed: [],
      done: false
    };

    var t = todayKey();
    var d = state.daily[t] || (state.daily[t] = { sessions: 0, correct: 0, wrong: 0 });
    d.sessions++;
    state.lastStudied = t;
    prog(set.id).lastStudied = t;
    save();
    render();
  }

  function sessionQuestion() {
    if (!session) return null;
    var set = getSet(session.setId);
    if (!set) return null;
    var qid = session.queue[session.idx];
    var list = set[session.step] || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === qid) return list[i];
    return null;
  }

  function renderSession() {
    var set = getSet(session.setId);
    var total = stepTotal(session.setId, session.step);

    if (session.done) {
      var done = session.snapDone != null
        ? session.snapDone
        : clearedCount(session.setId, session.step);
      var perfect = done === total;
      /* 全問を一度も間違えずに通した（部分的なやり直しは含めない） */
      var noMiss = perfect && session.wrong === 0 && session.queue.length === total;
      var step2Locked = session.step === "basic" && !perfect;
      var html = '<div class="card stack" style="padding:20px">' +
        '<div class="result-head">' +
          '<h3>' + (session.step === "basic" ? "STEP 1 基本文" : "STEP 2 類似問題") + '</h3>' +
          '<div class="result-score"><b>' + done + '</b><span>/ ' + total + '</span></div>' +
          '<span class="badge ' + (perfect ? "ok" : "mid") + '">' +
            (perfect ? (session.step === "basic" && hasStep(session.setId, "similar")
                          ? "10/10 達成 — STEP 2 解放！" : "10/10 達成 — セット完走！")
                     : "クリア済み " + done + " 問 / 今回 ○" + session.correct + " ×" + session.wrong) +
          "</span>" +
        "</div>";

      if (!perfect) {
        var remainQ = (set[session.step] || []).filter(function (q) {
          return !qstat(session.setId, session.step, q.id).cleared;
        });
        html += '<ul class="misslist">' + remainQ.map(function (q) {
          return "<li><span class=\"mj\">" + esc(q.ja) + '</span><span class="me">' + esc(q.en) + "</span></li>";
        }).join("") + "</ul>" +
        '<button class="btn primary big" data-act="start" data-mode="remain">未正解の ' + remainQ.length + ' 問をもう一度</button>';
      } else if (session.step === "basic" && hasStep(session.setId, "similar")) {
        html += '<button class="btn primary big" data-act="start" data-mode="remain" data-step="similar">STEP 2 の類似問題へ</button>';
      } else if (session.lapAchieved) {
        html += '<button class="btn primary big" data-act="start" data-mode="all" data-step="basic">' +
          (isMix(session.setId)
            ? "新しい" + MIX_SIZE + "問をひく"
            : session.lapAchieved + 1 + "周目をはじめる（STEP 1 から）") + '</button>';
      } else {
        html += '<button class="btn primary big" data-act="start" data-mode="all">もう一度 10 問まわす</button>';
      }

      var banners = (noMiss ? '<div class="lap-banner nomiss">ノーミス達成</div>' : "") +
        (session.lapAchieved ? '<div class="lap-banner">★ ' + session.lapAchieved + '周目 達成</div>' : "");
      if (banners) {
        html = html.replace('<div class="result-head">', banners + '<div class="result-head">');
      }
      html += '<button class="btn ghost" data-act="end">練習をおわる</button>' + "</div>";
      if (noMiss) html += cheerBlock("10問ノーミス。文句なしです！", done, total, "perfect");
      else if (!step2Locked && perfect) html += cheerBlock("よくやりました。この調子！", done, total);
      else html += cheerBlock("あと少し。間違えた文だけ、もう一周。", done, total);
      return html;
    }

    var q = sessionQuestion();
    if (!q) return '<div class="card"><p class="empty">問題を読み込めませんでした。</p>' +
      '<button class="btn ghost" data-act="end">もどる</button></div>';

    var st = qstat(session.setId, session.step, q.id);
    var pos = session.idx + 1;
    var n = session.queue.length;

    var out = '<div class="sess-top">' +
        '<span class="qnum">' + pos + "<em>/" + n + "</em></span>" +
        '<span class="tag">' + STEP_LABEL[session.step] + "</span>" +
        '<span class="score">○' + session.correct + " ×" + session.wrong + "</span>" +
      "</div>" +
      '<div class="pbar"><i style="width:' + pct(session.idx, n) + '%"></i></div>' +
      '<div class="card q-card">' +
        '<div class="tick-row" id="tickRow"><span class="tick"><i></i></span>' +
        '<span class="tick-label" id="tickLabel">3秒で言ってみる</span></div>' +
        (st.wrong >= FOCUS_THRESHOLD ? '<div class="hint-chips"><span class="hint">重点復習 ×' + st.wrong + "</span></div>" : "") +
        '<p class="ja-q">' + esc(q.ja) + "</p>" +
        '<div class="ans"' + (session.revealed ? "" : " hidden") + ">" +
          '<p class="en">' + esc(q.en) + "</p>" +
          ((q.alt && q.alt.length) ? '<ul class="alts">' + q.alt.map(function (a) {
            return "<li>" + esc(a) + "</li>";
          }).join("") + "</ul>" : "") +
          (q.note ? '<p class="note">' + esc(q.note) + "</p>" : "") +
        "</div>" +
      "</div>" +
      '<div class="actions' + (session.revealed ? " pair" : "") + '">' +
        (session.revealed
          ? '<button class="btn no big" data-act="grade" data-v="0">言えなかった</button>' +
            '<button class="btn ok big" data-act="grade" data-v="1">言えた</button>'
          : '<button class="btn primary big" data-act="reveal">正解を見る</button>') +
      "</div>" +
      '<button class="btn ghost" data-act="end">中断する</button>';
    return out;
  }

  function afterSessionRender() {
    if (tickTimer) { clearTimeout(tickTimer); tickTimer = null; }
    if (!session || session.done || session.revealed) return;
    tickTimer = setTimeout(function () {
      var row = document.getElementById("tickRow");
      var label = document.getElementById("tickLabel");
      if (row) row.classList.add("over");
      if (label) label.textContent = "3秒経過";
    }, 3000);
  }

  function reveal() {
    if (!session) return;
    session.revealed = true;
    render();
  }

  function grade(ok) {
    if (!session) return;
    var q = sessionQuestion();
    if (!q) return;
    var st = qstat(session.setId, session.step, q.id);
    var t = todayKey();
    var d = state.daily[t] || (state.daily[t] = { sessions: 1, correct: 0, wrong: 0 });

    /* 日ごと × セット × STEP の内訳も残す（記録タブの推移用） */
    if (!d.sets) d.sets = {};
    var dset = d.sets[session.setId] ||
      (d.sets[session.setId] = { basic: { c: 0, w: 0 }, similar: { c: 0, w: 0 } });
    var cell = dset[session.step] || (dset[session.step] = { c: 0, w: 0 });

    if (ok) {
      st.correct++; st.cleared = true; session.correct++; d.correct++; cell.c++;
    } else {
      st.wrong++; st.cleared = false; session.wrong++; d.wrong++; cell.w++;
      session.missed.push(q.id);
    }
    state.lastStudied = t;
    var pg = prog(session.setId);
    pg.lastStudied = t;

    /* 基本・類似の両方が全問クリアになった瞬間に1周ぶん数える。
       次の周は「進捗をリセット」してから始める */
    if (!pg.lapCounted && isSetCleared(session.setId)) {
      pg.laps++;
      session.lapAchieved = pg.laps;
      /* 結果画面はこの時点のスコアを表示し、進捗は次の周のために戻しておく */
      session.snapDone = clearedCount(session.setId, session.step);
      startNewLap(session.setId);
    }

    session.idx++;
    session.revealed = false;
    if (session.idx >= session.queue.length) session.done = true;
    save();
    render();
  }

  /* ============================================================
     記録ビュー
     ============================================================ */

  /* ---- 集計ヘルパー ---- */

  function dayTotal(k) {
    var d = state.daily[k];
    if (!d) return { c: 0, w: 0, n: 0 };
    var c = d.correct || 0, w = d.wrong || 0;
    return { c: c, w: w, n: c + w };
  }

  function setDayTotal(k, setId) {
    var d = state.daily[k];
    var s = d && d.sets && d.sets[setId];
    if (!s) return { c: 0, w: 0, n: 0 };
    var c = 0, w = 0;
    ["basic", "similar"].forEach(function (step) {
      if (s[step]) { c += s[step].c || 0; w += s[step].w || 0; }
    });
    return { c: c, w: w, n: c + w };
  }

  function streakDays() {
    var i = dayTotal(todayKey()).n ? 0 : 1; /* 今日まだなら昨日までを数える */
    var n = 0;
    for (; i < 400; i++) {
      if (!dayTotal(daysAgo(i)).n) break;
      n++;
    }
    return n;
  }

  /* ---- 図 ---- */

  function dailyBars(days, max) {
    var today = todayKey();
    return '<div class="vbars">' + days.map(function (k) {
      var t = dayTotal(k);
      var h = t.n ? Math.max(5, Math.round(t.n / max * 100)) : 0;
      var cp = t.n ? Math.round(t.c / t.n * 100) : 0;
      return '<div class="vbar' + (k === today ? " today" : "") + '" title="' +
          esc(fmtDate(k) + "　○" + t.c + " ×" + t.w) + '">' +
        '<span class="col"><span class="stack" style="height:' + h + '%">' +
          (t.w ? '<i class="w" style="height:' + (100 - cp) + '%"></i>' : "") +
          (t.c ? '<i class="g" style="height:' + cp + '%"></i>' : "") +
        '</span></span>' +
        '<span class="lbl">' + k.slice(8) + '</span>' +
      '</div>';
    }).join("") + '</div>';
  }

  function sparkline(rates) {
    if (rates.length < 2) return "";
    var w = 76, h = 24, pad = 3;
    var step = (w - pad * 2) / (rates.length - 1);
    var pts = rates.map(function (r, i) {
      var x = pad + i * step;
      var y = pad + (100 - r) / 100 * (h - pad * 2);
      return x.toFixed(1) + "," + y.toFixed(1);
    });
    var last = pts[pts.length - 1].split(",");
    return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" aria-hidden="true">' +
      '<polyline points="' + pts.join(" ") + '" fill="none" stroke="var(--accent)" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round"></polyline>' +
      '<circle cx="' + last[0] + '" cy="' + last[1] + '" r="2.8" fill="var(--accent)" ' +
        'stroke="var(--surface)" stroke-width="2"></circle>' +
    '</svg>';
  }

  function stepMeter(label, done, total) {
    return '<div class="meter"><span class="m-l">' + label + '</span>' +
      '<span class="mini-bar"><i class="' + (total && done === total ? "full" : "") +
        '" style="width:' + pct(done, total) + '%"></i></span>' +
      '<span class="m-n">' + done + "/" + total + '</span></div>';
  }

  function setHistory(setId) {
    var out = [];
    Object.keys(state.daily).sort().forEach(function (k) {
      var t = setDayTotal(k, setId);
      if (t.n) out.push({ k: k, rate: Math.round(t.c / t.n * 100), n: t.n });
    });
    return out;
  }

  function progressRows() {
    var sets = state.sets.slice().sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
    if (!sets.length) return '<p class="empty">セットがありません。</p>';
    return sets.map(function (s) {
      var hist = setHistory(s.id).slice(-10);
      var last = hist.length ? hist[hist.length - 1] : null;
      var prev = hist.length > 1 ? hist[hist.length - 2] : null;
      var d = (last && prev) ? last.rate - prev.rate : null;
      return '<div class="prog-row">' +
        '<div class="pr-top"><span class="date">' + esc(setDateLabel(s)) + '</span>' +
          '<span class="t">' + esc(s.title || "レッスンセット") + '</span></div>' +
        '<div class="pr-steps">' +
          stepMeter("基本", clearedCount(s.id, "basic"), stepTotal(s.id, "basic")) +
          (hasStep(s.id, "similar")
            ? stepMeter("類似", clearedCount(s.id, "similar"), stepTotal(s.id, "similar")) : "") +
        '</div>' +
        (last
          ? '<div class="pr-trend">' + sparkline(hist.map(function (x) { return x.rate; })) +
              '<span class="pr-rate">' + last.rate + '<em>%</em></span>' +
              (d === null ? "" : '<span class="delta ' + (d > 0 ? "up" : d < 0 ? "down" : "flat") + '">' +
                (d > 0 ? "▲+" + d : d < 0 ? "▼" + Math.abs(d) : "±0") + '</span>') +
              '<span class="pr-note">' + fmtDate(last.k) + "の正答率" +
                (hist.length > 1 ? "（練習した" + hist.length + "日分の推移）" : "") + '</span>' +
            '</div>'
          : '<p class="pr-note">まだ練習の記録がありません。</p>') +
      '</div>';
    }).join("");
  }

  function dayTable(days) {
    var rows = days.slice().reverse().filter(function (k) { return dayTotal(k).n; });
    if (!rows.length) return '<p class="empty">まだ記録がありません。</p>';
    return '<table class="daytable"><thead><tr><th>日付</th><th>解答</th><th>正解</th><th>正答率</th></tr></thead><tbody>' +
      rows.map(function (k) {
        var t = dayTotal(k);
        return "<tr><td>" + fmtDate(k) + "</td><td>" + t.n + "</td><td>" + t.c +
          "</td><td>" + pct(t.c, t.n) + "%</td></tr>";
      }).join("") + "</tbody></table>";
  }

  /* ---- 記録タブ ---- */

  function renderStats() {
    var el = document.getElementById("v-stats");
    var totalC = 0, totalW = 0;
    Object.keys(state.daily).forEach(function (k) {
      var t = dayTotal(k);
      totalC += t.c; totalW += t.w;
    });
    var days = recentDays(14);
    var max = 1;
    days.forEach(function (k) { var n = dayTotal(k).n; if (n > max) max = n; });
    var week = 0;
    recentDays(7).forEach(function (k) { week += dayTotal(k).n; });
    var hasData = (totalC + totalW) > 0;

    var html = '<div class="tiles">' +
      '<div class="tile"><b>' + streakDays() + '<em>日</em></b><small>連続学習</small></div>' +
      '<div class="tile"><b>' + week + '<em>問</em></b><small>この7日間</small></div>' +
      '<div class="tile"><b>' + pct(totalC, totalC + totalW) + '<em>%</em></b><small>通算正答率</small></div>' +
    '</div>';

    html += '<div class="card stack">' +
      '<div class="ch-head"><h3>日ごとの練習量</h3>' +
        '<span class="legend"><i class="g"></i>正解<i class="w"></i>不正解</span></div>' +
      (hasData
        ? dailyBars(days, max) +
          '<p class="lede" style="margin:0">直近14日。棒の高さはその日の解答数（いちばん多い日で ' + max + '問）。</p>' +
          '<details class="fold"><summary>数字で見る</summary><div class="fold-body">' +
            dayTable(days) + '</div></details>'
        : '<p class="empty">まだ記録がありません。練習をはじめると、ここに日ごとの棒が並びます。</p>') +
    '</div>';

    html += '<div class="card stack"><h3>セットごとの伸び</h3>' +
      '<p class="lede" style="margin:0">折れ線は、そのセットを練習した日ごとの正答率です。</p>' +
      progressRows() + '</div>';

    var allFocus = [];
    state.sets.forEach(function (s) {
      focusItems(s.id).forEach(function (f) { f.set = s; allFocus.push(f); });
    });
    allFocus.sort(function (a, b) { return b.wrong - a.wrong; });
    html += '<div class="card stack"><h3>重点復習問題</h3>' +
      (allFocus.length
        ? '<ul class="focus-list">' + allFocus.slice(0, 12).map(function (f) {
            return "<li><span class=\"fj\">" + esc(f.q.ja) + '</span><span class="fx">×' + f.wrong + "</span>" +
              '<span class="fe">' + esc(f.q.en) + "（" + esc(setDateLabel(f.set)) + "・" +
              (f.step === "basic" ? "基本" : "類似") + "）</span></li>";
          }).join("") + "</ul>"
        : '<p class="empty">' + FOCUS_THRESHOLD + "回以上間違えた問題はまだありません。</p>") +
      "</div>";

    html += '<div class="card stack">' +
      '<details class="fold"><summary>学習データの書き出し・読み込み</summary><div class="fold-body">' +
        '<p class="lede" style="margin:0">機種変更やバックアップ用。下の JSON をコピーして保管し、' +
        '新しい端末で貼り付けて「復元する」を押します。</p>' +
        '<textarea id="dataText">' + esc(JSON.stringify(state)) + "</textarea>" +
        '<div class="row"><button class="btn-sm" data-act="copy-data">コピー</button>' +
        '<button class="btn-sm" data-act="restore-data">この内容で復元する</button></div>' +
        (ui.dataMsg ? '<div class="msg ' + ui.dataMsg.kind + '">' + esc(ui.dataMsg.text) + "</div>" : "") +
      '</div></details>' +
    '</div>';

    el.innerHTML = html;
  }

  function lapStars(n) {
    if (!n) {
      return '<p class="laps empty">全問クリアすると★がつきます。</p>';
    }
    var stars = "";
    for (var i = 0; i < Math.min(n, 10); i++) stars += "★";
    return '<p class="laps"><span class="stars">' + stars + '</span>' +
      '<span class="laps-n">' + n + '周</span></p>';
  }

  function renderSets() {
    var el = document.getElementById("v-sets");
    var sets = state.sets.slice().sort(function (a, b) {
      if (isMix(a.id) !== isMix(b.id)) return isMix(a.id) ? -1 : 1; /* 総合問題は先頭 */
      return String(b.date).localeCompare(String(a.date));
    });
    var html = '<div class="card"><h2>問題セット</h2>' +
      '<p class="lede">日付ごとに管理しています。タップで切り替え。過去のセットにもいつでも戻れます。</p></div>';

    html += '<div class="setlist">' + sets.map(function (s) {
      var bc = clearedCount(s.id, "basic"), bt = stepTotal(s.id, "basic");
      var sc = clearedCount(s.id, "similar"), stt = stepTotal(s.id, "similar");
      var cur = s.id === state.currentSetId;
      var confirming = ui.confirm === "del:" + s.id;
      return '<div class="set-item" data-current="' + (cur ? "1" : "0") + '">' +
        '<div class="set-head"><span class="date">' + esc(setDateLabel(s)) + "</span>" +
        '<span class="t">' + esc(s.title || "レッスンセット") + "</span>" +
        (cur ? '<span class="pill done">使用中</span>' : "") + "</div>" +
        '<div class="set-meta">講師: ' + esc(s.teacher || "未記入") + "　/　ID: " + esc(s.id) + "</div>" +
        '<div class="pills">' +
          '<span class="pill' + (bt && bc === bt ? " done" : "") + '">基本 ' + bc + "/" + bt + "</span>" +
          (stt ? '<span class="pill' + (sc === stt ? " done" : "") + '">類似 ' + sc + "/" + stt + "</span>" : "") +
        "</div>" +
        lapStars(prog(s.id).laps) +
        '<div class="row">' +
          (cur ? "" : '<button class="btn-sm" data-act="use-set" data-id="' + esc(s.id) + '">このセットで練習</button>') +
          '<button class="btn-sm" data-act="reset-set" data-id="' + esc(s.id) + '">進捗をリセット</button>' +
          (confirming
            ? '<button class="btn-sm danger" data-act="del-set" data-id="' + esc(s.id) + '">本当に削除</button>' +
              '<button class="btn-sm" data-act="cancel-confirm">やめる</button>'
            : '<button class="btn-sm danger" data-act="ask-del" data-id="' + esc(s.id) + '">削除</button>') +
        "</div>" +
      "</div>";
    }).join("") + "</div>";

    el.innerHTML = html;
  }
  function restoreData() {
    var ta = document.getElementById("dataText");
    if (!ta) return;
    var data;
    try { data = JSON.parse(ta.value); }
    catch (e) { ui.dataMsg = { kind: "bad", text: "JSON として読み取れませんでした。" }; renderStats(); return; }
    if (!data || !Array.isArray(data.sets)) {
      ui.dataMsg = { kind: "bad", text: "このアプリの書き出しデータではないようです。" };
      renderStats(); return;
    }
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* 続行 */ }
    state = load();
    session = null;
    ui.dataMsg = { kind: "good", text: "学習データを復元しました。" };
    render();
  }

  function copyText(text, okMsg) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      toast(ok ? okMsg : "コピーできませんでした。長押しで選択してください。");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, fallback);
    } else { fallback(); }
  }

  /* ============================================================
     応援キャラ画像
     ============================================================ */

  function handleCheerFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        try {
          var max = 320;
          var scale = Math.min(1, max / Math.max(img.width, img.height));
          var w = Math.max(1, Math.round(img.width * scale));
          var h = Math.max(1, Math.round(img.height * scale));
          var c = document.createElement("canvas");
          c.width = w; c.height = h;
          c.getContext("2d").drawImage(img, 0, 0, w, h);
          state.cheerImage = c.toDataURL("image/jpeg", 0.82);
        } catch (e) {
          state.cheerImage = reader.result;
        }
        save();
        render();
        toast("応援キャラの画像を設定しました");
      };
      img.onerror = function () { toast("画像を読み込めませんでした。"); };
      img.src = reader.result;
    };
    reader.onerror = function () { toast("画像を読み込めませんでした。"); };
    reader.readAsDataURL(file);
  }

  /* ============================================================
     レンダリング & イベント
     ============================================================ */

  function render() {
    var set = currentSet();
    var label = document.getElementById("setLabel");
    if (label) {
      label.textContent = set
        ? ((set.date ? set.date + "　" : "") + (set.title || ""))
        : "セットなし";
    }

    var chip = document.getElementById("todayChip");
    if (chip) {
      var d = state.daily[todayKey()];
      chip.textContent = d ? "今日 ○" + (d.correct || 0) + " ×" + (d.wrong || 0) : "今日 まだ0問";
    }

    ["practice", "stats", "sets"].forEach(function (name) {
      var v = document.getElementById("v-" + name);
      if (v) v.hidden = name !== ui.tab;
    });
    var btns = document.querySelectorAll(".tabbar button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-current", btns[i].getAttribute("data-tab") === ui.tab ? "true" : "false");
    }

    if (ui.tab === "practice") renderPractice();
    else if (ui.tab === "stats") renderStats();
    else renderSets();
  }

  function onClick(e) {
    var t = e.target.closest("[data-act]");
    if (!t) return;
    var act = t.getAttribute("data-act");

    if (act === "tab") {
      ui.tab = t.getAttribute("data-tab");
      ui.confirm = null;
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (act === "pick-step") {
      var step = t.getAttribute("data-step");
      if (step === "similar" && !isStepCleared(state.currentSetId, "basic")) {
        toast("基本文を10問すべて正解すると解放されます");
        return;
      }
      ui.step = step;
      session = null;
      render();
      return;
    }
    if (act === "start") {
      var s = t.getAttribute("data-step") || ui.step;
      if (s === "similar" && !isStepCleared(state.currentSetId, "basic")) {
        toast("基本文を10問すべて正解すると解放されます");
        return;
      }
      ui.step = s;
      startSession(s, t.getAttribute("data-mode") || "remain");
      window.scrollTo(0, 0);
      return;
    }
    if (act === "reveal") { reveal(); return; }
    if (act === "grade") { grade(t.getAttribute("data-v") === "1"); return; }
    if (act === "end") { session = null; render(); return; }

    if (act === "use-set") {
      state.currentSetId = t.getAttribute("data-id");
      ui.step = "basic";
      ui.tab = "practice";
      session = null;
      save();
      render();
      return;
    }
    if (act === "reset-set") {
      var id = t.getAttribute("data-id");
      var keep = prog(id);
      state.progress[id] = {
        basic: {}, similar: {}, lastStudied: keep.lastStudied,
        laps: keep.laps, lapCounted: false
      };
      save();
      render();
      toast("進捗をリセットしました");
      return;
    }
    if (act === "ask-del") { ui.confirm = "del:" + t.getAttribute("data-id"); render(); return; }
    if (act === "cancel-confirm") { ui.confirm = null; render(); return; }
    if (act === "del-set") {
      var did = t.getAttribute("data-id");
      state.sets = state.sets.filter(function (x) { return x.id !== did; });
      delete state.progress[did];
      if (state.currentSetId === did) state.currentSetId = state.sets.length ? state.sets[0].id : null;
      ui.confirm = null;
      session = null;
      save();
      render();
      toast("セットを削除しました");
      return;
    }

    if (act === "copy-data") {
      var ta = document.getElementById("dataText");
      copyText(ta ? ta.value : "", "学習データをコピーしました");
      return;
    }
    if (act === "restore-data") { restoreData(); return; }
    if (act === "pick-cheer") {
      var f = document.getElementById("cheerFile");
      if (f) f.click();
      return;
    }
  }

  /* ============================================================
     起動
     ============================================================ */

  function boot() {
    var root = document.getElementById("app");
    root.innerHTML = SHELL;
    state = load();
    if (!getSet(state.currentSetId) && state.sets.length) state.currentSetId = state.sets[0].id;
    /* 総合問題がまだ空なら、ここで10問引いておく（セットタブで 0/0 と出ないように） */
    var mixSet = getSet(MIX_ID);
    if (mixSet && !mixSet.basic.length) drawMix();

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target.getAttribute && e.target.getAttribute("data-act") === "pick-cheer") {
        e.preventDefault();
        var f = document.getElementById("cheerFile");
        if (f) f.click();
      }
    });
    var cf = document.getElementById("cheerFile");
    if (cf) cf.addEventListener("change", function () {
      handleCheerFile(cf.files && cf.files[0]);
      cf.value = "";
    });

    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
