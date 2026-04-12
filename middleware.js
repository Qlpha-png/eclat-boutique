import { next } from '@vercel/edge';

export default async function middleware(request) {
    const response = await next();

    // Traiter uniquement les réponses HTML
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
        return response;
    }

    // Générer un nonce unique pour cette requête
    const nonce = crypto.randomUUID().replace(/-/g, '');

    // Lire le body HTML
    let html = await response.text();

    // Injecter le nonce sur tous les <script> inline (sans src)
    // et tous les <style> inline
    html = html.replace(/<script(?![^>]*\bsrc\s*=)([^>]*)>/gi, (match, attrs) => {
        // Ne pas dupliquer un nonce déjà présent
        if (/\bnonce\s*=/i.test(attrs)) return match;
        return `<script${attrs} nonce="${nonce}">`;
    });

    html = html.replace(/<style([^>]*)>/gi, (match, attrs) => {
        if (/\bnonce\s*=/i.test(attrs)) return match;
        return `<style${attrs} nonce="${nonce}">`;
    });

    // Mettre à jour le CSP : remplacer 'unsafe-inline' par 'nonce-{NONCE}'
    // dans script-src et style-src
    const newHeaders = new Headers(response.headers);
    const csp = newHeaders.get('content-security-policy');
    if (csp) {
        const updatedCsp = csp
            .replace(/(script-src\s[^;]*)'unsafe-inline'/g, `$1'nonce-${nonce}'`)
            .replace(/(style-src\s[^;]*)'unsafe-inline'/g, `$1'nonce-${nonce}'`);
        newHeaders.set('content-security-policy', updatedCsp);
    }

    return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
}

export const config = {
    matcher: ['/((?!api|_next|favicon|robots|sitemap).*)'],
};
