export function renderMarkdown(text) {
  const processed = String(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  const lines = processed.split('\n');
  let html = '';
  let inList = false;
  let listType = null;
  let inTable = false;

  const closeList = () => {
    if (inList) {
      html += `</${listType}>`;
      inList = false;
      listType = null;
    }
  };
  const closeTable = () => {
    if (inTable) {
      html += '</tbody></table></div>';
      inTable = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      closeList();
      if (!inTable) {
        html += '<div class="table-wrapper"><table><tbody>';
        inTable = true;
      }
      if (/^\|[-:\s|]+\|$/.test(trimmed)) continue;

      const cells = trimmed
        .split('|')
        .filter((_, i, arr) => i > 0 && i < arr.length - 1);

      html += '<tr>';
      cells.forEach((cell) => {
        html += `<td>${cell.trim()}</td>`;
      });
      html += '</tr>';
      continue;
    }
    closeTable();

    if (line.startsWith('### ')) { closeList(); html += `<h3>${line.slice(4)}</h3>`; continue; }
    if (line.startsWith('## '))  { closeList(); html += `<h2>${line.slice(3)}</h2>`; continue; }
    if (line.startsWith('# '))   { closeList(); html += `<h1>${line.slice(2)}</h1>`; continue; }

    if (line.startsWith('> ')) {
      closeList();
      html += `<blockquote>${line.slice(2)}</blockquote>`;
      continue;
    }

    if (/^[-*] /.test(line)) {
      if (!inList || listType !== 'ul') {
        closeList();
        html += '<ul>';
        inList = true;
        listType = 'ul';
      }
      html += `<li>${line.slice(2)}</li>`;
      continue;
    }
    if (/^\d+\. /.test(line)) {
      if (!inList || listType !== 'ol') {
        closeList();
        html += '<ol>';
        inList = true;
        listType = 'ol';
      }
      html += `<li>${line.replace(/^\d+\. /, '')}</li>`;
      continue;
    }

    if (trimmed === '') { closeList(); continue; }

    closeList();
    html += `<p>${line}</p>`;
  }

  closeList();
  closeTable();
  return { __html: html };
}