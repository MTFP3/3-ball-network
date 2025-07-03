// Smart Recruiting Hub - College Match Algorithm & Communication Center
// Connects players with college opportunities based on comprehensive data

class RecruitingHub {
  constructor() {
    this.collegeDatabase = [];
    this.playerProfiles = new Map();
    this.matchAlgorithm = new CollegeMatchAlgorithm();
    this.communicationCenter = new RecruiterCommunication();
    this.scholarshipCalculator = new ScholarshipCalculator();
  }

  // Initialize with college database
  async initializeCollegeData() {
    // Sample college data - in production, this would be a comprehensive database
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

  // Create comprehensive player profile
  createPlayerProfile(playerData) {
    const profile = {
      id: playerData.id,
      personal: {
        name: playerData.name,
        position: playerData.position,
        height: playerData.height,
        weight: playerData.weight,
        birthDate: playerData.birthDate,
        location: playerData.location,
      },
      academic: {
        gpa: playerData.gpa,
        sat: playerData.sat,
        act: playerData.act,
        classRank: playerData.classRank,
        coursework: playerData.coursework || [],
      },
      basketball: {
        stats: playerData.stats,
        highlights: playerData.highlights || [],
        awards: playerData.awards || [],
        teamSuccess: playerData.teamSuccess || {},
        coachRecommendations: playerData.coachRecommendations || [],
      },
      preferences: {
        preferredDivisions: playerData.preferences?.divisions || ['D1', 'D2'],
        preferredConferences: playerData.preferences?.conferences || [],
        locationPreferences: playerData.preferences?.location || 'any',
        academicFocus: playerData.preferences?.academics || 'balanced',
        playingTimeImportance: playerData.preferences?.playingTime || 'medium',
      },
      recruiting: {
        status: 'active',
        interests: [],
        communications: [],
        visits: [],
        offers: [],
      },
    };

    this.playerProfiles.set(playerData.id, profile);
    return profile;
  }

  // Find college matches using AI algorithm
  findCollegeMatches(playerId) {
    const player = this.playerProfiles.get(playerId);
    if (!player) return [];

    const matches = this.collegeDatabase.map(college => {
      const compatibility = this.matchAlgorithm.calculateCompatibility(
        player,
        college
      );
      return {
        college,
        compatibility,
        reasoning: this.matchAlgorithm.getReasoningDetails(
          player,
          college,
          compatibility
        ),
      };
    });

    // Sort by compatibility score and return top matches
    return matches
      .sort((a, b) => b.compatibility.overall - a.compatibility.overall)
      .slice(0, 10);
  }

  // Calculate scholarship probability
  calculateScholarshipProbability(playerId, collegeId) {
    const player = this.playerProfiles.get(playerId);
    const college = this.collegeDatabase.find(c => c.id === collegeId);

    if (!player || !college) return 0;

    return this.scholarshipCalculator.calculate(player, college);
  }

  // Communication center methods
  sendMessageToRecruiter(playerId, collegeId, message) {
    return this.communicationCenter.sendMessage(playerId, collegeId, message);
  }

  getRecruiterMessages(playerId) {
    return this.communicationCenter.getMessages(playerId);
  }

  // Highlight reel builder
  buildHighlightReel(playerId, clips) {
    const player = this.playerProfiles.get(playerId);
    if (!player) return null;

    const highlightReel = {
      playerId,
      playerName: player.personal.name,
      position: player.personal.position,
      clips: clips.map(clip => ({
        id: clip.id,
        title: clip.title,
        description: clip.description,
        videoUrl: clip.videoUrl,
        gameDate: clip.gameDate,
        opponent: clip.opponent,
        stats: clip.stats,
        tags: this.generateClipTags(clip),
      })),
      summary: this.generateReelSummary(player, clips),
      createdAt: new Date().toISOString(),
    };

    return highlightReel;
  }

  generateClipTags(clip) {
    const tags = [];

    if (clip.stats?.points >= 20) tags.push('scoring');
    if (clip.stats?.assists >= 8) tags.push('playmaking');
    if (clip.stats?.rebounds >= 10) tags.push('rebounding');
    if (clip.stats?.steals >= 4) tags.push('defense');
    if (clip.description?.includes('clutch')) tags.push('clutch');
    if (clip.description?.includes('leadership')) tags.push('leadership');

    return tags;
  }

  generateReelSummary(player, clips) {
    const totalStats = clips.reduce(
      (sum, clip) => ({
        points: (sum.points || 0) + (clip.stats?.points || 0),
        assists: (sum.assists || 0) + (clip.stats?.assists || 0),
        rebounds: (sum.rebounds || 0) + (clip.stats?.rebounds || 0),
      }),
      {}
    );

    return {
      playerOverview: `${player.personal.position} • ${player.personal.height} • ${player.academic.gpa} GPA`,
      highlightStats: `${Math.round(totalStats.points / clips.length)} PPG, ${Math.round(totalStats.assists / clips.length)} APG, ${Math.round(totalStats.rebounds / clips.length)} RPG`,
      keyStrengths: this.identifyKeyStrengths(player, clips),
      videoCount: clips.length,
      totalDuration: clips.reduce(
        (sum, clip) => sum + (clip.duration || 30),
        0
      ),
    };
  }

  identifyKeyStrengths(player, clips) {
    const strengths = [];
    const avgStats = player.basketball.stats;

    if (avgStats.assists >= 6) strengths.push('Elite Playmaker');
    if (avgStats.points >= 18) strengths.push('Prolific Scorer');
    if (avgStats.steals >= 2) strengths.push('Defensive Disruptor');
    if (player.academic.gpa >= 3.5) strengths.push('Academic Excellence');
    if (player.basketball.awards?.length > 0) strengths.push('Proven Winner');

    return strengths.slice(0, 3);
  }
}

// College Match Algorithm
class CollegeMatchAlgorithm {
  calculateCompatibility(player, college) {
    const scores = {
      academic: this.calculateAcademicFit(player, college),
      athletic: this.calculateAthleticFit(player, college),
      cultural: this.calculateCulturalFit(player, college),
      opportunity: this.calculateOpportunityFit(player, college),
    };

    // Weighted overall score
    const overall =
      scores.academic * 0.3 +
      scores.athletic * 0.4 +
      scores.cultural * 0.2 +
      scores.opportunity * 0.1;

    return {
      overall: Math.round(overall),
      academic: Math.round(scores.academic),
      athletic: Math.round(scores.athletic),
      cultural: Math.round(scores.cultural),
      opportunity: Math.round(scores.opportunity),
    };
  }

