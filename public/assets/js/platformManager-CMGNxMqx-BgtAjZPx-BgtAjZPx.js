class a{constructor(){this.modules={},this.sharedData={currentUser:null,gameSession:null,playerProfile:{},teamData:{},performanceMetrics:{},socialConnections:[]},this.eventListeners={},this.initializeModules(),this.setupEventSystem()}initializeModules(){typeof PlayerAnalytics<"u"&&(this.modules.analytics=new PlayerAnalytics),typeof RecruitingHub<"u"&&(this.modules.recruiting=new RecruitingHub),typeof SmartGameInput<"u"&&(this.modules.gameInput=new SmartGameInput),this.setupModuleConnections()}setupModuleConnections(){this.modules.gameInput&&this.modules.analytics&&(this.modules.gameInput.onStatRecorded=e=>{this.modules.analytics.trackPerformance(e),this.updateSharedMetrics(e)}),this.modules.analytics&&this.modules.recruiting&&(this.modules.analytics.onInsightGenerated=e=>{this.modules.recruiting.updatePlayerMetrics(e),this.broadcastEvent("insight-generated",e)})}setupEventSystem(){this.eventBus={listeners:{},emit:(e,t)=>{this.eventBus.listeners[e]&&this.eventBus.listeners[e].forEach(s=>s(t))},on:(e,t)=>{this.eventBus.listeners[e]||(this.eventBus.listeners[e]=[]),this.eventBus.listeners[e].push(t)}},this.setupDefaultEventHandlers()}setupDefaultEventHandlers(){this.eventBus.on("game-completed",e=>{this.processGameCompletion(e)}),this.eventBus.on("achievement-unlocked",e=>{this.handleAchievementUnlock(e)}),this.eventBus.on("recruiter-message",e=>{this.handleRecruiterCommunication(e)}),this.eventBus.on("team-chemistry-update",e=>{this.updateTeamChemistry(e)})}processGameCompletion(e){if(this.modules.analytics){const t=this.modules.analytics.trackPerformance(e);this.sharedData.performanceMetrics=t}this.checkAchievements(e),this.modules.recruiting&&this.modules.recruiting.updatePlayerStats(e.stats),this.updateSocialFeed({type:"game-completed",player:e.player,stats:e.stats,timestamp:new Date().toISOString()}),this.saveGameData(e)}checkAchievements(e){[{id:"first-triple-double",name:"First Triple-Double",check:t=>t.points>=10&&t.rebounds>=10&&t.assists>=10},{id:"sharpshooter",name:"Sharpshooter",check:t=>t.tpm>=10},{id:"defensive-specialist",name:"Defensive Specialist",check:t=>t.steals>=5&&t.blocks>=3},{id:"lightning-fast",name:"Lightning Fast",check:t=>t.firstQuarterPoints>=20},{id:"clutch-player",name:"Clutch Player",check:t=>t.gameWinningShot===!0}].forEach(t=>{t.check(e.stats)&&this.unlockAchievement(t)})}unlockAchievement(e){const t=this.getUnlockedAchievements();t.includes(e.id)||(t.push(e.id),localStorage.setItem("unlockedAchievements",JSON.stringify(t)),this.eventBus.emit("achievement-unlocked",e),this.showAchievementNotification(e))}getUnlockedAchievements(){const e=localStorage.getItem("unlockedAchievements");return e?JSON.parse(e):[]}showAchievementNotification(e){const t=document.createElement("div");t.className="achievement-notification",t.innerHTML=`
      <div class="achievement-popup">
        <div class="achievement-icon">🏆</div>
        <div class="achievement-content">
          <h3>Achievement Unlocked!</h3>
          <p>${e.name}</p>
        </div>
      </div>
    `;const s=`
      .achievement-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
      }
      .achievement-popup {
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: #333;
        padding: 1em 1.5em;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(255, 215, 0, 0.4);
        display: flex;
        align-items: center;
        gap: 1em;
        min-width: 300px;
      }
      .achievement-icon {
        font-size: 2em;
      }
      .achievement-content h3 {
        margin: 0;
        font-size: 1.1em;
        font-weight: 900;
      }
      .achievement-content p {
        margin: 0.2em 0 0 0;
        font-size: 0.9em;
      }
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;if(!document.querySelector("#achievement-styles")){const i=document.createElement("style");i.id="achievement-styles",i.textContent=s,document.head.appendChild(i)}document.body.appendChild(t),setTimeout(()=>{t.style.animation="slideInRight 0.5s ease-out reverse",setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},500)},5e3)}updateTeamChemistry(e){const t={overall:this.calculateTeamChemistry(e),connections:this.analyzePlayerConnections(e),recommendations:this.generateChemistryRecommendations(e)};this.sharedData.teamData.chemistry=t,this.eventBus.emit("chemistry-updated",t)}calculateTeamChemistry(e){const t={communication:e.communicationEvents||0,assists:e.totalAssists||0,turnovers:e.totalTurnovers||0,winRate:e.winRate||0},s=Math.min(t.communication/50*100,100),i=Math.max(0,100-t.turnovers/t.assists*20),n=t.winRate*100;return Math.round((s+i+n)/3)}analyzePlayerConnections(e){const t={};return e.playerStats&&Object.keys(e.playerStats).forEach(s=>{t[s]={},Object.keys(e.playerStats).forEach(i=>{s!==i&&(t[s][i]=this.calculateConnectionStrength(e.playerStats[s],e.playerStats[i]))})}),t}calculateConnectionStrength(e,t){const s=(e.assistsToPlayer2||0)/Math.max(e.totalAssists||1,1),i=(e.turnoversWithPlayer2||0)/Math.max(e.totalTurnovers||1,1),n=s*100-i*50;return n>=70?"high":n>=40?"medium":"low"}generateChemistryRecommendations(e){const t=[];return e.communicationScore<70&&t.push("Focus on defensive communication drills"),e.assistToTurnoverRatio<1.5&&t.push("Practice ball movement and decision-making"),e.benchChemistry<e.starterChemistry&&t.push("Organize team bonding activities for all players"),t}handleRecruiterCommunication(e){const t={id:Date.now(),recruiter:e.recruiter,college:e.college,message:e.content,timestamp:new Date().toISOString(),status:"unread"};this.addRecruiterMessage(t),this.showRecruiterNotification(t)}addRecruiterMessage(e){const t=this.getRecruiterMessages();t.unshift(e),localStorage.setItem("recruiterMessages",JSON.stringify(t))}getRecruiterMessages(){const e=localStorage.getItem("recruiterMessages");return e?JSON.parse(e):[]}showRecruiterNotification(e){console.log("New recruiter message:",e)}updateSocialFeed(e){const t=this.getSocialFeed();t.unshift({...e,id:Date.now(),timestamp:e.timestamp||new Date().toISOString()}),t.length>100&&t.splice(100),localStorage.setItem("socialFeed",JSON.stringify(t)),this.eventBus.emit("social-feed-updated",t)}getSocialFeed(){const e=localStorage.getItem("socialFeed");return e?JSON.parse(e):[]}saveGameData(e){const t=this.getAllGameData();t.unshift(e),t.length>50&&t.splice(50),localStorage.setItem("gameHistory",JSON.stringify(t))}getAllGameData(){const e=localStorage.getItem("gameHistory");return e?JSON.parse(e):[]}broadcastEvent(e,t){this.eventBus.emit(e,t)}addEventListener(e,t){this.eventBus.on(e,t)}updateSharedMetrics(e){this.sharedData.performanceMetrics={...this.sharedData.performanceMetrics,...e,lastUpdated:new Date().toISOString()}}getSharedData(){return this.sharedData}generateCoachingInsight(e){const t={strengths:[],weaknesses:[],recommendations:[]};return e.fgPercentage>50?t.strengths.push("Excellent shooting efficiency"):e.fgPercentage<40&&(t.weaknesses.push("Shooting consistency needs improvement"),t.recommendations.push("Focus on form shooting drills and shot selection")),e.assistToTurnoverRatio>2?t.strengths.push("Great ball security and playmaking"):e.assistToTurnoverRatio<1&&(t.weaknesses.push("High turnover rate affecting team flow"),t.recommendations.push("Practice decision-making under pressure")),t}predictPerformance(e){this.getAllGameData();const t=this.sharedData.performanceMetrics,s={expectedPoints:t.averagePoints||0,expectedAssists:t.averageAssists||0,expectedRebounds:t.averageRebounds||0,confidence:.75};return e.defensiveRating>110&&(s.expectedPoints*=.9,s.confidence*=.9),s}}let o;document.addEventListener("DOMContentLoaded",()=>{o=new a,window.BasketballPlatform=o,window.PlatformManager=a});typeof module<"u"&&module.exports&&(module.exports=a);export{a as PlatformManager};
//# sourceMappingURL=platformManager-CMGNxMqx-BgtAjZPx-BgtAjZPx.js.map
