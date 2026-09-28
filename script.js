const $ = s => document.querySelector(s);

const moments = [
  [1744, "The first written Laws", "Cricketers in London write down the first known Laws of Cricket, turning a pastime into an organised sport."],
  [1787, "Lord's and the MCC", "The Marylebone Cricket Club forms and soon makes Lord's the Home of Cricket."],
  [1877, "The first Test match", "Australia beat England by 45 runs in Melbourne in the first official Test."],
  [1882, "The Ashes begin", "Australia win at The Oval by 7 runs, a newspaper mourns English cricket, and a famous rivalry is born."],
  [1932, "Bodyline", "England's aggressive leg-theory bowling in Australia causes a diplomatic row."],
  [1971, "The first one-day international", "A rained-off Test in Melbourne leads to a one-day match between Australia and England."],
  [1975, "The first World Cup", "West Indies win the inaugural World Cup at Lord's."],
  [2003, "Twenty20 arrives", "England launches a fast three-hour format that changes how the game is played and watched."],
  [2008, "The IPL begins", "India's Premier League starts and reshapes the economics of cricket."]
];

const wins = [
  [1960, "test", "The Tied Test", "Australia and West Indies, Brisbane", "Scores level after five days, the first tied Test in history."],
  [1981, "test", "Botham's Headingley", "England won by 18 runs", "Following on and written off at 500-1, England won thanks to Ian Botham's 149 not out and Bob Willis's 8 for 43."],
  [1983, "odi", "Kapil's Devils", "India won by 43 runs", "Defending just 183 at Lord's, India stunned the mighty two-time champions West Indies."],
  [1992, "odi", "Pakistan's comeback", "Pakistan won by 22 runs", "After a shaky start, Imran Khan's side beat England in Melbourne to lift the trophy."],
  [1996, "odi", "Sri Lanka's revolution", "Sri Lanka won by 7 wickets", "Fearless opening batting and clever spin carried Sri Lanka past Australia in Lahore."],
  [2001, "test", "The Kolkata miracle", "India won by 171 runs", "After following on, V.V.S. Laxman (281) and Rahul Dravid (180) batted all day, and Harbhajan Singh's spin ended Australia's 16-Test winning streak."],
  [2005, "test", "Edgbaston thriller", "England won by 2 runs", "One of the closest Tests ever, in a series many call the greatest Ashes."],
  [2007, "t20", "India's T20 glory", "India won by 5 runs", "A young side led by M.S. Dhoni beat Pakistan in the first T20 World Cup final."],
  [2019, "odi", "The Super Over", "England won on boundary count", "The final and its Super Over both finished level, and England lifted the trophy for the first time."],
  [2021, "test", "The Gabba falls", "India won by 3 wickets", "A depleted India chased 328 to end Australia's 32-year unbeaten run in Brisbane."],
  [2024, "t20", "The Barbados final", "India won by 7 runs", "India beat South Africa to win their second T20 World Cup."]
];
const labels = { test: "Test match", odi: "ODI World Cup", t20: "T20 World Cup" };

const records = [
  ["Sir Don Bradman", "Australia", 99.94, 2, "Test batting average, the most famous number in cricket."],
  ["Sachin Tendulkar", "India", 100, 0, "International centuries across Tests and one-day games."],
  ["Muttiah Muralitharan", "Sri Lanka", 800, 0, "Test wickets, the most by any bowler."],
  ["Shane Warne", "Australia", 708, 0, "Test wickets, plus the Ball of the Century in 1993."]
];

const questions = [
  ["Who won the first Cricket World Cup in 1975?", ["Australia", "West Indies", "England", "India"], 1],
  ["Where was the first Test match played in 1877?", ["London", "Sydney", "Melbourne", "Kolkata"], 2],
  ["What was Don Bradman's Test batting average?", ["89.94", "94.99", "99.94", "100.00"], 2],
  ["Which country won the 1983 World Cup at Lord's?", ["India", "Pakistan", "West Indies", "Sri Lanka"], 0],
  ["Which ground is known as the Home of Cricket?", ["The Gabba", "Lord's", "Eden Gardens", "Edgbaston"], 1]
];

/* Reveal timeline entries and start counters when they scroll into view */
const count = el => {
  const to = +el.dataset.to, d = +el.dataset.dec, t0 = performance.now();
  const step = t => {
    const p = Math.min((t - t0) / 1600, 1);
    el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(d);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const t = e.target;
  t.classList.add("on");
  if (t.dataset.to) count(t);
  io.unobserve(t);
}), { threshold: 0.4 });