  calculateAcademicFit(player, college) {
    let score = 0;

    // GPA comparison
    if (player.academic.gpa >= college.requirements.minGPA + 0.5) score += 40;
    else if (player.academic.gpa >= college.requirements.minGPA) score += 25;
    else score += 10;

    // Test scores
    if (player.academic.sat >= college.requirements.minSAT + 100) score += 30;
    else if (player.academic.sat >= college.requirements.minSAT) score += 20;
    else score += 5;

    // Class rank bonus
    if (player.academic.classRank && player.academic.classRank <= 10)
      score += 30;

    return Math.min(100, score);
  }

  calculateAthleticFit(player, college) {
    let score = 0;
    const playerPos = player.personal.position;
    const playerStats = player.basketball.stats;

    // Position need
    if (college.recruiting.positions.includes(playerPos)) score += 30;

    // Stats comparison with college averages
    const collegeAvg = college.stats?.averageStats?.[playerPos];
    if (collegeAvg) {
      if (playerStats.points >= collegeAvg.points * 0.8) score += 25;
      if (playerStats.assists >= collegeAvg.assists * 0.8) score += 25;
      if (playerStats.rebounds >= collegeAvg.rebounds * 0.8) score += 20;
    }

    return Math.min(100, score);
  }

  calculateCulturalFit(player, college) {
    let score = 50; // Base score

    // Location preference
    if (player.preferences.locationPreferences !== 'any') {
      const playerRegion = this.getRegion(player.personal.location);
      const collegeRegion = this.getRegion(college.location);
      if (playerRegion === collegeRegion) score += 25;
    }

    // Academic focus alignment
    if (
      player.preferences.academicFocus === 'high' &&
      college.requirements.minGPA >= 3.5
    ) {
      score += 25;
    }

    return Math.min(100, score);
  }

