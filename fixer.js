const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');
code = code.replace(/<div className="wdiv className=" ml-12="" border-l="" border-white="" 10="" pl-12=""\r?\n\s*relative="" overflow-hidden"="">/, '<div className="ml-12 border-l border-white/10 pl-12 relative overflow-hidden">');
fs.writeFileSync('app/page.tsx', code);
