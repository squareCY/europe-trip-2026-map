(() => {
  const KEY = "bm-route-v1";

  const state = {
    phase: "highlight",
    hi: 0,
    bi: 0,
    floor: null,
    notice: null
  };

  load();
  clamp();

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (raw.phase === "highlight" || raw.phase === "browse") state.phase = raw.phase;
      if (Number.isInteger(raw.hi)) state.hi = raw.hi;
      if (Number.isInteger(raw.bi)) state.bi = raw.bi;
      if (!Number.isInteger(raw.hi) && Number.isInteger(raw.index)) {
        if (state.phase === "browse") state.bi = raw.index;
        else state.hi = raw.index;
      }
    } catch (err) {
      state.phase = "highlight";
    }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify({
      phase: state.phase,
      hi: state.hi,
      bi: state.bi
    }));
  }

  function items() {
    return state.phase === "browse" ? BM.browse : BM.highlights;
  }

  function index() {
    return state.phase === "browse" ? state.bi : state.hi;
  }

  function clamp() {
    if (state.hi < 0 || state.hi >= BM.highlights.length) state.hi = 0;
    if (state.bi < 0 || state.bi >= BM.browse.length) state.bi = 0;
  }

  function current() {
    return items()[index()];
  }

  function activeFloor() {
    return state.floor || current().floor;
  }

  function addMinutes(hhmm, mins) {
    const parts = hhmm.split(":").map(Number);
    const total = parts[0] * 60 + parts[1] + mins;
    return Math.floor(total / 60) + ":" + String(total % 60).padStart(2, "0");
  }

  function highlightClock(item) {
    let before = 0;
    BM.highlights.forEach((stop) => {
      if (stop.order < item.order) before += stop.minutes;
    });
    const start = addMinutes(BM.meta.enter, before);
    return {
      start: start,
      end: addMinutes(start, item.minutes),
      spent: before + item.minutes
    };
  }

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function roomById(id) {
    return BM.rooms.find((room) => room.id === id);
  }

  function go(phase, idx) {
    state.phase = phase;
    if (phase === "browse") state.bi = idx;
    else state.hi = idx;
    state.floor = null;
    state.notice = null;
    clamp();
    save();
    paint();
  }

  function showNotice(id) {
    const note = BM.notices[id];
    if (!note) return;
    state.notice = note;
    const room = roomById(id);
    if (room) state.floor = room.floor;
    paint();
  }

  function selectRoom(id) {
    const hi = BM.highlights.findIndex((stop) => {
      return stop.rooms.indexOf(id) >= 0 || (stop.optionalRooms || []).indexOf(id) >= 0;
    });
    if (hi >= 0) {
      go("highlight", hi);
      return;
    }
    const bi = BM.browse.findIndex((zone) => zone.rooms.indexOf(id) >= 0);
    if (bi >= 0) {
      go("browse", bi);
      return;
    }
    if (id === "wstairs" || id === "court") {
      go("highlight", 4);
      return;
    }
    if (id === "uwstairs") {
      go("highlight", 5);
      return;
    }
    if (id === "entrance") {
      go("highlight", 0);
      return;
    }
    if (id === "estairs") {
      go("browse", 0);
      return;
    }
    if (id === "lstairs") {
      go("browse", 1);
      return;
    }
    if (id === "uestairs" || id === "ucourt") {
      go("browse", 3);
      return;
    }
    if (BM.notices[id]) showNotice(id);
  }

  function shift(dir) {
    if (state.phase === "highlight") {
      const next = state.hi + dir;
      if (next >= 0 && next < BM.highlights.length) go("highlight", next);
      else if (next >= BM.highlights.length) go("browse", 0);
      return;
    }
    const nextB = state.bi + dir;
    if (nextB >= 0 && nextB < BM.browse.length) go("browse", nextB);
    else if (nextB < 0) go("highlight", BM.highlights.length - 1);
  }

  function paint() {
    paintPhase();
    paintFloors();
    paintMap();
    paintSteps();
    paintPanel();
    paintNav();
    document.getElementById("map-note").textContent = BM.meta.mapNote;
    document.getElementById("foot").textContent = BM.meta.foot;
    focusMap();
  }

  function paintPhase() {
    const box = document.getElementById("phase");
    box.innerHTML = [
      ["highlight", "两小时重点"],
      ["browse", "一小时漫游"]
    ].map(([id, label]) => {
      const on = state.phase === id;
      return `<button type="button" data-phase="${id}" class="${on ? "is-on" : ""}" aria-pressed="${on}">${label}</button>`;
    }).join("");
    box.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.phase === state.phase) return;
        state.phase = btn.dataset.phase;
        state.floor = null;
        state.notice = null;
        clamp();
        save();
        paint();
      });
    });
  }

  function paintFloors() {
    const box = document.getElementById("floors");
    const floor = activeFloor();
    box.innerHTML = BM.floors.map((item) => {
      const on = item.id === floor;
      return `<button type="button" data-floor="${item.id}" class="${on ? "is-on" : ""}" aria-pressed="${on}">${item.name}</button>`;
    }).join("");
    box.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.floor = btn.dataset.floor;
        state.notice = null;
        paint();
      });
    });
  }

  function paintSteps() {
    const box = document.getElementById("steps");
    box.innerHTML = items().map((item, i) => {
      const on = i === index();
      const name = state.phase === "highlight" ? String(item.order) : item.title;
      const aria = state.phase === "highlight" ? item.order + " " + item.title : item.title;
      return `<button type="button" class="${on ? "is-on" : ""}" data-idx="${i}" aria-current="${on ? "step" : "false"}" aria-label="${esc(aria)}">${esc(name)}</button>`;
    }).join("");
    box.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => go(state.phase, Number(btn.dataset.idx)));
    });
    const live = box.querySelector(".is-on");
    if (live) {
      const left = live.offsetLeft - box.clientWidth / 2 + live.clientWidth / 2;
      box.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
  }

  function paintPanel() {
    const panel = document.getElementById("panel");
    const item = current();
    const floorName = BM.floors.find((floor) => floor.id === item.floor).name;
    let clock = "";
    if (state.phase === "highlight") {
      const time = highlightClock(item);
      clock = `建议 ${time.start}–${time.end} · 本站 ${item.minutes} 分钟 · 累计 ${time.spent} 分钟`;
      if (item.order === 8) clock += " · 12:20 前开始漫游";
    } else {
      clock = `${item.recommend ? "默认先看 · " : "可选 · "}约 ${item.minutes} 分钟`;
      if (item.suggest) clock += ` · 若按此顺序 ${item.suggest}`;
    }
    const kicker = state.phase === "highlight"
      ? `第 ${item.order} / 8 站 · ${floorName}`
      : `漫游 · ${floorName}`;
    const objects = (item.objects || []).map((obj) => {
      return `<article class="object"><h3>${esc(obj.name)}</h3><p>${esc(obj.intro)}</p></article>`;
    }).join("");
    const away = !state.notice && activeFloor() !== item.floor
      ? `<p class="how">示意图正在看其他楼层。这一站在${floorName}。</p><button type="button" class="text-btn" id="back-floor">回到这一站</button>`
      : "";
    const notice = state.notice
      ? `<div class="notice"><strong>${esc(state.notice.title)}</strong><p>${esc(state.notice.text)}</p><button type="button" class="text-btn" id="clear-notice">回到当前站</button></div>`
      : "";
    const empty = item.objects && item.objects.length ? "" : `<p class="how">这一步只赶路，不看展柜。</p>`;
    panel.innerHTML = `${notice}<p class="panel-kicker">${esc(kicker)}</p><h2>${esc(item.title)}</h2><p class="when">${esc(clock)}</p><p class="how">${esc(item.how)}</p>${away}${empty}${objects}`;
    const clear = document.getElementById("clear-notice");
    if (clear) {
      clear.addEventListener("click", () => {
        state.notice = null;
        state.floor = null;
        paint();
      });
    }
    const back = document.getElementById("back-floor");
    if (back) {
      back.addEventListener("click", () => {
        state.floor = null;
        paint();
      });
    }
  }

  function paintNav() {
    const nav = document.getElementById("nav");
    let nextLabel = "下一站";
    let prevLabel = "上一站";
    let prevOff = false;
    let nextOff = false;
    if (state.phase === "highlight") {
      prevOff = state.hi === 0;
      if (state.hi === BM.highlights.length - 1) nextLabel = "开始漫游";
    } else {
      prevLabel = state.bi === 0 ? "回到重点" : "上一处";
      nextLabel = "下一处";
      nextOff = state.bi === BM.browse.length - 1;
    }
    nav.innerHTML = `<button type="button" id="prev"${prevOff ? " disabled" : ""}>${prevLabel}</button><button type="button" class="primary" id="next"${nextOff ? " disabled" : ""}>${nextLabel}</button>`;
    document.getElementById("prev").addEventListener("click", () => shift(-1));
    document.getElementById("next").addEventListener("click", () => shift(1));
  }

  function paintMap() {
    const floor = activeFloor();
    const item = current();
    const selected = new Set(item.rooms || []);
    const optional = new Set(state.phase === "highlight" ? item.optionalRooms || [] : []);
    const rooms = BM.rooms.filter((room) => room.floor === floor);
    const rects = rooms.map((room) => roomRect(room, selected.has(room.id), optional.has(room.id))).join("");
    const labels = rooms.map((room) => roomLabel(room, selected.has(room.id))).join("");
    const route = floor === "ground"
      ? pathSvg(BM.groundPath, false) + pathSvg(BM.groundSpur, true)
      : floor === "upper"
        ? pathSvg(BM.upperPath, false)
        : "";
    const extra = floor === "lower"
      ? `<text x="36" y="360" fill="#5c5346" font-size="16">从地面层北侧楼梯下来。看完原路回到地面。</text>`
      : `<text x="420" y="22" text-anchor="middle" fill="#9a3412" font-size="15" font-weight="650">北</text>`;
    const floorLabel = floor === "ground" ? "地面层" : floor === "upper" ? "楼上" : "下层";
    document.getElementById("map").innerHTML = `<svg viewBox="0 0 840 640" role="img" aria-label="${floorLabel}示意图">
      <defs>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#d9d3c7"/>
          <line x1="0" y1="0" x2="0" y2="8" stroke="#8a8478" stroke-width="3"/>
        </pattern>
      </defs>
      <rect x="8" y="8" width="824" height="624" fill="#f7f1e4" stroke="#1c1917" stroke-width="2"/>
      ${extra}
      ${rects}
      ${route}
      ${labels}
      ${badgeSvg(floor)}
    </svg>`;
    document.querySelectorAll("#map .room").forEach((node) => {
      node.addEventListener("click", () => selectRoom(node.dataset.id));
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectRoom(node.dataset.id);
        }
      });
    });
    document.querySelectorAll("#map .badge").forEach((node) => {
      node.addEventListener("click", () => go("highlight", Number(node.dataset.idx)));
    });
  }

  function roomRect(room, on, optional) {
    const style = roomStyle(room, on, optional);
    return `<g class="room${on ? " is-on" : ""}" data-id="${room.id}" tabindex="0" role="button" aria-label="${esc(room.num ? "Room " + room.num + " " : "")}${esc(room.name)}">
      <rect x="${room.x}" y="${room.y}" width="${room.w}" height="${room.h}" rx="2" fill="${style.fill}" stroke="${style.stroke}" stroke-width="${style.width}" ${style.dash}/>
    </g>`;
  }

  function roomLabel(room, on) {
    const cx = room.x + room.w / 2;
    const cy = room.y + room.h / 2;
    const size = room.w < 90 ? 14 : 17;
    const fill = room.kind === "entrance" ? "#f8f1e3" : "#1c1917";
    const weight = on ? "700" : "650";
    const lines = room.lines.map((line, i) => {
      const dy = i === 0 ? 0 : size + 4;
      return `<tspan x="${cx}" dy="${dy}">${esc(line)}</tspan>`;
    }).join("");
    const y = room.lines.length === 1 ? cy + size / 3 : cy - (size + 4) / 2 + size / 3;
    return `<text x="${cx}" y="${y}" text-anchor="middle" fill="${fill}" font-size="${size}" font-weight="${weight}">${lines}</text>`;
  }

  function roomStyle(room, on, optional) {
    if (room.kind === "closed") {
      return { fill: "url(#hatch)", stroke: "#6b6560", width: 1.5, dash: "" };
    }
    if (room.kind === "entrance") {
      return { fill: "#1c1917", stroke: "#1c1917", width: 1.5, dash: "" };
    }
    if (on && state.phase === "browse") {
      return { fill: "#d5e3f5", stroke: "#1d4e89", width: 3.5, dash: "" };
    }
    if (on) {
      return { fill: "#f3d2b6", stroke: "#9a3412", width: 3.5, dash: "" };
    }
    if (optional || room.kind === "spur") {
      return { fill: "#f8eadc", stroke: "#9a3412", width: optional ? 2.5 : 1.5, dash: 'stroke-dasharray="7 5"' };
    }
    if (room.kind === "browse") {
      return { fill: "#e7eef6", stroke: "#1d4e89", width: 2, dash: 'stroke-dasharray="7 5"' };
    }
    if (room.kind === "court") {
      return { fill: "#fbf7ee", stroke: "#cbbfa6", width: 1.5, dash: "" };
    }
    if (room.kind === "stairs") {
      return { fill: "#e4eddc", stroke: "#3f6212", width: 1.5, dash: "" };
    }
    if (room.kind === "skip") {
      return { fill: "#efe8d8", stroke: "#cbbfa6", width: 1, dash: "" };
    }
    return { fill: "#f3e6c8", stroke: "#1c1917", width: 1.2, dash: "" };
  }

  function pathSvg(points, spur) {
    const d = points.map((point, i) => `${i === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
    const dash = spur ? ' stroke-dasharray="8 6"' : "";
    return `<path d="${d}" fill="none" stroke="#f7f1e4" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="#9a3412" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"${dash}/>`;
  }

  function badgeSvg(floor) {
    return BM.highlights.filter((stop) => stop.floor === floor).map((stop) => {
      const on = state.phase === "highlight" && current().id === stop.id;
      const r = on ? 16 : 13;
      return `<g class="badge${on ? " is-on" : ""}" data-idx="${stop.order - 1}" tabindex="0" role="button" aria-label="第${stop.order}站">
        <circle cx="${stop.badge.x}" cy="${stop.badge.y}" r="${r}" fill="${on ? "#9a3412" : "#1c1917"}" stroke="#f8f1e3" stroke-width="2"/>
        <text x="${stop.badge.x}" y="${stop.badge.y + 5}" text-anchor="middle" fill="#f8f1e3" font-size="14" font-weight="650">${stop.order}</text>
      </g>`;
    }).join("");
  }

  function focusMap() {
    const scroller = document.getElementById("map-scroll");
    const svg = scroller.querySelector("svg");
    if (!svg) return;
    const item = current();
    if (item.floor !== activeFloor()) return;
    let cx;
    let cy;
    const framed = {
      s1: [340, 540],
      s2: [170, 312],
      s3: [150, 190],
      s4: [400, 120],
      s5: [360, 500],
      s6: [150, 340],
      s7: [240, 110],
      s8: [530, 100]
    };
    if (state.phase === "highlight" && framed[item.id]) {
      cx = framed[item.id][0];
      cy = framed[item.id][1];
    } else if (state.phase === "highlight" && item.badge) {
      cx = item.badge.x;
      cy = item.badge.y;
    } else {
      const room = roomById(item.rooms[0]);
      if (!room) return;
      cx = room.x + room.w / 2;
      cy = room.y + room.h / 2;
    }
    const scale = svg.getBoundingClientRect().width / 840;
    scroller.scrollTo({
      left: Math.max(0, cx * scale - scroller.clientWidth / 2),
      top: Math.max(0, cy * scale - scroller.clientHeight / 2),
      behavior: "smooth"
    });
  }

  paint();
})();
