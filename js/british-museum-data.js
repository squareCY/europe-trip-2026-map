window.BM = {
  meta: {
    date: "10.5",
    weekday: "周一",
    enter: "10:20",
    highlightEnd: "12:20",
    leaveBy: "13:20",
    next: "15:10 塔桥",
    mapNote: "北在上，南门在下方。按 2026 年 5 月馆方地图的相对位置绘制，不是比例测绘图。平面图可以滑动。",
    foot: "收费特展《Korea》不在这三小时里。Room 10 若关着，跳过即可。"
  },
  floors: [
    { id: "ground", name: "地面层" },
    { id: "upper", name: "楼上" },
    { id: "lower", name: "下层" }
  ],
  rooms: [
    { id: "r24", floor: "ground", num: "24", name: "生与死", lines: ["24", "生与死"], x: 20, y: 28, w: 300, h: 100, kind: "stop" },
    { id: "r26", floor: "ground", num: "26", name: "北美", lines: ["26", "穿过"], x: 328, y: 28, w: 100, h: 100, kind: "skip" },
    { id: "r27", floor: "ground", num: "27", name: "墨西哥", lines: ["27", "墨西哥"], x: 436, y: 28, w: 140, h: 100, kind: "stop" },
    { id: "r33", floor: "ground", num: "33", name: "中国与南亚", lines: ["33", "中国与南亚"], x: 592, y: 28, w: 228, h: 176, kind: "browse" },
    { id: "r18", floor: "ground", num: "18", name: "帕特农", lines: ["18", "帕特农"], x: 20, y: 140, w: 228, h: 108, kind: "stop" },
    { id: "r17", floor: "ground", num: "17", name: "涅瑞伊得", lines: ["17", "路过"], x: 256, y: 140, w: 64, h: 108, kind: "skip" },
    { id: "r10", floor: "ground", num: "10", name: "猎狮", lines: ["10", "若开放"], x: 20, y: 260, w: 118, h: 104, kind: "spur" },
    { id: "r68", floor: "ground", num: "6–8", name: "亚述", lines: ["6–8", "亚述"], x: 146, y: 260, w: 174, h: 104, kind: "stop" },
    { id: "r4", floor: "ground", num: "4", name: "埃及雕塑", lines: ["4", "埃及雕塑"], x: 146, y: 364, w: 174, h: 208, kind: "stop" },
    { id: "wstairs", floor: "ground", num: "", name: "西楼梯", lines: ["西楼梯"], x: 146, y: 572, w: 190, h: 48, kind: "stairs" },
    { id: "court", floor: "ground", num: "", name: "大中庭", lines: ["大中庭"], x: 336, y: 140, w: 240, h: 432, kind: "court" },
    { id: "entrance", floor: "ground", num: "", name: "南门", lines: ["南门"], x: 336, y: 572, w: 240, h: 48, kind: "entrance" },
    { id: "r1", floor: "ground", num: "1", name: "启蒙厅", lines: ["1", "启蒙厅"], x: 592, y: 216, w: 228, h: 156, kind: "browse" },
    { id: "r2a", floor: "ground", num: "2a", name: "圣荆棘", lines: ["2a", "圣荆棘"], x: 592, y: 384, w: 148, h: 120, kind: "browse" },
    { id: "estairs", floor: "ground", num: "", name: "东楼梯", lines: ["东梯"], x: 752, y: 384, w: 68, h: 120, kind: "stairs" },

    { id: "r40", floor: "upper", num: "40", name: "中世纪欧洲", lines: ["40", "棋子"], x: 20, y: 28, w: 200, h: 120, kind: "stop" },
    { id: "r41", floor: "upper", num: "41", name: "萨顿胡", lines: ["41", "萨顿胡"], x: 228, y: 28, w: 190, h: 120, kind: "stop" },
    { id: "r52", floor: "upper", num: "52", name: "古伊朗", lines: ["52", "奥克苏斯"], x: 426, y: 28, w: 150, h: 120, kind: "stop" },
    { id: "r5356", floor: "upper", num: "53–56", name: "两河流域", lines: ["53–56", "今天关闭"], x: 592, y: 28, w: 228, h: 120, kind: "closed" },
    { id: "r6263", floor: "upper", num: "62–63", name: "木乃伊", lines: ["62–63", "木乃伊"], x: 20, y: 160, w: 248, h: 316, kind: "stop" },
    { id: "r6466", floor: "upper", num: "64–66", name: "埃及余厅", lines: ["64–66", "不进"], x: 276, y: 300, w: 88, h: 176, kind: "skip" },
    { id: "uwstairs", floor: "upper", num: "", name: "西楼梯", lines: ["西楼梯上来"], x: 20, y: 476, w: 248, h: 48, kind: "stairs" },
    { id: "ucourt", floor: "upper", num: "", name: "中庭上空", lines: ["中庭上空"], x: 380, y: 160, w: 196, h: 364, kind: "court" },
    { id: "r9294", floor: "upper", num: "92–94", name: "日本", lines: ["92–94", "日本"], x: 592, y: 160, w: 228, h: 148, kind: "browse" },
    { id: "r70", floor: "upper", num: "70", name: "罗马帝国", lines: ["70", "波特兰瓶"], x: 592, y: 320, w: 228, h: 140, kind: "browse" },
    { id: "uestairs", floor: "upper", num: "", name: "东楼梯", lines: ["东楼梯"], x: 592, y: 472, w: 228, h: 52, kind: "stairs" },

    { id: "r25", floor: "lower", num: "25", name: "非洲", lines: ["25", "非洲"], x: 36, y: 72, w: 460, h: 250, kind: "browse" },
    { id: "lstairs", floor: "lower", num: "", name: "北侧楼梯", lines: ["北侧楼梯", "上下层"], x: 516, y: 72, w: 200, h: 88, kind: "stairs" }
  ],
  groundPath: [
    { x: 456, y: 596 },
    { x: 456, y: 470 },
    { x: 360, y: 500 },
    { x: 233, y: 520, stop: 1 },
    { x: 233, y: 400 },
    { x: 233, y: 312, stop: 2 },
    { x: 288, y: 312 },
    { x: 288, y: 194 },
    { x: 134, y: 194, stop: 3 },
    { x: 170, y: 78 },
    { x: 506, y: 78, stop: 4 },
    { x: 506, y: 220 },
    { x: 456, y: 420 },
    { x: 400, y: 520 },
    { x: 348, y: 555 },
    { x: 300, y: 596, stop: 5 }
  ],
  groundSpur: [
    { x: 233, y: 312 },
    { x: 79, y: 312 }
  ],
  upperPath: [
    { x: 144, y: 500 },
    { x: 144, y: 340, stop: 6 },
    { x: 144, y: 190 },
    { x: 120, y: 88, stop: 7 },
    { x: 323, y: 88 },
    { x: 501, y: 88, stop: 8 }
  ],
  highlights: [
    {
      id: "s1",
      order: 1,
      floor: "ground",
      minutes: 15,
      title: "埃及雕塑",
      rooms: ["r4"],
      badge: { x: 172, y: 528 },
      how: "从南门进大中庭，向西走进埃及厅南端。先看罗塞塔石碑，再沿厅向北到拉美西斯二世巨像。其余雕像不看。北端接着亚述厅。",
      objects: [
        {
          name: "罗塞塔石碑",
          intro: "公元前196年埃及祭司法令，同一篇文字用象形文字、世俗体和希腊文各写一遍。1822年商博良对照希腊文读通象形文字。石碑在本厅南端，看清三栏即可。"
        },
        {
          name: "拉美西斯二世巨像",
          intro: "底比斯拉美修姆神庙的花岗岩巨像残段，英国人称之为「年轻门农」。沿本厅向北、靠近北端就能看见。只看这一尊，其余雕像路过。"
        }
      ]
    },
    {
      id: "s2",
      order: 2,
      floor: "ground",
      minutes: 20,
      title: "亚述",
      rooms: ["r68"],
      optionalRooms: ["r10"],
      badge: { x: 300, y: 286 },
      how: "从埃及厅北端进入。约 12 分钟看人首翼牛和尼姆鲁德浮雕，另约 8 分钟给西侧 Room 10。猎狮厅开着就进、看完原路退回；没开就把这 8 分钟留给后面。Room 9 同样是侧厅，不专程找。",
      objects: [
        {
          name: "人首翼牛",
          intro: "亚述王萨尔贡二世在霍尔萨巴德宫殿门口的守护兽，人首、牛身、有翼。从埃及厅北端进 Room 6 就是。正面看它站着，侧面看它在走，所以刻了五条腿。"
        },
        {
          name: "尼姆鲁德宫殿浮雕",
          intro: "Room 7 和 8 是尼姆鲁德宫殿的石膏墙面，刻着国王、神兽和祭祀行列。顺着主墙走一遍，不用停下来读每块说明牌。"
        },
        {
          name: "猎狮浮雕",
          intro: "亚述巴尼拔在尼尼微宫殿的石膏浮雕，把一次猎狮画成连续画面。Room 10 是侧袋厅：开着就进，看完从原路退回。若关闭，不必寻找替代入口。"
        }
      ]
    },
    {
      id: "s3",
      order: 3,
      floor: "ground",
      minutes: 15,
      title: "帕特农",
      rooms: ["r18"],
      passRooms: ["r17"],
      badge: { x: 46, y: 164 },
      how: "从亚述厅向北，经过 Room 17 的涅瑞伊得纪念碑，进入西侧帕特农厅。看山墙和长浮雕即可。Room 19–23 不进。",
      objects: [
        {
          name: "帕特农雕刻",
          intro: "公元前447至432年雅典卫城神庙外侧的大理石雕刻。认东、西山墙上斜倚的狄俄尼索斯和彩虹女神伊里斯，再沿墙看一长条游行浮雕。Room 17 路过，不停留。"
        }
      ]
    },
    {
      id: "s4",
      order: 4,
      floor: "ground",
      minutes: 12,
      title: "石像与双头蛇",
      rooms: ["r24", "r27"],
      passRooms: ["r26"],
      badge: { x: 460, y: 52 },
      how: "出帕特农厅向北，进 Room 24 只找复活节岛石像。再向东到 Room 27 找双头蛇。中间会穿过北美厅，不要停留。",
      objects: [
        {
          name: "Hoa Hakananai'a",
          intro: "拉帕努伊（复活节岛）的玄武岩祖先石像，1868年被英国军舰运走。Room 24 很大，进门先找这一尊，找到就离开，不必逛完「生与死」主题。"
        },
        {
          name: "绿松石双头蛇",
          intro: "墨西卡人的礼仪胸饰，木胎镶满绿松石，两头蛇相对成一环，约15世纪末至16世纪初。Room 27 里只找这一件。北美厅不停留。"
        }
      ]
    },
    {
      id: "s5",
      order: 5,
      floor: "ground",
      minutes: 4,
      title: "穿大中庭上楼",
      rooms: ["court", "wstairs"],
      badge: { x: 172, y: 596 },
      how: "从墨西哥厅南边回到大中庭，走到南端靠西的西楼梯。不要为了上楼再把埃及厅走一遍。上楼后就是木乃伊厅。",
      objects: []
    },
    {
      id: "s6",
      order: 6,
      floor: "upper",
      minutes: 18,
      title: "木乃伊",
      rooms: ["r6263"],
      badge: { x: 48, y: 190 },
      how: "西楼梯上来就是 Room 62–63。看下面三件即可。东侧 Room 64–66 不进。看完向北去中世纪厅。",
      objects: [
        {
          name: "胡内弗尔《亡灵书》",
          intro: "纸莎草画卷里最常被停下来看的一页：死者的心脏放在天平上，与代表正义的羽毛称重。通过了，才能进入来世。在本厅找这一幅。"
        },
        {
          name: "霍内吉泰夫内棺",
          intro: "人形彩绘内棺，棺盖绘着死者的脸和宽项圈，周围写满护佑咒语。它是这间厅里最容易认的一具人形棺。看清棺盖即可，不必读完铭文。"
        },
        {
          name: "猫木乃伊",
          intro: "猫被视为女神巴斯特的化身，死后同样涂油、裹布下葬。橱里有猫形木乃伊，看一眼就行。不要拐进旁边的 64–66。"
        }
      ]
    },
    {
      id: "s7",
      order: 7,
      floor: "upper",
      minutes: 22,
      title: "棋子与萨顿胡",
      rooms: ["r40", "r41"],
      badge: { x: 46, y: 54 },
      how: "从木乃伊厅向北，先到 Room 40，再进隔壁 Room 41。两间都要进。萨顿胡厅 10 月 12 日后才局部关闭，今天可以看。",
      objects: [
        {
          name: "刘易斯棋子",
          intro: "海象牙雕成，约12世纪，多半制于挪威，1831年在苏格兰刘易斯岛出土。找咬着盾牌的狂战士兵卒，以及手托下巴的王后。"
        },
        {
          name: "萨顿胡头盔",
          intro: "约公元625年萨福克船葬出土的铁盔，表面以金和石榴石装饰，多半属于东盎格利亚国王。同柜看那件大金带扣。今天展厅开放。"
        }
      ]
    },
    {
      id: "s8",
      order: 8,
      floor: "upper",
      minutes: 8,
      title: "奥克苏斯宝藏",
      rooms: ["r52"],
      badge: { x: 448, y: 122 },
      how: "萨顿胡再往东就是 Room 52。看完金马车就停。再往东的 Room 53–56 今天关闭，看见告示不要绕。结束后下楼，漫游默认先去地面层东翼中国厅。",
      objects: [
        {
          name: "奥克苏斯金马车",
          intro: "公元前5至4世纪波斯帝国金器，发现于中亚奥克苏斯河一带。四匹马拉的小金车是这一柜的标记。东侧两河流域各厅 9 月 28 日至 10 月 9 日关闭。"
        }
      ]
    }
  ],
  browse: [
    {
      id: "b33",
      floor: "ground",
      minutes: 20,
      title: "中国与南亚",
      rooms: ["r33"],
      recommend: true,
      suggest: "12:20–12:40",
      how: "重点结束后人在楼上北侧。下东楼梯，或回大中庭再进东翼 Room 33。这是漫游的默认第一站。33a、33b 有余力再进。",
      objects: [
        {
          name: "唐代陶俑",
          intro: "Room 33 的唐代墓葬陶俑来自一位将军的墓，有人物和马匹。进东翼大厅先找这一组，看造型和釉色即可。"
        },
        {
          name: "湿婆舞王",
          intro: "南印度朱罗王朝青铜，湿婆在火环中起舞，一足踏着侏儒。与唐俑同厅。看完这一尊，余力再进印度石雕和玉器小厅。"
        }
      ]
    },
    {
      id: "b25",
      floor: "lower",
      minutes: 15,
      title: "非洲厅",
      rooms: ["r25"],
      suggest: "12:40–12:55",
      how: "从北侧楼梯下到下层 Room 25。看几件头像就上来，不必把非洲厅走完。",
      objects: [
        {
          name: "贝宁青铜头像",
          intro: "16世纪贝宁城宫廷的黄铜纪念头像，通常仍叫青铜。1897年英军劫掠后入藏。看清面部刻纹和头冠，看两三件就离开。"
        }
      ]
    },
    {
      id: "b2a",
      floor: "ground",
      minutes: 15,
      title: "离馆前南侧",
      rooms: ["r2a", "r1"],
      suggest: "12:55–13:10",
      how: "到东南角。先看 Room 2a 的圣物匣，有余力沿 Room 1 长廊扫一眼书架。然后出南门。",
      objects: [
        {
          name: "圣荆棘圣物匣",
          intro: "约1400年巴黎制作的金胎圣物匣，据说嵌着基督荆冠上的一根棘刺，通体是珠宝和珐琅。在 Room 2a，离南门很近。"
        },
        {
          name: "启蒙厅",
          intro: "Room 1 是旧国王图书馆的长廊，书架和柜里按启蒙时代的分类法陈列藏品。顺路走一遍即可，不找单件。"
        }
      ]
    },
    {
      id: "b70",
      floor: "upper",
      minutes: 10,
      title: "瓶、日本或休息",
      rooms: ["r70", "r9294"],
      suggest: "13:10–13:20",
      how: "还剩约 10 分钟时二选一：楼上东侧的波特兰花瓶，或隔壁日本厅。不想再走，就在大中庭坐到 13:20 再出南门。",
      objects: [
        {
          name: "波特兰花瓶",
          intro: "公元1世纪的罗马双层玻璃瓶，深蓝底上是白色浮雕神话人物。后来成为韦奇伍德瓷器的范本。在楼上东侧 Room 70。"
        },
        {
          name: "日本厅",
          intro: "Rooms 92–94 在波特兰瓶同侧楼上，有武士刀、漆器和版画。只在这 10 分钟里扫一眼，不列入必看。"
        }
      ]
    }
  ],
  notices: {
    r26: {
      title: "Room 26 北美",
      text: "不在今天的停留计划里。从生与死厅去墨西哥厅时若从这里穿过，直接走，不要看展柜。"
    },
    r17: {
      title: "Room 17 涅瑞伊得",
      text: "去帕特农厅会从纪念碑旁边经过。抬头看一眼建筑雕刻即可，不单独停留。"
    },
    r6466: {
      title: "Room 64–66",
      text: "早期埃及等余厅。木乃伊看完向北去棋子和萨顿胡，不要拐进这几间。"
    },
    r5356: {
      title: "Room 53–56 今天关闭",
      text: "两河流域各厅 9 月 28 日至 10 月 9 日关闭。奥克苏斯宝藏看到这里就停，原路离开，不要找别的门绕进去。"
    },
    r9: {
      title: "Room 9",
      text: "尼尼微侧厅。和猎狮厅一样，开着可以看完即退，不专程绕路。"
    }
  }
};
