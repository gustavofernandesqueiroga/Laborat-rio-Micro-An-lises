
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: string;
  schema?: object;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  image = "https://www.laboratoriomicroanalises.com.br/og-image.jpg",
  type = "website",
  schema
}) => {
  const location = useLocation();
  const baseUrl = "https://www.laboratoriomicroanalises.com.br";
  const fullTitle = `${title} | Coleta Já - Grupo Queiroga`;
  const currentUrl = `${baseUrl}/#${location.pathname}`;

  useEffect(() => {
    // Título
    document.title = fullTitle;

    // Meta Tags Padrão
    const updateMeta = (name: string, content: string, attr: string = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    if (keywords) updateMeta('keywords', keywords);

    // Open Graph
    updateMeta('og:title', fullTitle, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:url', currentUrl, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:type', type, 'property');

    // Twitter
    updateMeta('twitter:title', fullTitle, 'name');
    updateMeta('twitter:description', description, 'name');
    updateMeta('twitter:url', currentUrl, 'name');
    updateMeta('twitter:image', image, 'name');

    // Link Canônico
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // JSON-LD Schema
    let script = document.querySelector('script[type="application/ld+json"]');
    if (schema) {
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    } else if (script) {
      script.remove();
    }
  }, [fullTitle, description, keywords, image, type, currentUrl, schema]);

  return null;
};

export default SEO;
