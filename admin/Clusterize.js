// In pages.js
import Clusterize from 'clusterize.js';
export function renderPagesTable(pages) {
  const rows = pages.map(page => `<tr>...</tr>`);
  new Clusterize({ rows, scrollId: 'pages-scroll', contentId: 'pages-content' });
}