import React from 'react';
import { Link } from 'react-router-dom';
import { ChatMessage } from '@/hooks/useChat';
import { ProductCardInChat } from './ProductCardInChat';

interface MessageBubbleProps {
  message: ChatMessage;
  onLinkClick?: () => void;
}

// Convertisseur léger de Markdown (gras, listes, liens cliquables)
function renderFormattedContent(text: string, onLinkClick?: () => void) {
  // 1. Retirer les balises techniques [PRODUIT: ...] du texte affiché
  const cleanText = text.replace(/\[PRODUIT:\s*[a-zA-Z0-9-_]+\]/gi, '').trim();

  // Découper en paragraphes ou lignes
  const lines = cleanText.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed break-words text-xs sm:text-sm font-sans">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Listes à puces
        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
        const isNumbered = /^\d+\.\s/.test(line.trim());
        const content = isBullet
          ? line.trim().replace(/^[-•]\s*/, '')
          : isNumbered
          ? line.trim().replace(/^\d+\.\s*/, '')
          : line;

        // Parser inline : **gras**, [texte](url), et URLs brutes (https://...)
        const elements = parseInlineMarkdown(content, onLinkClick);

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1">
              <span className="text-[#8B4A2B] shrink-0 font-bold select-none">•</span>
              <span className="flex-1">{elements}</span>
            </div>
          );
        }

        if (isNumbered) {
          const numberMatch = line.trim().match(/^(\d+)\.\s*/);
          const num = numberMatch ? numberMatch[1] : '1';
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1">
              <span className="text-[#8B4A2B] font-semibold text-xs shrink-0 select-none">
                {num}.
              </span>
              <span className="flex-1">{elements}</span>
            </div>
          );
        }

        return <p key={lineIdx}>{elements}</p>;
      })}
    </div>
  );
}

// Analyseur de texte en ligne pour gras et liens
function parseInlineMarkdown(text: string, onLinkClick?: () => void): React.ReactNode[] {
  // Regex combinant [label](url), **gras**, et URLs https://...
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s)]+))/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      // [label](url)
      const label = match[2];
      const url = match[3];
      const isInternal = url.startsWith('/');

      if (isInternal) {
        nodes.push(
          <Link
            key={match.index}
            to={url}
            onClick={onLinkClick}
            className="text-[#8B4A2B] underline font-semibold hover:text-[#723C22] transition-colors"
          >
            {label}
          </Link>
        );
      } else {
        nodes.push(
          <a
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B4A2B] underline font-semibold hover:text-[#723C22] transition-colors"
          >
            {label}
          </a>
        );
      }
    } else if (match[4]) {
      // **gras**
      nodes.push(
        <strong key={match.index} className="font-semibold text-[#2B1A12]">
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      // URL brute https://...
      const rawUrl = match[5];
      const isWa = rawUrl.includes('wa.me');
      nodes.push(
        <a
          key={match.index}
          href={rawUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#8B4A2B] underline font-semibold hover:text-[#723C22] transition-colors break-all"
        >
          {isWa ? 'Ouvrir WhatsApp →' : rawUrl}
        </a>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onLinkClick,
}) => {
  const isUser = message.role === 'user';

  // Ne jamais afficher une bulle vide pour l'assistant
  if (!isUser && (!message.content || !message.content.trim())) {
    return null;
  }

  return (
    <div
      className={`flex flex-col ${
        isUser ? 'items-end' : 'items-start'
      } w-full space-y-1`}
    >
      {/* Bulle principale */}
      <div
        className={`relative px-3.5 py-2.5 rounded-2xl ${
          isUser
            ? 'bg-[#8B4A2B] text-[#FAF3EA] rounded-tr-xs max-w-[85%] shadow-xs'
            : 'bg-white text-[#2B1A12] border border-[#2B1A12]/10 rounded-tl-xs max-w-[88%] shadow-xs'
        }`}
      >
        {isUser ? (
          <p className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        ) : (
          renderFormattedContent(message.content, onLinkClick)
        )}
      </div>

      {/* Cartes produits recommandés dans la réponse */}
      {!isUser && message.productSlugs && message.productSlugs.length > 0 && (
        <div className="w-full max-w-[88%] space-y-2">
          {message.productSlugs.map((slug) => (
            <ProductCardInChat
              key={slug}
              slug={slug}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
