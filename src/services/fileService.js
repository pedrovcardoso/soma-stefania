/**
 * Utilitário para gerenciar URLs de arquivos, 
 * especialmente para contornar restrições de CORS.
 */

export const getProxiedUrl = (url) => {
    if (!url) return url;
    
    // Se já for uma URL do proxy, não fazemos nada
    if (url.startsWith('/api/file-proxy')) {
        return url;
    }
    
    // Se a URL for do SEI, usamos o nosso proxy local para evitar erro de CORS
    if (url.includes('sei.mg.gov.br')) {
        return `/api/file-proxy?url=${encodeURIComponent(url)}`;
    }
    
    return url;
};
