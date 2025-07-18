// Removed broken modulepreload import;
import './platformManager.js';
/* empty css                                                              */ class h {
  constructor() {
    ((this.collegeDatabase = []),
      (this.playerProfiles = new Map()),
      (this.matchAlgorithm = new o()),
      (this.communicationCenter = new l()),
      (this.scholarshipCalculator = new c()));
  }
  async initializeCollegeData() {
    this.collegeDatabase = [
      {
        id: 'duke_university',
        name: 'Duke University',
        conference: 'ACC',
        division: 'D1',
        location: 'Durham, NC',
        requirements: {
          minGPA: 3.5,
          minSAT: 1400,
          minACT: 32,
          minHeight: { PG: "5'10", SG: "6'2", SF: "6'5", PF: "6'7", C: "6'9" },
        },
        recruiting: {
          positions: ['PG', 'SG', 'SF'],
          style: 'fast_paced',
          priorities: ['basketball_iq', 'athleticism', 'academics'],
          scholarshipsAvailable: 2,
        },
        stats: {
          averageStats: {
            PG: { points: 18.5, assists: 6.2, rebounds: 4.1 },
            SG: { points: 16.8, assists: 3.1, rebounds: 5.2 },
            SF: { points: 15.2, assists: 4.1, rebounds: 6.8 },
          },
          winRate: 0.85,
          nbaProspects: 0.15,
        },
      },
      {
        id: 'university_california',
        name: 'University of California',
        conference: 'Pac-12',
        division: 'D1',
        location: 'Berkeley, CA',
        requirements: {
          minGPA: 3.2,
          minSAT: 1200,
          minACT: 26,
          minHeight: { PG: "5'8", SG: "6'0", SF: "6'3", PF: "6'5", C: "6'7" },
        },
        recruiting: {
          positions: ['PG', 'SF', 'PF'],
          style: 'balanced',
          priorities: ['leadership', 'versatility', 'academics'],
          scholarshipsAvailable: 3,
        },
      },
      {
        id: 'arizona_state',
        name: 'Arizona State University',
        conference: 'Pac-12',
        division: 'D1',
        location: 'Tempe, AZ',
        requirements: {
          minGPA: 2.8,
          minSAT: 1100,
          minACT: 24,
          minHeight: { PG: "5'9", SG: "6'1", SF: "6'4", PF: "6'6", C: "6'8" },
        },
        recruiting: {
          positions: ['SG', 'SF', 'PF'],
          style: 'athletic',
          priorities: ['athleticism', 'potential', 'character'],
          scholarshipsAvailable: 4,
        },
      },
    ];
  }
  createPlayerProfile(t) {
    const i = {
      id: t.id,
      personal: {
        name: t.name,
        position: t.position,
        height: t.height,
        weight: t.weight,
        birthDate: t.birthDate,
        location: t.location,
      },
      academic: {
        gpa: t.gpa,
        sat: t.sat,
        act: t.act,
        classRank: t.classRank,
        coursework: t.coursework || [],
      },
      basketball: {
        stats: t.stats,
        highlights: t.highlights || [],
        awards: t.awards || [],
        teamSuccess: t.teamSuccess || {},
        coachRecommendations: t.coachRecommendations || [],
      },
      preferences: {
        preferredDivisions: t.preferences?.divisions || ['D1', 'D2'],
        preferredConferences: t.preferences?.conferences || [],
        locationPreferences: t.preferences?.location || 'any',
        academicFocus: t.preferences?.academics || 'balanced',
        playingTimeImportance: t.preferences?.playingTime || 'medium',
      },
      recruiting: {
        status: 'active',
        interests: [],
        communications: [],
        visits: [],
        offers: [],
      },
    };
    return (this.playerProfiles.set(t.id, i), i);
  }
  findCollegeMatches(t) {
    const i = this.playerProfiles.get(t);
    return i
      ? this.collegeDatabase
          .map(e => {
            const s = this.matchAlgorithm.calculateCompatibility(i, e);
            return {
              college: e,
              compatibility: s,
              reasoning: this.matchAlgorithm.getReasoningDetails(i, e, s),
            };
          })
          .sort((e, s) => s.compatibility.overall - e.compatibility.overall)
          .slice(0, 10)
      : [];
  }
  calculateScholarshipProbability(t, i) {
    const e = this.playerProfiles.get(t),
      s = this.collegeDatabase.find(a => a.id === i);
    return !e || !s ? 0 : this.scholarshipCalculator.calculate(e, s);
  }
  sendMessageToRecruiter(t, i, e) {
    return this.communicationCenter.sendMessage(t, i, e);
  }
  getRecruiterMessages(t) {
    return this.communicationCenter.getMessages(t);
  }
  buildHighlightReel(t, i) {
    const e = this.playerProfiles.get(t);
    return e
      ? {
          playerId: t,
          playerName: e.personal.name,
          position: e.personal.position,
          clips: i.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            videoUrl: s.videoUrl,
            gameDate: s.gameDate,
            opponent: s.opponent,
            stats: s.stats,
            tags: this.generateClipTags(s),
          })),
          summary: this.generateReelSummary(e, i),
          createdAt: new Date().toISOString(),
        }
      : null;
  }
  generateClipTags(t) {
    const i = [];
    return (
      t.stats?.points >= 20 && i.push('scoring'),
      t.stats?.assists >= 8 && i.push('playmaking'),
      t.stats?.rebounds >= 10 && i.push('rebounding'),
      t.stats?.steals >= 4 && i.push('defense'),
      t.description?.includes('clutch') && i.push('clutch'),
      t.description?.includes('leadership') && i.push('leadership'),
      i
    );
  }
  generateReelSummary(t, i) {
    const e = i.reduce(
      (s, a) => ({
        points: (s.points || 0) + (a.stats?.points || 0),
        assists: (s.assists || 0) + (a.stats?.assists || 0),
        rebounds: (s.rebounds || 0) + (a.stats?.rebounds || 0),
      }),
      {}
    );
    return {
      playerOverview: `${t.personal.position} • ${t.personal.height} • ${t.academic.gpa} GPA`,
      highlightStats: `${Math.round(e.points / i.length)} PPG, ${Math.round(e.assists / i.length)} APG, ${Math.round(e.rebounds / i.length)} RPG`,
      keyStrengths: this.identifyKeyStrengths(t),
      videoCount: i.length,
      totalDuration: i.reduce((s, a) => s + (a.duration || 30), 0),
    };
  }
  identifyKeyStrengths(t) {
    const e = [],
      s = t.basketball.stats;
    return (
      s.assists >= 6 && e.push('Elite Playmaker'),
      s.points >= 18 && e.push('Prolific Scorer'),
      s.steals >= 2 && e.push('Defensive Disruptor'),
      t.academic.gpa >= 3.5 && e.push('Academic Excellence'),
      t.basketball.awards?.length > 0 && e.push('Proven Winner'),
      e.slice(0, 3)
    );
  }
}
class o {
  calculateCompatibility(t, i) {
    const e = {
        academic: this.calculateAcademicFit(t, i),
        athletic: this.calculateAthleticFit(t, i),
        cultural: this.calculateCulturalFit(t, i),
        opportunity: this.calculateOpportunityFit(t, i),
      },
      s =
        e.academic * 0.3 +
        e.athletic * 0.4 +
        e.cultural * 0.2 +
        e.opportunity * 0.1;
    return {
      overall: Math.round(s),
      academic: Math.round(e.academic),
      athletic: Math.round(e.athletic),
      cultural: Math.round(e.cultural),
      opportunity: Math.round(e.opportunity),
    };
  }
  calculateAcademicFit(t, i) {
    let e = 0;
    return (
      t.academic.gpa >= i.requirements.minGPA + 0.5
        ? (e += 40)
        : t.academic.gpa >= i.requirements.minGPA
          ? (e += 25)
          : (e += 10),
      t.academic.sat >= i.requirements.minSAT + 100
        ? (e += 30)
        : t.academic.sat >= i.requirements.minSAT
          ? (e += 20)
          : (e += 5),
      t.academic.classRank && t.academic.classRank <= 10 && (e += 30),
      Math.min(100, e)
    );
  }
  calculateAthleticFit(t, i) {
    let e = 0;
    const s = t.personal.position,
      a = t.basketball.stats;
    i.recruiting.positions.includes(s) && (e += 30);
    const n = i.stats?.averageStats?.[s];
    return (
      n &&
        (a.points >= n.points * 0.8 && (e += 25),
        a.assists >= n.assists * 0.8 && (e += 25),
        a.rebounds >= n.rebounds * 0.8 && (e += 20)),
      Math.min(100, e)
    );
  }
  calculateCulturalFit(t, i) {
    let e = 50;
    if (t.preferences.locationPreferences !== 'any') {
      const s = this.getRegion(t.personal.location),
        a = this.getRegion(i.location);
      s === a && (e += 25);
    }
    return (
      t.preferences.academicFocus === 'high' &&
        i.requirements.minGPA >= 3.5 &&
        (e += 25),
      Math.min(100, e)
    );
  }
  calculateOpportunityFit(t, i) {
    let e = 0;
    return (
      i.recruiting.scholarshipsAvailable > 0 && (e += 40),
      t.preferences.playingTimeImportance === 'high' &&
        i.recruiting.scholarshipsAvailable >= 2 &&
        (e += 30),
      this.getConferenceStrength(i.conference) === 'high' &&
        t.basketball.stats.points >= 15 &&
        (e += 30),
      Math.min(100, e)
    );
  }
  getRegion(t) {
    const i = {
        CA: 'West',
        OR: 'West',
        WA: 'West',
        NV: 'West',
        AZ: 'West',
        TX: 'South',
        FL: 'South',
        GA: 'South',
        NC: 'South',
        SC: 'South',
        NY: 'Northeast',
        MA: 'Northeast',
        CT: 'Northeast',
        NJ: 'Northeast',
        IL: 'Midwest',
        OH: 'Midwest',
        MI: 'Midwest',
        IN: 'Midwest',
      },
      e = t.split(', ').pop();
    return i[e] || 'Other';
  }
  getConferenceStrength(t) {
    return ['ACC', 'Big Ten', 'Big 12', 'SEC', 'Pac-12'].includes(t)
      ? 'high'
      : 'medium';
  }
  getReasoningDetails(t, i, e) {
    const s = [];
    return (
      e.academic >= 80
        ? s.push('Strong academic profile matches school standards')
        : e.academic < 50 &&
          s.push('Academic credentials may need improvement'),
      e.athletic >= 80 && s.push('Stats indicate strong fit for program level'),
      i.recruiting.positions.includes(t.personal.position) &&
        s.push(`Program actively recruiting ${t.personal.position}s`),
      i.recruiting.scholarshipsAvailable > 0 &&
        s.push(
          `${i.recruiting.scholarshipsAvailable} scholarships potentially available`
        ),
      s
    );
  }
}
class c {
  calculate(t, i) {
    let e = 0;
    t.academic.gpa >= i.requirements.minGPA + 0.5
      ? (e += 30)
      : t.academic.gpa >= i.requirements.minGPA && (e += 15);
    const s = t.basketball.stats;
    return (
      s.points >= 15 && (e += 25),
      s.assists >= 5 && (e += 15),
      s.rebounds >= 6 && (e += 10),
      i.recruiting.positions.includes(t.personal.position) && (e += 20),
      i.recruiting.scholarshipsAvailable > 0 && (e += 15),
      t.basketball.awards?.length > 0 && (e += 10),
      Math.min(95, Math.max(5, e))
    );
  }
}
class l {
  constructor() {
    ((this.messages = new Map()), (this.conversations = new Map()));
  }
  sendMessage(t, i, e) {
    const s = {
      id: this.generateMessageId(),
      playerId: t,
      collegeId: i,
      type: e.type || 'message',
      subject: e.subject,
      content: e.content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachments: e.attachments || [],
    };
    return (
      this.messages.has(t) || this.messages.set(t, []),
      this.messages.get(t).push(s),
      s
    );
  }
  getMessages(t) {
    return this.messages.get(t) || [];
  }
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
typeof window < 'u' &&
  ((window.RecruitingHub = h),
  (window.CollegeMatchAlgorithm = o),
  (window.ScholarshipCalculator = c),
  (window.RecruiterCommunication = l));
//# sourceMappingURL=demo-player.js.map
