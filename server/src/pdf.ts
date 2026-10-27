/** Minimal dependency-free text PDF writer for demo exports. Uses built-in Helvetica; non-ASCII glyphs are replaced. */
export function textPdf(title:string, lines:string[]):Buffer {
  const escape=(s:string)=>s.replace(/[^\x20-\x7E]/g,'?').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
  const content=['BT','/F1 18 Tf','50 790 Td',`(${escape(title)}) Tj`,'/F1 10 Tf'];
  for(const line of lines){content.push('0 -18 Td',`(${escape(line).slice(0,140)}) Tj`)}
  content.push('ET');
  const stream=content.join('\n');
  const objects=[
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(stream,'ascii')} >>\nstream\n${stream}\nendstream`
  ];
  let pdf='%PDF-1.4\n';const offsets=[0];
  objects.forEach((obj,i)=>{offsets.push(Buffer.byteLength(pdf,'ascii'));pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`});
  const xref=Buffer.byteLength(pdf,'ascii');pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(let i=1;i<offsets.length;i++)pdf+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;
  pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf,'ascii');
}
