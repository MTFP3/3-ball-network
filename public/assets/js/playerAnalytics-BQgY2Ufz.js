class g {
  constructor() {
    ((this.performanceData = []),
      (this.insights = []),
      (this.comparisons = {}),
      (this.trends = {}));
  }
  trackPerformance(e) {
    const t = {
      gameId: e.id,
      date: e.date,
      opponent: e.opponent,
      minutes: e.minutes,
      stats: e.stats,
      situational: this.analyzeSituationalPerformance(e),
      efficiency: this.calculateAdvancedEfficiency(e.stats),
      impact: this.calculateGameImpact(e),
      timestamp: new Date().toISOString(),
    };
    return (this.performanceData.push(t), this.generateInsights(t), t);
  }
  generateInsights(e) {
    const t = [];
    if (e.stats.fga >= 8) {
      const n = (e.stats.fgm / e.stats.fga) * 100;
      n < 35 &&
        t.push({
          type: 'shooting',
          severity: 'warning',
          message: `Shot selection needs improvement - ${n.toFixed(1)}% FG on ${e.stats.fga} attempts`,
          recommendation:
            'Focus on high-percentage shots near the basket and open looks',
        });
    }
    const s =
      (e.stats.turnovers / (e.stats.assists + e.stats.points / 2)) * 100;
    return (
      s > 20 &&
        t.push({
          type: 'ballhandling',
          severity: 'alert',
          message: `High turnover rate: ${s.toFixed(1)}%`,
          recommendation:
            'Work on ball security drills and decision-making under pressure',
        }),
      e.situational.fourthQuarter &&
        e.situational.closeGame &&
        t.push({
          type: 'clutch',
          severity: 'info',
          message: 'Strong clutch performance in close game',
          recommendation:
            'Continue developing late-game composure and leadership',
        }),
      this.insights.push(...t),
      t
    );
  }
  calculateAdvancedEfficiency(e) {
    const t = e.fga + e.fta * 0.44 + e.turnovers,
      s = e.points;
    return {
      effectiveFG: e.fga > 0 ? ((e.fgm + e.threePM * 0.5) / e.fga) * 100 : 0,
      trueShootingPct: t > 0 ? (s / (2 * t)) * 100 : 0,
      assistToTurnoverRatio:
        e.turnovers > 0 ? e.assists / e.turnovers : e.assists,
      reboundRate: ((e.rebounds * 5) / 40) * 100,
      usageRate: t > 0 ? (t / 80) * 100 : 0,
    };
  }
  analyzeSituationalPerformance(e) {
    return {
      fourthQuarter: e.situational?.fourthQuarter || !1,
      closeGame: e.situational?.closeGame || !1,
      pressure: e.situational?.pressure || 'normal',
      location: e.situational?.location || 'home',
      restDays: e.situational?.restDays || 1,
    };
  }
  calculateGameImpact(e) {
    const t = e.stats,
      s = e.minutes,
      n =
        t.points * 1 +
        t.rebounds * 1.2 +
        t.assists * 1.5 +
        t.steals * 2 +
        t.blocks * 2 -
        t.turnovers * 1.5 -
        t.fouls * 0.5,
      r = s > 0 ? n / s : 0,
      i = r * 36;
    return { raw: n, perMinute: r, per36: i, rating: this.getImpactRating(i) };
  }
  getImpactRating(e) {
    return e >= 25
      ? 'Elite'
      : e >= 20
        ? 'Excellent'
        : e >= 15
          ? 'Good'
          : e >= 10
            ? 'Average'
            : 'Below Average';
  }
  analyzeTrends(e = 10) {
    const t = this.performanceData.slice(-e);
    if (t.length < 3) return null;
    const s = {},
      n = this.calculateTrend(
        t.map(i => (i.stats.fga > 0 ? (i.stats.fgm / i.stats.fga) * 100 : 0))
      );
    s.shooting = {
      direction: n > 5 ? 'improving' : n < -5 ? 'declining' : 'stable',
      value: n,
      message: this.getTrendMessage('shooting', n),
    };
    const r = this.calculateTrend(t.map(i => i.impact.per36));
    return (
      (s.impact = {
        direction: r > 2 ? 'improving' : r < -2 ? 'declining' : 'stable',
        value: r,
        message: this.getTrendMessage('impact', r),
      }),
      s
    );
  }
  calculateTrend(e) {
    if (e.length < 2) return 0;
    const t = e.length,
      s = Array.from({ length: t }, (a, o) => o),
      n = s.reduce((a, o) => a + o, 0),
      r = e.reduce((a, o) => a + o, 0),
      i = s.reduce((a, o, u) => a + o * e[u], 0),
      c = s.reduce((a, o) => a + o * o, 0);
    return (t * i - n * r) / (t * c - n * n);
  }
  getTrendMessage(e, t) {
    const s = t > 0 ? 'improving' : 'declining',
      n = Math.abs(t);
    return e === 'shooting'
      ? n > 10
        ? `Shooting ${s} significantly (${t.toFixed(1)}% trend)`
        : n > 5
          ? `Shooting ${s} moderately`
          : 'Shooting consistency maintained'
      : e === 'impact'
        ? n > 5
          ? `Overall impact ${s} significantly`
          : n > 2
            ? `Overall impact ${s} moderately`
            : 'Impact level consistent'
        : `${e} trend: ${s}`;
  }
  generateComparisons(e, t = 'high_school') {
    const s = this.getBenchmarks(e, t),
      n = this.calculateAverages(),
      r = {};
    return (
      Object.keys(s).forEach(i => {
        const c = n[i] || 0,
          l = s[i],
          a = this.calculatePercentile(c, l);
        r[i] = {
          player: c,
          benchmark: l.average,
          percentile: a,
          status:
            a >= 75
              ? 'excellent'
              : a >= 50
                ? 'above_average'
                : a >= 25
                  ? 'below_average'
                  : 'needs_improvement',
        };
      }),
      r
    );
  }
  getBenchmarks(e, t) {
    const s = {
      high_school: {
        point_guard: {
          points: { average: 12.5, std: 5.2 },
          assists: { average: 4.8, std: 2.1 },
          rebounds: { average: 3.2, std: 1.5 },
          steals: { average: 1.8, std: 0.9 },
          turnovers: { average: 2.5, std: 1.2 },
        },
      },
    };
    return s[t]?.[e] || s.high_school.point_guard;
  }
  calculatePercentile(e, t) {
    const s = (e - t.average) / t.std;
    return Math.max(0, Math.min(100, 50 + s * 15));
  }
  calculateAverages() {
    if (this.performanceData.length === 0) return {};
    const e = this.performanceData.reduce(
        (s, n) => (
          Object.keys(n.stats).forEach(r => {
            s[r] = (s[r] || 0) + (n.stats[r] || 0);
          }),
          s
        ),
        {}
      ),
      t = {};
    return (
      Object.keys(e).forEach(s => {
        t[s] = e[s] / this.performanceData.length;
      }),
      t
    );
  }
  getRecommendations() {
    const e = this.performanceData.slice(-5),
      t = [];
    if (e.length === 0) return t;
    const s = e.reduce((r, i) => r + (i.stats.turnovers || 0), 0) / e.length,
      n =
        e.reduce((r, i) => {
          const c = i.stats.fga || 0;
          return r + (c > 0 ? (i.stats.fgm / c) * 100 : 0);
        }, 0) / e.length;
    return (
      s > 3 &&
        t.push({
          area: 'Ball Security',
          priority: 'high',
          issue: 'Above average turnovers in recent games',
          drills: [
            'Two-ball dribbling',
            'Pressure passing',
            'Decision-making scenarios',
          ],
          goal: 'Reduce turnovers to under 2.5 per game',
        }),
      n < 40 &&
        t.push({
          area: 'Shooting Efficiency',
          priority: 'medium',
          issue: 'Shooting percentage below optimal range',
          drills: [
            'Form shooting',
            'Catch and shoot',
            'Shot selection training',
          ],
          goal: 'Increase field goal percentage to 45%+',
        }),
      t
    );
  }
}
typeof window < 'u' && (window.PlayerAnalytics = g);
export { g as PlayerAnalytics };
//# sourceMappingURL=playerAnalytics-BQgY2Ufz.js.map
