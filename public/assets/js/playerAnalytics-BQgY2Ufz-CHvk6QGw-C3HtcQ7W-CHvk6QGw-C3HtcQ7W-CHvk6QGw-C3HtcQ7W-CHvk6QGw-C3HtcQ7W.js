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
      const s = (e.stats.fgm / e.stats.fga) * 100;
      s < 35 &&
        t.push({
          type: 'shooting',
          severity: 'warning',
          message: `Shot selection needs improvement - ${s.toFixed(1)}% FG on ${e.stats.fga} attempts`,
          recommendation:
            'Focus on high-percentage shots near the basket and open looks',
        });
    }
    const a =
      (e.stats.turnovers / (e.stats.assists + e.stats.points / 2)) * 100;
    return (
      a > 20 &&
        t.push({
          type: 'ballhandling',
          severity: 'alert',
          message: `High turnover rate: ${a.toFixed(1)}%`,
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
      a = e.points;
    return {
      effectiveFG: e.fga > 0 ? ((e.fgm + e.threePM * 0.5) / e.fga) * 100 : 0,
      trueShootingPct: t > 0 ? (a / (2 * t)) * 100 : 0,
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
      a = e.minutes,
      s =
        t.points * 1 +
        t.rebounds * 1.2 +
        t.assists * 1.5 +
        t.steals * 2 +
        t.blocks * 2 -
        t.turnovers * 1.5 -
        t.fouls * 0.5,
      n = a > 0 ? s / a : 0,
      r = n * 36;
    return { raw: s, perMinute: n, per36: r, rating: this.getImpactRating(r) };
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
    const a = {},
      s = this.calculateTrend(
        t.map(r => (r.stats.fga > 0 ? (r.stats.fgm / r.stats.fga) * 100 : 0))
      );
    a.shooting = {
      direction: s > 5 ? 'improving' : s < -5 ? 'declining' : 'stable',
      value: s,
      message: this.getTrendMessage('shooting', s),
    };
    const n = this.calculateTrend(t.map(r => r.impact.per36));
    return (
      (a.impact = {
        direction: n > 2 ? 'improving' : n < -2 ? 'declining' : 'stable',
        value: n,
        message: this.getTrendMessage('impact', n),
      }),
      a
    );
  }
  calculateTrend(e) {
    if (e.length < 2) return 0;
    const t = e.length,
      a = Array.from({ length: t }, (o, i) => i),
      s = a.reduce((o, i) => o + i, 0),
      n = e.reduce((o, i) => o + i, 0),
      r = a.reduce((o, i, l) => o + i * e[l], 0),
      c = a.reduce((o, i) => o + i * i, 0);
    return (t * r - s * n) / (t * c - s * s);
  }
  getTrendMessage(e, t) {
    const a = t > 0 ? 'improving' : 'declining',
      s = Math.abs(t);
    return e === 'shooting'
      ? s > 10
        ? `Shooting ${a} significantly (${t.toFixed(1)}% trend)`
        : s > 5
          ? `Shooting ${a} moderately`
          : 'Shooting consistency maintained'
      : e === 'impact'
        ? s > 5
          ? `Overall impact ${a} significantly`
          : s > 2
            ? `Overall impact ${a} moderately`
            : 'Impact level consistent'
        : `${e} trend: ${a}`;
  }
  generateComparisons(e, t = 'high_school') {
    const a = this.getBenchmarks(e, t),
      s = this.calculateAverages(),
      n = {};
    return (
      Object.keys(a).forEach(r => {
        const c = s[r] || 0,
          o = a[r],
          i = this.calculatePercentile(c, o);
        n[r] = {
          player: c,
          benchmark: o.average,
          percentile: i,
          status:
            i >= 75
              ? 'excellent'
              : i >= 50
                ? 'above_average'
                : i >= 25
                  ? 'below_average'
                  : 'needs_improvement',
        };
      }),
      n
    );
  }
  getBenchmarks(e, t) {
    const a = {
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
    return a[t]?.[e] || a.high_school.point_guard;
  }
  calculatePercentile(e, t) {
    const a = (e - t.average) / t.std;
    return Math.max(0, Math.min(100, 50 + a * 15));
  }
  calculateAverages() {
    if (this.performanceData.length === 0) return {};
    const e = this.performanceData.reduce(
        (a, s) => (
          Object.keys(s.stats).forEach(n => {
            a[n] = (a[n] || 0) + (s.stats[n] || 0);
          }),
          a
        ),
        {}
      ),
      t = {};
    return (
      Object.keys(e).forEach(a => {
        t[a] = e[a] / this.performanceData.length;
      }),
      t
    );
  }
  getRecommendations() {
    const e = this.performanceData.slice(-5),
      t = [];
    if (e.length === 0) return t;
    const a = e.reduce((n, r) => n + (r.stats.turnovers || 0), 0) / e.length,
      s =
        e.reduce((n, r) => {
          const c = r.stats.fga || 0;
          return n + (c > 0 ? (r.stats.fgm / c) * 100 : 0);
        }, 0) / e.length;
    return (
      a > 3 &&
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
      s < 40 &&
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
//# sourceMappingURL=playerAnalytics-BQgY2Ufz-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W-CHvk6QGw-C3HtcQ7W.js.map
