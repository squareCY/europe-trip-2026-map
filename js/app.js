(() => {
  const MODE = {
    drive: { color: "#1d4e89", weight: 4, dash: null, label: "自驾" },
    rail: { color: "#b42318", weight: 3.5, dash: null, label: "火车 / 地铁" },
    metro: { color: "#b42318", weight: 3, dash: "2 7", label: "地铁" },
    ferry: { color: "#0e7c7b", weight: 3, dash: "6 5", label: "渡轮" },
    flight: { color: "#5c6770", weight: 2, dash: "8 6", label: "飞行" },
    walk: { color: "#c2410c", weight: 2.5, dash: "3 6", label: "步行" },
    taxi: { color: "#6d28d9", weight: 2.5, dash: "2 4", label: "打车" },
    stay: { color: "#3f6212", weight: 0, dash: null, label: "住宿" }
  };

  const TILES =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
  const ATTR = "Tiles © Esri · Source: Esri, OpenStreetMap";

  const EUROPE = [
    [48.72, -0.55],
    [52.62, 6.35]
  ];

  const state = {
    dayId: TRIP.defaultDay,
    variant: TRIP.defaultVariant,
    selectedAct: -1
  };

  let overviewMap, insetMap, worldMap;
  let ovRoutes, ovStays, ovLabels, ovCallout, ovFocus;
  let inRoutes, inPins;
  let worldLines, worldPins;

  function place(id) {
    return PLACES[id];
  }

  function ll(id) {
    const p = place(id);
    return [p.lat, p.lng];
  }

  function routeLatLngs(id) {
    const r = ROUTES[id];
    if (!r) return [];
    return r.coordinates.map(([lng, lat]) => [lat, lng]);
  }

  function dayById(id) {
    return TRIP.days.find((d) => d.id === id);
  }

  function resolved(day) {
    if (!day) return null;
    if (!day.hasVariant) return day;
    const v = day.variants[state.variant] || day.variants.B;
    return Object.assign({}, day, v);
  }

  function current() {
    return resolved(dayById(state.dayId));
  }

  function modeOf(name) {
    return MODE[name] || MODE.walk;
  }

  function isPhone() {
    return window.matchMedia("(max-width: 720px)").matches;
  }

  function scrollActiveDay() {
    const nav = document.getElementById("timeline");
    const btn = nav && nav.querySelector(".day-btn.is-active");
    if (!btn) return;
    const left = btn.offsetLeft - nav.clientWidth / 2 + btn.clientWidth / 2;
    nav.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }

  function greatCircle(a, b, n) {
    n = n || 72;
    const toX = (lat, lng) => {
      const φ = (lat * Math.PI) / 180;
      const λ = (lng * Math.PI) / 180;
      return [Math.cos(φ) * Math.cos(λ), Math.cos(φ) * Math.sin(λ), Math.sin(φ)];
    };
    const A = toX(a[0], a[1]);
    const B = toX(b[0], b[1]);
    let dot = A[0] * B[0] + A[1] * B[1] + A[2] * B[2];
    dot = Math.max(-1, Math.min(1, dot));
    const ω = Math.acos(dot);
    const out = [];
    if (ω < 1e-6) return [a, b];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const s1 = Math.sin((1 - t) * ω) / Math.sin(ω);
      const s2 = Math.sin(t * ω) / Math.sin(ω);
      const x = s1 * A[0] + s2 * B[0];
      const y = s1 * A[1] + s2 * B[1];
      const z = s1 * A[2] + s2 * B[2];
      out.push([(Math.asin(z) * 180) / Math.PI, (Math.atan2(y, x) * 180) / Math.PI]);
    }
    return out;
  }

  function addTiles(map) {
    L.tileLayer(TILES, { attribution: ATTR, maxZoom: 19 }).addTo(map);
  }

  function styleLine(mode, active) {
    const m = modeOf(mode);
    return {
      color: m.color,
      weight: active ? m.weight + 2 : Math.max(2, m.weight - 1),
      opacity: active ? 0.96 : 0.22,
      dashArray: m.dash,
      lineCap: "round",
      lineJoin: "round"
    };
  }

  function pinIcon(label, kind) {
    return L.divIcon({
      className: "",
      html: `<div class="pin ${kind || ""}">${label}</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
  }

  function initMaps() {
    overviewMap = L.map("overview-map", {
      zoomControl: true,
      scrollWheelZoom: true,
      minZoom: 5,
      maxZoom: 12
    }).fitBounds(EUROPE, { padding: [10, 10], maxZoom: 7 });
    addTiles(overviewMap);

    insetMap = L.map("inset-map", {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([48.86, 2.34], 12);
    addTiles(insetMap);

    worldMap = L.map("world-map", {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true
    }).fitBounds(
      [
        [20, 100],
        [54, 10]
      ],
      { padding: [12, 12] }
    );
    addTiles(worldMap);

    ovRoutes = L.layerGroup().addTo(overviewMap);
    ovStays = L.layerGroup().addTo(overviewMap);
    ovLabels = L.layerGroup().addTo(overviewMap);
    ovFocus = L.layerGroup().addTo(overviewMap);

    inRoutes = L.layerGroup().addTo(insetMap);
    inPins = L.layerGroup().addTo(insetMap);

    worldLines = L.layerGroup().addTo(worldMap);
    worldPins = L.layerGroup().addTo(worldMap);

    overviewMap.on("move zoom", updateCallout);
    window.addEventListener("resize", () => {
      overviewMap.invalidateSize();
      insetMap.invalidateSize();
      worldMap.invalidateSize();
      updateCallout();
    });
  }

  function drawLegend() {
    const rows = [
      ["drive", "自驾"],
      ["rail", "火车 / 地铁"],
      ["ferry", "渡轮"],
      ["flight", "飞行"],
      ["walk", "市内步行"]
    ];
    document.getElementById("legend").innerHTML =
      "<h3>图例</h3>" +
      rows
        .map(([k, label]) => {
          const m = MODE[k];
          const dash = m.dash ? " dash" : "";
          return `<div class="legend-row"><i class="swatch${dash}" style="border-top-color:${m.color}"></i>${label}</div>`;
        })
        .join("");
  }

  function drawTimeline() {
    const nav = document.getElementById("timeline");
    nav.innerHTML = TRIP.days
      .map((d) => {
        const active = d.id === state.dayId ? " is-active" : "";
        return `<button type="button" class="day-btn${active}" data-day="${d.id}" data-region="${d.region}">
          <span class="d-date">${d.date}</span>
          <span class="d-week">${d.weekday}</span>
          <span class="d-city">${d.city}</span>
        </button>`;
      })
      .join("");
    nav.querySelectorAll(".day-btn").forEach((btn) => {
      btn.addEventListener("click", () => selectDay(btn.dataset.day));
    });
    scrollActiveDay();
  }

  function drawOverviewBase() {
    ovRoutes.clearLayers();
    ovStays.clearLayers();
    ovLabels.clearLayers();

    TRIP.days.forEach((raw) => {
      const variants = raw.hasVariant ? ["A", "B"] : [null];
      variants.forEach((key) => {
        const prev = state.variant;
        if (key) state.variant = key;
        const day = resolved(raw);
        (day.overviewLegs || []).forEach((leg) => {
          const latlngs = routeLatLngs(leg.route);
          if (!latlngs.length) return;
          const mode = ROUTES[leg.route].mode || "rail";
          const line = L.polyline(latlngs, styleLine(mode, false));
          line._trip = { dayId: raw.id, route: leg.route, variant: key };
          line.addTo(ovRoutes);
        });
        if (key) state.variant = prev;
      });
    });

    STAYS.forEach((s) => {
      L.marker(ll(s.id), { icon: pinIcon("住", "stay") })
        .bindPopup(`<strong>${s.city}</strong><br>${place(s.id).name}<br>${s.nights}`)
        .addTo(ovStays);
    });

    CITY_LABELS.forEach((c) => {
      L.marker([c.lat, c.lng], {
        icon: L.divIcon({ className: "", html: "", iconSize: [0, 0] }),
        interactive: false
      })
        .bindTooltip(c.name, {
          permanent: true,
          direction: "right",
          className: "city-label",
          offset: [6, 0]
        })
        .addTo(ovLabels);
    });
  }

  function highlightOverview(day) {
    ovRoutes.eachLayer((layer) => {
      const meta = layer._trip || {};
      if (meta.dayId === "0929" && meta.variant && meta.variant !== state.variant) {
        layer.setStyle({ opacity: 0, weight: 0 });
        return;
      }
      const on = meta.dayId === day.id;
      const mode = (ROUTES[meta.route] && ROUTES[meta.route].mode) || "rail";
      layer.setStyle(styleLine(mode, on));
      if (on) layer.bringToFront();
    });

    ovFocus.clearLayers();
    if (ovCallout) {
      overviewMap.removeLayer(ovCallout);
      ovCallout = null;
    }

    const bounds = insetBounds(day);
    if (bounds && bounds.isValid() && day.insetMode !== "asia") {
      ovCallout = L.rectangle(bounds, {
        color: "#9a3412",
        weight: 1.6,
        dashArray: "5 4",
        fill: false,
        opacity: 0.95
      }).addTo(overviewMap);
    }
  }

  function insetBounds(day) {
    const ids = day.insetPlaces || [];
    const pts = ids.filter((id) => PLACES[id]).map((id) => ll(id));
    if (day.insetMode === "region") {
      (day.overviewLegs || []).forEach((leg) => {
        routeLatLngs(leg.route).forEach((p) => pts.push(p));
      });
    }
    if (!pts.length) return null;
    return L.latLngBounds(pts);
  }

  function drawInset(day) {
    inRoutes.clearLayers();
    inPins.clearLayers();

    if (day.insetMode === "asia") {
      const pts = (day.insetPlaces || []).map((id) => ll(id));
      (day.worldFlights || []).forEach((fid) => {
        const f = FLIGHTS[fid];
        const arc = greatCircle(ll(f.from), ll(f.to));
        L.polyline(arc, styleLine("flight", true)).addTo(inRoutes);
      });
      (day.insetPlaces || []).forEach((id, i) => {
        L.marker(ll(id), { icon: pinIcon(String(i + 1), "booked") })
          .bindPopup(place(id).name)
          .addTo(inPins);
      });
      if (pts.length) {
        insetMap.fitBounds(pts, { padding: [36, 36], maxZoom: 5 });
      }
      paintActivities(day);
      return;
    }

    if (day.insetMode === "region") {
      (day.overviewLegs || []).forEach((leg) => {
        const latlngs = routeLatLngs(leg.route);
        if (!latlngs.length) return;
        const mode = ROUTES[leg.route].mode || "rail";
        L.polyline(latlngs, styleLine(mode, true)).addTo(inRoutes);
      });
    }

    const skipOnCity = new Set(["eurostar", "paris_reims"]);
    const acts = day.activities || [];
    let last = null;
    acts.forEach((act, i) => {
      if (!act.place || !PLACES[act.place]) return;
      const skipRoute = day.insetMode === "city" && act.route && skipOnCity.has(act.route);
      if (act.route && ROUTES[act.route] && !skipRoute) {
        const mode = ROUTES[act.route].mode || act.mode;
        L.polyline(routeLatLngs(act.route), styleLine(mode, true)).addTo(inRoutes);
      } else if (last && last !== act.place && act.mode !== "flight" && !skipRoute) {
        L.polyline([ll(last), ll(act.place)], styleLine(act.mode || "walk", true)).addTo(inRoutes);
      }
      last = act.place;
    });

    const seen = new Map();
    acts.forEach((act, i) => {
      if (!act.place || !PLACES[act.place]) return;
      if (seen.has(act.place)) return;
      seen.set(act.place, i);
      const kind = act.mode === "stay" ? "stay" : act.booked ? "booked" : "todo";
      const marker = L.marker(ll(act.place), {
        icon: pinIcon(String(i + 1), kind)
      }).bindPopup(popupHtml(act, i));
      marker.on("click", () => {
        state.selectedAct = i;
        paintActivities(day);
      });
      marker.addTo(inPins);
    });

    const b = insetBounds(day);
    if (b && b.isValid()) {
      const pad = day.insetMode === "city" ? [28, 28] : [36, 36];
      insetMap.fitBounds(b, { padding: pad, maxZoom: day.insetMode === "city" ? 15 : 11 });
    }

    paintActivities(day);
  }

  function popupHtml(act, i) {
    const p = place(act.place);
    const booked = act.booked ? "已订" : "";
    return `<strong>${i + 1}. ${act.time}　${act.name}</strong><br>${p.name}${
      act.note ? `<br>${act.note}` : ""
    }${booked ? `<br>${booked}` : ""}${
      act.page ? `<br><a href="${act.page}">馆内路线</a>` : ""
    }`;
  }

  function paintActivities(day) {
    const list = document.getElementById("activity-list");
    const acts = day.activities || [];
    document.getElementById("activity-count").textContent = `${acts.length} 项`;
    list.innerHTML = acts
      .map((act, i) => {
        const on = i === state.selectedAct ? " is-on" : "";
        const booked = act.booked
          ? '<span class="pill booked">已订</span>'
          : act.mode === "stay"
            ? '<span class="pill booked">住宿</span>'
            : "";
        const mode = modeOf(act.mode);
        return `<li class="activity-item${on}" data-idx="${i}">
          <span class="act-num">${i + 1}</span>
          <span class="act-time">${act.time}</span>
          <span class="act-name">${act.name}${
            act.note ? `<span class="act-note">${act.note}</span>` : ""
          }${
            act.page ? `<a class="act-link" href="${act.page}">馆内路线</a>` : ""
          }</span>
          <span class="act-meta">
            <span class="pill mode">${mode.label}</span>
            ${booked}
          </span>
        </li>`;
      })
      .join("");
    list.querySelectorAll(".activity-item").forEach((el) => {
      el.addEventListener("click", () => focusActivity(day, Number(el.dataset.idx)));
    });
    list.querySelectorAll(".act-link").forEach((link) => {
      link.addEventListener("click", (event) => event.stopPropagation());
    });
  }

  function focusActivity(day, idx) {
    state.selectedAct = idx;
    const act = day.activities[idx];
    paintActivities(day);
    if (act && act.place && PLACES[act.place]) {
      const z = day.insetMode === "asia" ? 6 : day.insetMode === "city" ? 15 : 13;
      insetMap.flyTo(ll(act.place), Math.max(insetMap.getZoom(), z), { duration: 0.6 });
      inPins.eachLayer((m) => {
        if (m.getLatLng && m.getLatLng().equals(L.latLng(ll(act.place)))) {
          m.openPopup();
        }
      });
    }
  }

  function drawWorld(day) {
    worldLines.clearLayers();
    worldPins.clearLayers();
    const hot = new Set(day.worldFlights || []);
    Object.entries(FLIGHTS).forEach(([id, f]) => {
      const on = hot.has(id);
      const arc = greatCircle(ll(f.from), ll(f.to));
      L.polyline(arc, {
        color: on ? "#9a3412" : "#7a8690",
        weight: on ? 3 : 1.5,
        opacity: on ? 0.95 : 0.45,
        dashArray: "6 5"
      }).addTo(worldLines);
    });
    ["hkg", "pvg", "schiphol", "lhr"].forEach((id) => {
      L.circleMarker(ll(id), {
        radius: 4,
        color: "#1c1917",
        weight: 1,
        fillColor: "#f8f1e3",
        fillOpacity: 1
      })
        .bindTooltip(place(id).name.replace(/国际机场.*/, "").replace(/机场.*/, ""), {
          permanent: false
        })
        .addTo(worldPins);
    });

    const card = document.getElementById("world-card");
    const cap = document.getElementById("world-caption");
    if (hot.size) {
      card.classList.add("is-hot");
      cap.textContent = (day.worldFlights || [])
        .map((id) => FLIGHTS[id].label)
        .join("　");
    } else {
      card.classList.remove("is-hot");
      cap.textContent = "香港 — 上海 — 欧洲";
    }
  }

  function updateDetailHead(day) {
    document.getElementById("inset-kicker").textContent =
      day.insetMode === "asia" ? "航段放大" : "局部放大";
    document.getElementById("inset-title").textContent =
      `${day.date} ${day.weekday}　${day.theme}`;
    document.getElementById("inset-summary").textContent = day.summary;
    document.getElementById("overview-caption").textContent = day.hasVariant
      ? `跨城路段 · 当前 ${state.variant} 版`
      : "跨城路段 · 选中日期加粗";

    const box = document.getElementById("variant-box");
    box.hidden = !day.hasVariant;
    box.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.variant === state.variant);
    });
  }

  function updateCallout() {
    const svg = document.getElementById("callout-layer");
    svg.innerHTML = "";
    if (isPhone()) return;
    const day = current();
    if (!day || day.insetMode === "asia" || !ovCallout) return;

    const workspace = document.querySelector(".workspace").getBoundingClientRect();
    const mapBox = document.getElementById("overview-map").getBoundingClientRect();
    const inset = document.querySelector(".inset-frame").getBoundingClientRect();
    const b = ovCallout.getBounds();
    const ne = overviewMap.latLngToContainerPoint(b.getNorthEast());
    const se = overviewMap.latLngToContainerPoint(b.getSouthEast());

    const x1 = mapBox.left - workspace.left + ne.x;
    const y1 = mapBox.top - workspace.top + ne.y;
    const x2 = mapBox.left - workspace.left + se.x;
    const y2 = mapBox.top - workspace.top + se.y;
    const tx = inset.left - workspace.left;
    const ty1 = inset.top - workspace.top;
    const ty2 = inset.bottom - workspace.top;

    const ns = "http://www.w3.org/2000/svg";
    const line = (xA, yA, xB, yB) => {
      const el = document.createElementNS(ns, "line");
      el.setAttribute("x1", xA);
      el.setAttribute("y1", yA);
      el.setAttribute("x2", xB);
      el.setAttribute("y2", yB);
      el.setAttribute("stroke", "#9a3412");
      el.setAttribute("stroke-width", "1.2");
      el.setAttribute("stroke-dasharray", "4 3");
      el.setAttribute("opacity", "0.75");
      svg.appendChild(el);
    };
    line(x1, y1, tx, ty1);
    line(x2, y2, tx, ty2);
  }

  function selectDay(id) {
    state.dayId = id;
    state.selectedAct = -1;
    const hash = id === "0929" ? `#${id}${state.variant}` : `#${id}`;
    if (location.hash !== hash) history.replaceState(null, "", hash);
    const day = current();
    drawTimeline();
    updateDetailHead(day);
    highlightOverview(day);
    drawInset(day);
    drawWorld(day);
    requestAnimationFrame(() => {
      insetMap.invalidateSize();
      worldMap.invalidateSize();
      updateCallout();
    });
  }

  function bindChrome() {
    document.querySelectorAll("#variant-box button").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.variant = btn.dataset.variant;
        if (state.dayId !== "0929") state.dayId = "0929";
        selectDay(state.dayId);
      });
    });

    document.addEventListener("keydown", (e) => {
      const ids = TRIP.days.map((d) => d.id);
      const i = ids.indexOf(state.dayId);
      if (e.key === "ArrowRight" && i < ids.length - 1) selectDay(ids[i + 1]);
      if (e.key === "ArrowLeft" && i > 0) selectDay(ids[i - 1]);
    });
  }

  function readHash() {
    const h = (location.hash || "").replace("#", "");
    if (/^0929[AB]$/.test(h)) {
      state.variant = h.slice(-1);
      return "0929";
    }
    if (TRIP.days.some((d) => d.id === h)) return h;
    return TRIP.defaultDay;
  }

  function boot() {
    drawLegend();
    drawTimeline();
    initMaps();
    drawOverviewBase();
    bindChrome();
    selectDay(readHash());
    const refit = () => {
      overviewMap.invalidateSize();
      insetMap.invalidateSize();
      worldMap.invalidateSize();
      overviewMap.fitBounds(EUROPE, { padding: [10, 10], maxZoom: 7, animate: false });
      updateCallout();
    };
    window.addEventListener("load", refit);
    setTimeout(refit, 80);
    setTimeout(refit, 400);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