  calculateOpportunityFit(player, college) {
    let score = 0;

    // Scholarship availability
    if (college.recruiting.scholarshipsAvailable > 0) score += 40;

    // Playing time opportunity
    if (player.preferences.playingTimeImportance === 'high') {
      if (college.recruiting.scholarshipsAvailable >= 2) score += 30;
    }

    // Conference strength vs player level
    const conferenceStrength = this.getConferenceStrength(college.conference);
    if (conferenceStrength === 'high' && player.basketball.stats.points >= 15)
      score += 30;

    return Math.min(100, score);
  }

  getRegion(location) {
    const stateRegions = {
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
    };

    const state = location.split(', ').pop();
    return stateRegions[state] || 'Other';
  }

  getConferenceStrength(conference) {
    const strongConferences = ['ACC', 'Big Ten', 'Big 12', 'SEC', 'Pac-12'];
    return strongConferences.includes(conference) ? 'high' : 'medium';
  }

  getReasoningDetails(player, college, compatibility) {
    const details = [];

    if (compatibility.academic >= 80) {
      details.push('Strong academic profile matches school standards');
    } else if (compatibility.academic < 50) {
      details.push('Academic credentials may need improvement');
    }

    if (compatibility.athletic >= 80) {
      details.push('Stats indicate strong fit for program level');
    }

    if (college.recruiting.positions.includes(player.personal.position)) {
      details.push(`Program actively recruiting ${player.personal.position}s`);
    }

    if (college.recruiting.scholarshipsAvailable > 0) {
      details.push(
        `${college.recruiting.scholarshipsAvailable} scholarships potentially available`
      );
    }

    return details;
  }
}

// Scholarship Probability Calculator
class ScholarshipCalculator {
  calculate(player, college) {
    let probability = 0;

    // Base probability from academic fit
    if (player.academic.gpa >= college.requirements.minGPA + 0.5)
      probability += 30;
    else if (player.academic.gpa >= college.requirements.minGPA)
      probability += 15;

    // Athletic performance
    const playerStats = player.basketball.stats;
    if (playerStats.points >= 15) probability += 25;
    if (playerStats.assists >= 5) probability += 15;
    if (playerStats.rebounds >= 6) probability += 10;

    // Position need
    if (college.recruiting.positions.includes(player.personal.position)) {
      probability += 20;
    }

    // Scholarship availability
    if (college.recruiting.scholarshipsAvailable > 0) {
      probability += 15;
    }

    // Awards and recognition
    if (player.basketball.awards?.length > 0) {
      probability += 10;
    }

    return Math.min(95, Math.max(5, probability));
  }
}

// Recruiter Communication Center
class RecruiterCommunication {
  constructor() {
    this.messages = new Map();
    this.conversations = new Map();
  }

  sendMessage(playerId, collegeId, messageData) {
    const messageId = this.generateMessageId();
    const message = {
      id: messageId,
      playerId,
      collegeId,
      type: messageData.type || 'message',
      subject: messageData.subject,
      content: messageData.content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachments: messageData.attachments || [],
    };

    if (!this.messages.has(playerId)) {
      this.messages.set(playerId, []);
    }

    this.messages.get(playerId).push(message);
    return message;
  }

  getMessages(playerId) {
    return this.messages.get(playerId) || [];
  }

  generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Export for ES modules
export {
  RecruitingHub,
  CollegeMatchAlgorithm,
  ScholarshipCalculator,
  RecruiterCommunication,
};

// Also make available globally for backward compatibility
if (typeof window !== 'undefined') {
  window.RecruitingHub = RecruitingHub;
  window.CollegeMatchAlgorithm = CollegeMatchAlgorithm;
  window.ScholarshipCalculator = ScholarshipCalculator;
  window.RecruiterCommunication = RecruiterCommunication;
}
