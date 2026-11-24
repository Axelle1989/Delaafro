import React from 'react';
import { MobileTopBar } from '../components/MobileTopBar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { MobileAddedToCartSheet } from '../components/MobileAddedToCartSheet';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-creme text-brun-nuit overflow-x-hidden selection:bg-terracotta selection:text-white">
      {/* Mobile Top App Bar */}
      <MobileTopBar />

      {/* Main Screen Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Fixed Bottom Navigation (4 tabs) */}
      <MobileBottomNav />

      {/* Floating Chatbot Dela */}
      <ChatWidget />

      {/* Native-like "Added to cart" bottom sheet */}
      <MobileAddedToCartSheet />
    </div>
  );
};

export default MobileLayout;
