const functions = require('firebase-functions');
const fetch = require('node-fetch');

// Replace with your actual SchoolDigger App ID and API Key
const appId = '9c508bbf';
const apiKey = '3b9071a22c350a8fc0bc8aef3ffb6226';

// Get all cities in a state
exports.getCities = functions.https.onRequest(async (req, res) => {
  const { state } = req.query;
  if (!state) {
    return res.status(400).json({ error: 'Missing state parameter' });
  }
  const url = `https://api.schooldigger.com/v1.2/cities?st=${state}&appID=${appId}&appKey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    // SchoolDigger returns { "cities": [...] }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Get all middle and high schools in a city (with pagination)
exports.getSchools = functions.https.onRequest(async (req, res) => {
  const { state, city } = req.query;
  if (!state || !city) {
    return res.status(400).json({ error: 'Missing state or city parameter' });
  }

  const baseUrl = `https://api.schooldigger.com/v1.2/schools?st=${state}&city=${encodeURIComponent(city)}&level=middle,high&appID=${appId}&appKey=${apiKey}`;
  let page = 1;
  let allSchools = [];
  let total = 0;
  let perPage = 50;

  try {
    while (true) {
      const url = `${baseUrl}&page=${page}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.schoolList && Array.isArray(data.schoolList)) {
        allSchools = allSchools.concat(data.schoolList);
      }

      if (page === 1 && data.total) {
        total = data.total;
      }

      if (!data.schoolList || data.schoolList.length < perPage || allSchools.length >= total) {
        break;
      }
      page++;
    }
    res.json({ schools: allSchools });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});