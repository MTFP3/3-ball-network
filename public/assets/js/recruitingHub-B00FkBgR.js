class l {
  constructor() {
    ((this.collegeDatabase = []),
      (this.playerProfiles = new Map()),
      (this.matchAlgorithm = new o()),
      (this.communicationCenter = new h()),
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
  createPlayerProfile(e) {
    const s = {
      id: e.id,
      personal: {
        name: e.name,
        position: e.position,
        height: e.height,
        weight: e.weight,
        birthDate: e.birthDate,
        location: e.location,
      },
      academic: {
        gpa: e.gpa,
        sat: e.sat,
        act: e.act,
        classRank: e.classRank,
        coursework: e.coursework || [],
      },
      basketball: {
        stats: e.stats,
        highlights: e.highlights || [],
        awards: e.awards || [],
        teamSuccess: e.teamSuccess || {},
        coachRecommendations: e.coachRecommendations || [],
      },
      preferences: {
        preferredDivisions: e.preferences?.divisions || ['D1', 'D2'],
        preferredConferences: e.preferences?.conferences || [],
        locationPreferences: e.preferences?.location || 'any',
        academicFocus: e.preferences?.academics || 'balanced',
        playingTimeImportance: e.preferences?.playingTime || 'medium',
      },
      recruiting: {
        status: 'active',
        interests: [],
        communications: [],
        visits: [],
        offers: [],
      },
    };
    return (this.playerProfiles.set(e.id, s), s);
  }
  findCollegeMatches(e) {
    const s = this.playerProfiles.get(e);
    return s
      ? this.collegeDatabase
          .map(i => {
            const n = this.matchAlgorithm.calculateCompatibility(s, i);
            return {
              college: i,
              compatibility: n,
              reasoning: this.matchAlgorithm.getReasoningDetails(s, i, n),
            };
          })
          .sort((i, n) => n.compatibility.overall - i.compatibility.overall)
          .slice(0, 10)
      : [];
  }
  calculateScholarshipProbability(e, s) {
    const t = this.playerProfiles.get(e),
      i = this.collegeDatabase.find(n => n.id === s);
    return !t || !i ? 0 : this.scholarshipCalculator.calculate(t, i);
  }
  sendMessageToRecruiter(e, s, t) {
    return this.communicationCenter.sendMessage(e, s, t);
  }
  getRecruiterMessages(e) {
    return this.communicationCenter.getMessages(e);
  }
  buildHighlightReel(e, s) {
    const t = this.playerProfiles.get(e);
    return t
      ? {
          playerId: e,
          playerName: t.personal.name,
          position: t.personal.position,
          clips: s.map(n => ({
            id: n.id,
            title: n.title,
            description: n.description,
            videoUrl: n.videoUrl,
            gameDate: n.gameDate,
            opponent: n.opponent,
            stats: n.stats,
            tags: this.generateClipTags(n),
          })),
          summary: this.generateReelSummary(t, s),
          createdAt: new Date().toISOString(),
        }
      : null;
  }
  generateClipTags(e) {
    const s = [];
    return (
      e.stats?.points >= 20 && s.push('scoring'),
      e.stats?.assists >= 8 && s.push('playmaking'),
      e.stats?.rebounds >= 10 && s.push('rebounding'),
      e.stats?.steals >= 4 && s.push('defense'),
      e.description?.includes('clutch') && s.push('clutch'),
      e.description?.includes('leadership') && s.push('leadership'),
      s
    );
  }
  generateReelSummary(e, s) {
    const t = s.reduce(
      (i, n) => ({
        points: (i.points || 0) + (n.stats?.points || 0),
        assists: (i.assists || 0) + (n.stats?.assists || 0),
        rebounds: (i.rebounds || 0) + (n.stats?.rebounds || 0),
      }),
      {}
    );
    return {
      playerOverview: `${e.personal.position} • ${e.personal.height} • ${e.academic.gpa} GPA`,
      highlightStats: `${Math.round(t.points / s.length)} PPG, ${Math.round(t.assists / s.length)} APG, ${Math.round(t.rebounds / s.length)} RPG`,
      keyStrengths: this.identifyKeyStrengths(e, s),
      videoCount: s.length,
      totalDuration: s.reduce((i, n) => i + (n.duration || 30), 0),
    };
  }
  identifyKeyStrengths(e, s) {
    const t = [],
      i = e.basketball.stats;
    return (
      i.assists >= 6 && t.push('Elite Playmaker'),
      i.points >= 18 && t.push('Prolific Scorer'),
      i.steals >= 2 && t.push('Defensive Disruptor'),
      e.academic.gpa >= 3.5 && t.push('Academic Excellence'),
      e.basketball.awards?.length > 0 && t.push('Proven Winner'),
      t.slice(0, 3)
    );
  }
}
class o {
  calculateCompatibility(e, s) {
    const t = {
        academic: this.calculateAcademicFit(e, s),
        athletic: this.calculateAthleticFit(e, s),
        cultural: this.calculateCulturalFit(e, s),
        opportunity: this.calculateOpportunityFit(e, s),
      },
      i =
        t.academic * 0.3 +
        t.athletic * 0.4 +
        t.cultural * 0.2 +
        t.opportunity * 0.1;
    return {
      overall: Math.round(i),
      academic: Math.round(t.academic),
      athletic: Math.round(t.athletic),
      cultural: Math.round(t.cultural),
      opportunity: Math.round(t.opportunity),
    };
  }
  calculateAcademicFit(e, s) {
    let t = 0;
    return (
      e.academic.gpa >= s.requirements.minGPA + 0.5
        ? (t += 40)
        : e.academic.gpa >= s.requirements.minGPA
          ? (t += 25)
          : (t += 10),
      e.academic.sat >= s.requirements.minSAT + 100
        ? (t += 30)
        : e.academic.sat >= s.requirements.minSAT
          ? (t += 20)
          : (t += 5),
      e.academic.classRank && e.academic.classRank <= 10 && (t += 30),
      Math.min(100, t)
    );
  }
  calculateAthleticFit(e, s) {
    let t = 0;
    const i = e.personal.position,
      n = e.basketball.stats;
    s.recruiting.positions.includes(i) && (t += 30);
    const a = s.stats?.averageStats?.[i];
    return (
      a &&
        (n.points >= a.points * 0.8 && (t += 25),
        n.assists >= a.assists * 0.8 && (t += 25),
        n.rebounds >= a.rebounds * 0.8 && (t += 20)),
      Math.min(100, t)
    );
  }
  calculateCulturalFit(e, s) {
    let t = 50;
    if (e.preferences.locationPreferences !== 'any') {
      const i = this.getRegion(e.personal.location),
        n = this.getRegion(s.location);
      i === n && (t += 25);
    }
    return (
      e.preferences.academicFocus === 'high' &&
        s.requirements.minGPA >= 3.5 &&
        (t += 25),
      Math.min(100, t)
    );
  }
  calculateOpportunityFit(e, s) {
    let t = 0;
    return (
      s.recruiting.scholarshipsAvailable > 0 && (t += 40),
      e.preferences.playingTimeImportance === 'high' &&
        s.recruiting.scholarshipsAvailable >= 2 &&
        (t += 30),
      this.getConferenceStrength(s.conference) === 'high' &&
        e.basketball.stats.points >= 15 &&
        (t += 30),
      Math.min(100, t)
    );
  }
  getRegion(e) {
    const s = {
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
      t = e.split(', ').pop();
    return s[t] || 'Other';
  }
  getConferenceStrength(e) {
    return ['ACC', 'Big Ten', 'Big 12', 'SEC', 'Pac-12'].includes(e)
      ? 'high'
      : 'medium';
  }
  getReasoningDetails(e, s, t) {
    const i = [];
    return (
      t.academic >= 80
        ? i.push('Strong academic profile matches school standards')
        : t.academic < 50 &&
          i.push('Academic credentials may need improvement'),
      t.athletic >= 80 && i.push('Stats indicate strong fit for program level'),
      s.recruiting.positions.includes(e.personal.position) &&
        i.push(`Program actively recruiting ${e.personal.position}s`),
      s.recruiting.scholarshipsAvailable > 0 &&
        i.push(
          `${s.recruiting.scholarshipsAvailable} scholarships potentially available`
        ),
      i
    );
  }
}
class c {
  calculate(e, s) {
    let t = 0;
    e.academic.gpa >= s.requirements.minGPA + 0.5
      ? (t += 30)
      : e.academic.gpa >= s.requirements.minGPA && (t += 15);
    const i = e.basketball.stats;
    return (
      i.points >= 15 && (t += 25),
      i.assists >= 5 && (t += 15),
      i.rebounds >= 6 && (t += 10),
      s.recruiting.positions.includes(e.personal.position) && (t += 20),
      s.recruiting.scholarshipsAvailable > 0 && (t += 15),
      e.basketball.awards?.length > 0 && (t += 10),
      Math.min(95, Math.max(5, t))
    );
  }
}
class h {
  constructor() {
    ((this.messages = new Map()), (this.conversations = new Map()));
  }
  sendMessage(e, s, t) {
    const n = {
      id: this.generateMessageId(),
      playerId: e,
      collegeId: s,
      type: t.type || 'message',
      subject: t.subject,
      content: t.content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachments: t.attachments || [],
    };
    return (
      this.messages.has(e) || this.messages.set(e, []),
      this.messages.get(e).push(n),
      n
    );
  }
  getMessages(e) {
    return this.messages.get(e) || [];
  }
  generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
typeof window < 'u' &&
  ((window.RecruitingHub = l),
  (window.CollegeMatchAlgorithm = o),
  (window.ScholarshipCalculator = c),
  (window.RecruiterCommunication = h));
export {
  o as CollegeMatchAlgorithm,
  h as RecruiterCommunication,
  l as RecruitingHub,
  c as ScholarshipCalculator,
};
//# sourceMappingURL=recruitingHub-B00FkBgR.js.map
