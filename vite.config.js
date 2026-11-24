var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import chatHandler from './api/chat.js';
function apiDevPlugin() {
    return {
        name: 'api-dev-middleware',
        configureServer: function (server) {
            var _this = this;
            server.middlewares.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                var url, body_1, content;
                var _this = this;
                return __generator(this, function (_a) {
                    url = req.url ? req.url.split('?')[0] : '';
                    if (url === '/api/chat') {
                        body_1 = '';
                        req.on('data', function (chunk) {
                            body_1 += chunk;
                        });
                        req.on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                            var err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        try {
                                            req.body = body_1 ? JSON.parse(body_1) : {};
                                        }
                                        catch (_b) {
                                            req.body = {};
                                        }
                                        res.json = function (data) {
                                            res.setHeader('Content-Type', 'application/json');
                                            res.end(JSON.stringify(data));
                                        };
                                        res.status = function (code) {
                                            res.statusCode = code;
                                            return res;
                                        };
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, chatHandler(req, res)];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        err_1 = _a.sent();
                                        console.error('Chat dev middleware error:', err_1);
                                        res.statusCode = 500;
                                        res.end(JSON.stringify({ error: 'Erreur interne chat dev' }));
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    else if (url === '/api/knowledge.json') {
                        try {
                            content = fs.readFileSync(path.resolve(process.cwd(), 'api/knowledge.json'), 'utf-8');
                            res.setHeader('Content-Type', 'application/json');
                            res.end(content);
                        }
                        catch (_b) {
                            res.statusCode = 404;
                            res.end(JSON.stringify({ error: 'knowledge.json non trouvé' }));
                        }
                    }
                    else {
                        next();
                    }
                    return [2 /*return*/];
                });
            }); });
        },
    };
}
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var mode = _a.mode;
    // Load env file based on `mode` in the current working directory.
    var env = loadEnv(mode, process.cwd(), '');
    // Populate process.env so backend functions in /api have access to LLM_API_KEY
    Object.assign(process.env, env);
    var hasApiKey = Boolean(process.env.LLM_API_KEY && process.env.LLM_API_KEY.trim() !== '' && process.env.LLM_API_KEY !== 'YOUR_API_KEY_HERE');
    console.log("[Dela Chatbot] Initialisation backend - Cl\u00E9 pr\u00E9sente : ".concat(hasApiKey ? 'oui' : 'non'));
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
