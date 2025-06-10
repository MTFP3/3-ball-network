const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

const appId = '9c508bbf'; // Your App ID
const apiKey = '3b9071a22c350a8fc0bc8aef3ffb6226'; // Your API Key

// Fetch all cities in a state
exports.getCities = functions.https.onRequest(async (req, res) => {
  const { state } = req.query;
  if (!state) {
    return res.status(400).json({ error: 'Missing state parameter' });
  }

  const url = `https://api.schooldigger.com/v1.2/cities?st=${state}&appID=${appId}&appKey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Fetch all middle and high schools in a state, handling pagination
exports.getSchools = functions.https.onRequest(async (req, res) => {
  const { state } = req.query;
  if (!state) {
    return res.status(400).json({ error: 'Missing state parameter' });
  }

  const baseUrl = `https://api.schooldigger.com/v1.2/schools?st=${state}&level=middle,high&appID=${appId}&appKey=${apiKey}`;
  let page = 1;
  let allSchools = [];
  let total = 0;
  let perPage = 50; // SchoolDigger default is 50 per page

  try {
    while (true) {
      const url = `${baseUrl}&page=${page}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.schoolList && Array.isArray(data.schoolList)) {
        allSchools = allSchools.concat(data.schoolList);
      }

      // On first page, get total count
      if (page === 1 && data.total) {
        total = data.total;
      }

      // If we've fetched all schools, break
      if (!data.schoolList || data.schoolList.length < perPage || allSchools.length >= total) {
        break;
      }

      page++;
    }

    res.json({ total: allSchools.length, schools: allSchools });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});