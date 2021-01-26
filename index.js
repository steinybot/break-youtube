const fs = require('fs');
const googleTrends = require('google-trends-api');

const date = new Date();
const geo = 'US';

(async function() {
  const queries = await getDailyTrendingQueries(date, geo);
  console.log('"' + queries.join('", "') + '"');
}());

async function getDailyTrendingQueries(date, geo) {
  return googleTrends.dailyTrends({
     trendDate: date,
     geo: geo,
  }).then(dailyTrendingQueries, handleError);
}

function handleError(err) {
  console.log('Failed to get daily trends.', err);
};

function dailyTrendingQueries(results) {
  const trends = JSON.parse(results);
  return dailyTrends(trends);
};

function dailyTrends(trends) {
  const dailySearches = trends['default'].trendingSearchesDays;
  return dailySearches.flatMap(dailySearchQueries);
};

function dailySearchQueries(dailySearch) {
  const searches = dailySearch.trendingSearches;
  return searches.flatMap(searchQueries);
};

function searchQueries(search) {
  const queries = [searchQuery(search.title)];
  return queries.concat(search.relatedQueries.map(searchQuery));
};

function searchQuery(query) {
  return query.query;
};
