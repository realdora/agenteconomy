import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const gaPlaceholder = '<!-- GA4_SNIPPET -->'

function ga4Snippet(measurementId) {
  const id = JSON.stringify(measurementId)
  return `    <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', ${id}, { send_page_view: false });

      (function(){
        var engines = [
          ['chat.openai.com', 'chat.openai.com'],
          ['chatgpt.com', 'chatgpt.com'],
          ['perplexity.ai', 'perplexity.ai'],
          ['claude.ai', 'claude.ai'],
          ['gemini.google.com', 'gemini.google.com'],
          ['copilot.microsoft.com', 'copilot.microsoft.com']
        ];
        function aiEngineSource() {
          if (!document.referrer) return '';
          try {
            var ref = new URL(document.referrer);
            var host = ref.hostname.replace(/^www\\./, '');
            for (var i = 0; i < engines.length; i += 1) {
              if (host === engines[i][0]) return engines[i][1];
            }
            if (host === 'bing.com' && ref.pathname.indexOf('/chat') === 0) return 'bing.com/chat';
          } catch (e) {}
          return '';
        }

        gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: window.location.pathname,
          ai_engine_source: aiEngineSource()
        });

        document.addEventListener('click', function(event) {
          var target = event.target && event.target.closest ? event.target.closest('a[href]') : null;
          if (!target) return;
          var rawHref = target.getAttribute('href') || '';
          var url;
          try {
            url = new URL(rawHref, window.location.href);
          } catch (e) {
            return;
          }

          if (url.pathname === '/data.json' || url.pathname === '/tempo-data.json') {
            gtag('event', 'data_download', {
              file_name: url.pathname.slice(1),
              link_url: url.href
            });
          }

          if (rawHref.indexOf('http') === 0 && url.host !== window.location.host) {
            gtag('event', 'outbound_click', {
              link_url: url.href,
              link_domain: url.hostname
            });
          }
        }, true);
      })();
    </script>`
}

function ga4HtmlPlugin(mode) {
  const env = loadEnv(mode, process.cwd(), '')
  const measurementId = (env.VITE_GA_MEASUREMENT_ID || '').trim()

  return {
    name: 'agent-economy-ga4-html',
    transformIndexHtml(html) {
      return html.replace(gaPlaceholder, measurementId ? ga4Snippet(measurementId) : '')
    },
  }
}

export default defineConfig(({ isSsrBuild, mode }) => ({
  plugins: [react(), ga4HtmlPlugin(mode)],
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: isSsrBuild ? {} : {
      output: {
        manualChunks: {
          charts: ['recharts'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
}))