$("#tl").innerHTML = moments.map(([y, t, d]) =>
  `<div class="ti"><strong>${y}</strong><div><h3>${t}</h3><p>${d}</p></div></div>`).join("");

$("#rec").innerHTML = records.map(([n, c, to, dec, cap]) =>
  `<div><b data-to="${to}" data-dec="${dec}">0</b><h3>${n}, ${c}</h3><p>${cap}</p></div>`).join("");

document.querySelectorAll(".ti, [data-to]").forEach(el => io.observe(el));

/* Historic wins with format filter */
let filter = "all";
function showWins() {
  $("#list").innerHTML = wins.filter(w => filter === "all" || w[1] === filter).map(([y, t, n, s, d], i) =>
    `<div class="w" style="animation-delay:${i * 60}ms"><b>${y}</b><div><h3>${n}</h3><p class="res">${s}</p><p>${d}</p><span>${labels[t]}</span></div></div>`).join("");
}
document.querySelectorAll(".fl button").forEach(b => b.onclick = () => {
  $(".fl .on").classList.remove("on");
  b.classList.add("on");
  filter = b.dataset.f;
  showWins();
});
showWins();

/* Quiz */
let qi = 0, score = 0;
function quiz() {
  const box = $("#quiz-box");
  if (qi >= questions.length) {
    box.innerHTML = `<h3>You scored ${score} out of ${questions.length}</h3><p>${score >= 4 ? "A true cricket historian." : "Good innings. Read the timeline and try again."}</p><button class="btn" id="again">Play again</button>`;
    $("#again").onclick = () => { qi = 0; score = 0; quiz(); };
    return;
  }
  const [text, opts, ans] = questions[qi];
  box.innerHTML = `<small>Question ${qi + 1} of ${questions.length}</small><h3>${text}</h3>` +
    opts.map((o, i) => `<button class="opt" data-i="${i}">${o}</button>`).join("");
  box.querySelectorAll(".opt").forEach(b => b.onclick = () => {
    const right = +b.dataset.i === ans;
    if (right) score++;
    box.querySelectorAll(".opt").forEach(x => {
      x.disabled = true;
      if (+x.dataset.i === ans) x.classList.add("ok");
    });
    if (!right) b.classList.add("no");
    setTimeout(() => { qi++; quiz(); }, 1200);
  });
}
quiz();

/* Scroll progress bar */
const bar = document.createElement("div");
bar.id = "bar";
document.body.prepend(bar);
addEventListener("scroll", () => {
  bar.style.width = scrollY / (document.documentElement.scrollHeight - innerHeight) * 100 + "%";
}, { passive: true });

/* Latest matches: snapshot of results on 26-27 September 2026. Edit this list to update. */
const latest = [
  ["ODI series, 27 September", ["South Africa", "365/9"], ["Australia", "333/10"], 0, "South Africa won by 32 runs"],
  ["ODI series, 27 September", ["India", "300/2"], ["West Indies", "295/7"], 0, "India won by 8 wickets"],
  ["ODI series, 27 September", ["England", "355/7"], ["Sri Lanka", "132/10"], 0, "England won by 223 runs"],
  ["Women's ODI series, 27 September", ["Zimbabwe Women", "140/6"], ["West Indies Women", "139/10"], 0, "Zimbabwe won by 4 wickets"]
];
$("#lm").innerHTML = latest.map(([t, a, b, w, r]) =>
  `<div class="m"><small>${t}</small>` +
  [a, b].map((x, i) => `<div class="row${i === w ? " win" : ""}"><span>${x[0]}</span><i style="--w:${Math.min(parseInt(x[1]) / 400 * 100, 100)}%"></i><b>${x[1]}</b></div>`).join("") +
  `<p class="res">${r}</p></div>`).join("");
document.querySelectorAll(".m").forEach(el => io.observe(el));

