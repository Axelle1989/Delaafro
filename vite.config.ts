import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import chatHandler from './api/chat.js';

function apiDevPlugin() {
  return {
    name: 'api-dev-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url ? req.url.split('?')[0] : '';

        if (url === '/api/chat') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
            } catch {
              req.body = {};
            }

            res.json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            res.status = (code: number) => {
              res.statusCode = code;
              return res;
            };

            try {
              await chatHandler(req, res);
            } catch (err) {
              console.error('Chat dev middleware error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Erreur interne chat dev' }));
            }
          });
        } else if (url === '/api/knowledge.json') {
          try {
            const content = fs.readFileSync(path.resolve(process.cwd(), 'api/knowledge.json'), 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(content);
          } catch {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'knowledge.json non trouvé' }));
          }
        } else {
          next();
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env so backend functions in /api have access to LLM_API_KEY
  Object.assign(process.env, env);

  const hasApiKey = Boolean(process.env.LLM_API_KEY && process.env.LLM_API_KEY.trim() !== '' && process.env.LLM_API_KEY !== 'YOUR_API_KEY_HERE');
  console.log(`[Dela Chatbot] Initialisation backend - Clé présente : ${hasApiKey ? 'oui' : 'non'}`);

  return {
    plugins: [react(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion', 'lenis'],
            icons: ['lucide-react'],
          },
        },
      },
    },
    server: {
      port: 5173,
      host: true,
    },
  };
});
