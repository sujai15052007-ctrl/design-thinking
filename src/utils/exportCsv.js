export function exportCsv(filename, rows) {
  if (!rows.length) return;
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const escape = (value) => {
    const cell = value == null ? '' : Array.isArray(value) ? value.join('; ') : String(value);
    return `"${cell.replaceAll('"', '""')}"`;
  };
  const csv = [headers.map(escape).join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
