import"./modulepreload-polyfill-B5Qt9EMX.js";import"./modulepreload-polyfill-B5Qt9EMX-ulV_1b7r-C2dq2EgV.js";import"./firebaseConfig-DCH0t8Yd-CLd0mPF9-BmnogoZy.js";/* empty css                                */class l{constructor(){this.searchIndex=new Map,this.filters={},this.init()}init(){this.setupSearchUI(),this.buildSearchIndex(),this.setupFilters()}setupSearchUI(){const e=document.getElementById("searchContainer");e&&(e.innerHTML=`
      <div class="advanced-search">
        <div class="search-bar">
          <input type="text" id="searchInput" placeholder="Search players, teams, coaches..." class="search-input">
          <button onclick="searchEngine.performSearch()" class="search-btn">
            <i class="icon-search"></i>
          </button>
        </div>
        
        <div class="search-filters">
          <div class="filter-group">
            <label>Role:</label>
            <select id="roleFilter">
              <option value="">All</option>
              <option value="player">Players</option>
              <option value="coach">Coaches</option>
              <option value="scout">Scouts</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Location:</label>
            <input type="text" id="locationFilter" placeholder="City, State">
          </div>
          
          <div class="filter-group">
            <label>Position:</label>
            <select id="positionFilter">
              <option value="">All Positions</option>
              <option value="PG">Point Guard</option>
              <option value="SG">Shooting Guard</option>
              <option value="SF">Small Forward</option>
              <option value="PF">Power Forward</option>
              <option value="C">Center</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Skill Level:</label>
            <select id="skillFilter">
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="elite">Elite</option>
            </select>
          </div>
        </div>
        
        <div class="search-results" id="searchResults"></div>
      </div>
    `,document.getElementById("searchInput").addEventListener("input",this.debounce(this.performSearch.bind(this),300)),document.getElementById("roleFilter").addEventListener("change",this.performSearch.bind(this)),document.getElementById("locationFilter").addEventListener("input",this.debounce(this.performSearch.bind(this),300)),document.getElementById("positionFilter").addEventListener("change",this.performSearch.bind(this)),document.getElementById("skillFilter").addEventListener("change",this.performSearch.bind(this)))}async buildSearchIndex(){try{const e=["players","coaches","scouts","teams"];for(const t of e)(await this.db.collection(t).get()).forEach(i=>{const o={id:i.id,...i.data(),collection:t};this.indexDocument(o)});console.log("Search index built successfully")}catch(e){console.error("Error building search index:",e)}}indexDocument(e){const t=["name","position","school","city","state","skills"],i=[];t.forEach(o=>{e[o]&&i.push(...this.tokenize(e[o].toString()))}),i.forEach(o=>{this.searchIndex.has(o)||this.searchIndex.set(o,new Set),this.searchIndex.get(o).add(e.id)})}tokenize(e){return e.toLowerCase().replace(/[^\w\s]/g,"").split(/\s+/).filter(t=>t.length>2)}async performSearch(){const e=document.getElementById("searchInput").value.trim(),t=document.getElementById("roleFilter").value,i=document.getElementById("locationFilter").value.trim(),o=document.getElementById("positionFilter").value,s=document.getElementById("skillFilter").value;let n=[];e?n=this.textSearch(e):n=await this.getAllDocuments(),n=this.applyFilters(n,{role:t,location:i,position:o,skill:s}),this.displayResults(n)}textSearch(e){const t=this.tokenize(e),i=new Set;return t.forEach(o=>{this.searchIndex.has(o)&&this.searchIndex.get(o).forEach(s=>{i.add(s)})}),Array.from(i)}async getAllDocuments(){const e=[],t=["players","coaches","scouts"];for(const i of t)(await this.db.collection(i).limit(20).get()).forEach(o=>{e.push({id:o.id,...o.data(),collection:i})});return e}applyFilters(e,t){return e.filter(i=>!(t.role&&i.collection!==t.role+"s"||t.location&&!this.matchesLocation(i,t.location)||t.position&&i.position!==t.position||t.skill&&i.skillLevel!==t.skill))}matchesLocation(e,t){return`${e.city||""} ${e.state||""}`.toLowerCase().includes(t.toLowerCase())}displayResults(e){const t=document.getElementById("searchResults");if(e.length===0){t.innerHTML='<p class="no-results">No results found. Try adjusting your search criteria.</p>';return}t.innerHTML=`
      <div class="results-header">
        <h3>Search Results (${e.length})</h3>
        <div class="sort-options">
          <select onchange="searchEngine.sortResults(this.value)">
            <option value="relevance">Sort by Relevance</option>
            <option value="name">Sort by Name</option>
            <option value="location">Sort by Location</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>
      <div class="results-list">
        ${e.map(this.renderResultCard).join("")}
      </div>
    `}renderResultCard(e){const t={players:"🏀",coaches:"👔",scouts:"🔍",teams:"🏆"};return`
      <div class="result-card" onclick="searchEngine.viewProfile('${e.id}', '${e.collection}')">
        <div class="result-avatar">
          ${t[e.collection]||"👤"}
        </div>
        <div class="result-info">
          <h4>${e.name||"Unnamed"}</h4>
          <p class="result-details">
            ${e.position?`${e.position} • `:""}
            ${e.school||e.team||""}
            ${e.city&&e.state?` • ${e.city}, ${e.state}`:""}
          </p>
          <div class="result-stats">
            ${e.rating?`Rating: ${e.rating}`:""}
            ${e.wins&&e.losses?`Record: ${e.wins}-${e.losses}`:""}
          </div>
        </div>
        <div class="result-actions">
          <button class="btn-primary">View Profile</button>
        </div>
      </div>
    `}sortResults(e){console.log("Sorting results by:",e)}viewProfile(e,t){window.location.href=`/profile/${t}/${e}`}debounce(e,t){let i;return function(...o){const s=()=>{clearTimeout(i),e(...o)};clearTimeout(i),i=setTimeout(s,t)}}}const a=new l;window.searchEngine=a;
//# sourceMappingURL=search-D2qrMaX6.js.map
