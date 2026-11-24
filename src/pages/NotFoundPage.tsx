import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-creme py-20 px-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-terracotta/10 text-terracotta border border-terracotta/20">
          <Sparkles className="w-10 h-10 text-or animate-pulse-subtle" />
        </div>

        <h1 className="font-serif text-6xl sm:text-7xl font-extrabold text-terracotta">
          404
        </h1>

        <h2 className="section-title text-2xl sm:text-3xl font-bold text-brun-nuit">
          Page Introuvable
        </h2>

        <div className="gold-underline-center" />

        <p className="prose-body text-base sm:text-lg text-brun-nuit/75 leading-relaxed">
          Le rituel capillaire que vous recherchez semble s'être évanoui comme une brume bienfaisante. Retrouvez l'ensemble de nos gammes depuis l'accueil.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            variant="terracotta"
            as="a"
            href="/"
            leftIcon={<Home className="w-4 h-4" />}
          >
            Retourner à l'accueil
          </Button>
          <Button
            variant="outline"
            as="a"
            href="/boutique"
          >
            Visiter la boutique
          </Button>
        </div>
      </div>
    </div>
  );
};

