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
