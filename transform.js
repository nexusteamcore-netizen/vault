const fs = require('fs');

try {
    const html = fs.readFileSync('landingpage templete.html', 'utf8');

    const styleMatches = html.matchAll(/<style>([\s\S]*?)<\/style>/g);
    let allStyles = '';
    for (const match of styleMatches) {
        allStyles += match[1] + '\n';
    }
    fs.writeFileSync('app/landing.css', allStyles);

    const scriptRegex = /<script.*?>([\s\S]*?)<\/script>/g;
    let jsContent = '';
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
        let code = match[1];
        if (!code || code.trim() === '') continue;
        if (code.includes('promotekit_referral')) continue;
        if (code.includes('dataLayer')) continue; 
        if (code.includes('UnicornStudio')) { 
            jsContent += code + '\n\n';
            continue;
        }
        jsContent += code + '\n\n';
    }
    jsContent = "window.addEventListener('DOMContentLoaded', (event) => {\n" + jsContent + "\n});\n";
    fs.writeFileSync('public/landing-scripts.js', jsContent);

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    let bodyHtml = bodyMatch ? bodyMatch[1] : '';

    bodyHtml = bodyHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    let jsx = bodyHtml;
    jsx = jsx.replace(/class="/g, 'className="');
    jsx = jsx.replace(/for="/g, 'htmlFor="');
    
    jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

    const svgProps = ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'clip-path'];
    svgProps.forEach(prop => {
        const camel = prop.split('-').map((p, i) => i === 0 ? p : p[0].toUpperCase() + p.slice(1)).join('');
        const regex = new RegExp(prop + '="([^"]*)"', 'g');
        jsx = jsx.replace(regex, camel + '="$1"');
    });

    jsx = jsx.replace(/onclick="window\.location\.href='([^']+)'"/g, (full_match, url) => {
        return "onClick={() => router.push('" + url + "')}";
    });
    jsx = jsx.replace(/onclick="event\.preventDefault\(\);?"/g, "onClick={(e) => e.preventDefault()}");
    jsx = jsx.replace(/onsubmit="event\.preventDefault\(\);?"/g, "onSubmit={(e) => e.preventDefault()}");

    jsx = jsx.replace(/style="([^"]*)"/g, (f, inlineStyles) => {
        let styles = inlineStyles.split(';').filter(s => s.trim().length > 0);
        let styleObj = {};
        styles.forEach(s => {
            let [key, ...vals] = s.split(':');
            let val = vals.join(':').trim();
            key = key.trim();
            if (key && val) {
                let camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
                styleObj[camelKey] = val;
            }
        });
        return 'style={' + JSON.stringify(styleObj) + '}';
    });

    jsx = jsx.replace(/<br>/g, '<br />');
    jsx = jsx.replace(/<hr([^>]*)>/g, (m, p1) => {
        if (p1.endsWith('/')) return m;
        return "<hr" + p1 + " />";
    });
    jsx = jsx.replace(/<img([^>]*)>/g, (m, p1) => {
        if (p1.endsWith('/')) return m;
        return "<img" + p1 + " />";
    });
    jsx = jsx.replace(/<input([^>]*)>/g, (m, p1) => {
        if (p1.endsWith('/')) return m;
        return "<input" + p1 + " />";
    });

    const pageContent = [
        '"use client";',
        '',
        "import Script from 'next/script';",
        "import { useRouter } from 'next/navigation';",
        "import './landing.css';",
        '',
        "export default function LandingPage() {",
        "  const router = useRouter();",
        '',
        "  return (",
        '    <div className="landing-page-wrapper bg-[#09090b] text-white font-[\'Outfit\',_sans-serif] min-h-screen relative overflow-x-hidden">',
        '      {/* Three.js Script */}',
        '      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />',
        '      {/* Unicorn Studio Script if needed */}',
        '      <Script src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js" strategy="lazyOnload" onLoad={() => window.UnicornStudio && window.UnicornStudio.init()} />',
        '      {/* Custom DOM Interactions */}',
        '      <Script src="/landing-scripts.js" strategy="lazyOnload" />',
        '',
        jsx,
        '    </div>',
        '  );',
        '}'
    ].join('\n');

    fs.writeFileSync('app/page.tsx', pageContent);
    console.log('Successfully written app/page.tsx, app/landing.css, public/landing-scripts.js');
} catch (e) {
    console.error(e);
}