/* Team histories */
const teams = [
  ["Australia", "Played in the first Test in 1877 and built a reputation for toughness. A run of World Cup wins around the turn of the century made them the side everyone measured themselves against.",
    ["Six ODI World Cup titles: 1987, 1999, 2003, 2007, 2015 and 2023", "T20 World Cup winners in 2021", "Won the first ever Test, in Melbourne in 1877"]],
  ["England", "The birthplace of the game. England played in the first Test in 1877 and have contested the Ashes with Australia ever since.",
    ["ODI World Cup winners in 2019", "T20 World Cup winners in 2010 and 2022", "Won the famous 2005 Ashes series"]],
  ["India", "Played their first Test in 1932 at Lord's. India grew from underdogs into a cricketing superpower after the 1983 World Cup win.",
    ["ODI World Cup winners in 1983 and 2011", "T20 World Cup winners in 2007 and 2024", "Won at the Gabba in 2021"]],
  ["West Indies", "Many islands playing as one team. Their fast bowlers and stroke-makers ruled world cricket in the 1970s and 1980s.",
    ["Won the first two ODI World Cups, in 1975 and 1979", "T20 World Cup winners in 2012 and 2016", "No Test series defeat from 1980 to 1995"]],
  ["Pakistan", "Gained Test status in 1952 and quickly became known for flair, fast bowling and dramatic comebacks.",
    ["ODI World Cup winners in 1992", "T20 World Cup winners in 2009", "Champions Trophy winners in 2017"]],
  ["Sri Lanka", "Gained Test status in 1982 and changed one-day batting in the 1990s with fearless opening play.",
    ["ODI World Cup winners in 1996", "T20 World Cup winners in 2014", "Home of Muttiah Muralitharan and his 800 Test wickets"]]
];
function showTeam(i) {
  document.querySelectorAll("#tabs button").forEach((b, j) => b.classList.toggle("on", i === j));
  const [n, s, h] = teams[i];
  $("#team").innerHTML = `<div class="tp"><h3>${n}</h3><p>${s}</p><ul>${h.map(x => `<li>${x}</li>`).join("")}</ul></div>`;
}
$("#tabs").innerHTML = teams.map(t => `<button>${t[0]}</button>`).join("");
document.querySelectorAll("#tabs button").forEach((b, i) => b.onclick = () => showTeam(i));
showTeam(0);

/* Minigame: face an over */
const G = { runs: 0, ball: 0, x: 0, t: 0, speed: 0, raf: 0, state: "idle" };
const gball = $("#gball"), bat = $("#bat"), pop = $("#pop"), swingBtn = $("#swing");
function say(t) {
  pop.textContent = t;
  pop.classList.remove("show");
  void pop.offsetWidth;
  pop.classList.add("show");
}
function bowl() {
  G.ball++; G.x = 0; G.state = "live";
  G.speed = 0.05 + G.ball * 0.009;
  G.t = performance.now();
  gball.style.left = "0%";
  $("#gb").textContent = `Ball ${G.ball} of 6`;
  swingBtn.textContent = "Swing";
  G.raf = requestAnimationFrame(fly);
}
function fly(t) {
  G.x += G.speed * (t - G.t);
  G.t = t;
  gball.style.left = G.x + "%";
  gball.style.transform = `translate(-50%,${-Math.abs(Math.sin(G.x / 100 * Math.PI * 3)) * 46}px)`;
  if (G.x >= 97) endBall(0, "Bowled!");
  else G.raf = requestAnimationFrame(fly);
}
function hit() {
  cancelAnimationFrame(G.raf);
  bat.classList.remove("sw"); void bat.offsetWidth; bat.classList.add("sw");
  const d = Math.abs(G.x - 82);
  if (d < 3) endBall(6, "Six!");
  else if (d < 7) endBall(4, "Four!");
  else if (d < 14) endBall(1, "Single");
  else endBall(0, G.x < 82 ? "Too early" : "Too late");
}
function endBall(r, msg) {
  cancelAnimationFrame(G.raf);
  G.state = "wait"; G.runs += r;
  say(msg);
  $("#gs").textContent = "Runs: " + G.runs;
  setTimeout(() => {
    if (G.ball < 6) bowl();
    else { say(G.runs + " runs"); $("#gb").textContent = "Over complete"; swingBtn.textContent = "Play again"; G.state = "idle"; }
  }, 1000);
}
function act() {
  if (G.state === "live") hit();
  else if (G.state === "idle") { G.runs = 0; G.ball = 0; $("#gs").textContent = "Runs: 0"; bowl(); }
}
swingBtn.onclick = act;
$("#field").onclick = act;
addEventListener("keydown", e => {
  if (e.code === "Space" && G.state === "live") { e.preventDefault(); hit(); }
});
