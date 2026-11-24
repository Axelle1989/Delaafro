import { useState, useEffect, useRef, useCallback } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Product } from '@/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  productSlugs?: string[];
}

const STORAGE_KEY = 'delaafro_chat_messages_v1';
const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Bonjour, je suis Dela, la conseillère DELAAFRO. Comment puis-je vous aider ? 🌿',
  timestamp: Date.now(),
};

export function useChat() {
  const { products } = useSettingsStore();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return [INITIAL_MESSAGE];
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [INITIAL_MESSAGE];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFailedMessageRef = useRef<string | null>(null);

  // Sauvegarder dans sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Détecter les slugs produits dans un texte
  const extractProductSlugs = useCallback((text: string): string[] => {
    const slugs = new Set<string>();

    // 1. Détection via balises explicites [PRODUIT: slug]
    const tagMatches = text.matchAll(/\[PRODUIT:\s*([a-zA-Z0-9-_]+)\]/gi);
    for (const match of tagMatches) {
      if (match[1]) slugs.add(match[1].toLowerCase().trim());
    }

    // 2. Détection par slug ou nom de produit existant
    if (products && products.length > 0) {
      for (const prod of products) {
        const prodNameRegex = new RegExp(`\\b${prod.name}\\b`, 'i');
        const prodSlugRegex = new RegExp(`\\b${prod.slug}\\b`, 'i');
        if (prodNameRegex.test(text) || prodSlugRegex.test(text)) {
          slugs.add(prod.slug);
        }
      }
    }

    // Liste limitée à 2 cartes max pour ne pas surcharger le chat
    return Array.from(slugs).slice(0, 2);
  }, [products]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      if (trimmed.length > 500) {
        setError('Votre message ne doit pas dépasser 500 caractères.');
        return;
      }

      setError(null);
      lastFailedMessageRef.current = trimmed;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };

      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setIsLoading(true);

      const assistantMsgId = `assistant-${Date.now()}`;
      let accumulatedText = '';

      // Préparer un message assistant temporaire
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        },
      ]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({
            messages: newHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            stream: true,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Erreur serveur (${response.status})`);
        }

        const contentType = response.headers.get('content-type') || '';

        // Si streaming SSE supporté
        if (contentType.includes('text/event-stream') && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine.startsWith('data: ')) continue;
              const jsonStr = trimmedLine.replace(/^data: /, '').trim();
              if (!jsonStr || jsonStr === '[DONE]') continue;

              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                if (parsed.chunk) {
                  accumulatedText += parsed.chunk;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? {
                            ...msg,
                            content: accumulatedText,
                            productSlugs: extractProductSlugs(accumulatedText),
                          }
                        : msg
                    )
                  );
                }
              } catch {
                // partial json chunk
              }
            }
          }
        } else {
          // Fallback JSON standard
          const data = await response.json();
          accumulatedText = data.reply || '';
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: accumulatedText,
                    productSlugs: extractProductSlugs(accumulatedText),
                  }
                : msg
            )
          );
        }

        // Si aucun texte n'a été produit malgré la réussite de la requête, afficher un texte de secours
        if (!accumulatedText.trim()) {
          const fallbackNotice =
            "Dela rencontre un souci, réessayez ou écrivez-nous sur WhatsApp : https://wa.me/22945483473";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: fallbackNotice,
                  }
                : msg
            )
          );
        }

        lastFailedMessageRef.current = null;
      } catch (err: any) {
        console.error('Chat error:', err);
        const errMsg =
          err?.message ||
          "Dela rencontre un souci, réessayez ou écrivez-nous sur WhatsApp";
        setError(errMsg);

        // Ne JAMAIS laisser une bulle vide : renseigner un message d'assistance clair
        if (!accumulatedText.trim()) {
          const fallbackNotice =
            "Dela rencontre un souci, réessayez ou écrivez-nous sur WhatsApp : https://wa.me/22945483473";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: fallbackNotice,
                  }
                : msg
            )
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, extractProductSlugs]
  );

  const retryLastMessage = useCallback(() => {
    if (lastFailedMessageRef.current) {
      sendMessage(lastFailedMessageRef.current);
    }
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    lastFailedMessageRef.current = null;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    retryLastMessage,
    clearMessages,
  };
}
