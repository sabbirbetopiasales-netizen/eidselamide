/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Copy, Check, Send, Gift, Moon, Star, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';

// Constants
const BKASH_NUMBER = "01331707930";

type Step = 'landing' | 'form' | 'payment' | 'instructions' | 'success';

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BKASH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBKashPay = () => {
    setStep('instructions');
    // Attempt to open the app directly as well
    openBKashApp();
  };

  const openBKashApp = () => {
    const androidLink = `intent://pay?receiver=${BKASH_NUMBER}&amount=${amount}#Intent;scheme=bkash;package=com.bka.jms.app;end`;
    const iosLink = `bkash://pay?receiver=${BKASH_NUMBER}&amount=${amount}`;
    
    // Try Android first, then iOS as fallback
    // We use a temporary anchor to avoid some browser blocks
    const link = document.createElement('a');
    link.href = androidLink;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Fallback for iOS/Other after a short delay if the first one fails or does nothing
    setTimeout(() => {
      window.location.href = iosLink;
    }, 500);
  };

  const handleCelebrate = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 0, scalar: 1.2 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 150 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount: 40, origin: { x: 0.5, y: 0.5 } });
    }, 250);
  };

  const handleConfirmPayment = () => {
    setIsSubmitting(true);
    // Simulate a small delay for "processing"
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      handleCelebrate();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#022c22] text-[#fef3c7] font-sans selection:bg-[#fbbf24] selection:text-[#022c22]">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 animate-pulse">
          <Moon size={48} className="text-[#fbbf24]" />
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce">
          <Star size={32} className="text-[#fbbf24]" />
        </div>
        <div className="absolute top-1/4 right-1/4 rotate-12">
          <Star size={24} className="text-[#fbbf24]" />
        </div>
      </div>

      <main className="relative z-10 max-w-md mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                >
                  <Gift size={80} className="text-[#fbbf24] mx-auto" />
                </motion.div>
                <div className="absolute -top-2 -right-2">
                  <Star size={24} className="text-[#fbbf24] fill-[#fbbf24]" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tighter text-[#fbbf24] drop-shadow-lg">
                  Eid Mubarak!
                </h1>
                <p className="text-lg text-[#d1fae5] font-light italic">
                  "Sharing joy, one Selami at a time."
                </p>
              </div>

              <button
                onClick={() => setStep('form')}
                className="w-full py-4 bg-[#fbbf24] text-[#064e3b] font-bold rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                Send Selami <Send size={20} />
              </button>
            </motion.div>
          )}

          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full bg-[#064e3b] p-8 rounded-3xl border border-[#fbbf24]/20 shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-[#fbbf24]">Selami Details</h2>
                <p className="text-sm text-[#d1fae5]/70">Enter your info to continue</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-semibold text-[#fbbf24]/80 ml-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#022c22] border border-[#fbbf24]/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#fbbf24] transition-colors placeholder:text-[#d1fae5]/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-semibold text-[#fbbf24]/80 ml-1">Amount (BDT)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-[#022c22] border border-[#fbbf24]/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#fbbf24] transition-colors placeholder:text-[#d1fae5]/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest font-semibold text-[#fbbf24]/80 ml-1">Message for Me (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a sweet message..."
                    rows={3}
                    className="w-full bg-[#022c22] border border-[#fbbf24]/30 rounded-xl px-4 py-3 focus:outline-none focus:border-[#fbbf24] transition-colors placeholder:text-[#d1fae5]/30 resize-none"
                  />
                </div>
              </div>

              <button
                disabled={!name || !amount}
                onClick={() => setStep('payment')}
                className="w-full py-4 bg-[#fbbf24] text-[#064e3b] font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f59e0b] transition-colors"
              >
                Next Step
              </button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full bg-[#064e3b] p-8 rounded-3xl border border-[#fbbf24]/20 shadow-2xl space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="bg-[#d1005d] w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
                  <Wallet size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#fbbf24]">Pay with bKash</h2>
                <p className="text-sm text-[#d1fae5]/70">Please send money to this number</p>
              </div>

              <div className="bg-[#022c22] p-6 rounded-2xl border border-[#fbbf24]/10 space-y-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] uppercase tracking-tighter text-[#fbbf24]/50">Personal Number</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono font-bold tracking-wider text-[#fbbf24]">
                      {BKASH_NUMBER}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-[#fbbf24]/10 rounded-lg transition-colors"
                    >
                      {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="text-[#fbbf24]" />}
                    </button>
                  </div>
                </div>
                
                <div className="h-px bg-[#fbbf24]/10 w-full" />

                <div className="flex justify-between items-center px-2">
                  <span className="text-sm text-[#d1fae5]/70">Amount to Pay</span>
                  <span className="text-xl font-bold text-[#fbbf24]">৳{amount}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBKashPay}
                  className="w-full py-4 bg-[#d1005d] text-white font-bold rounded-xl hover:bg-[#b0004e] transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  Pay via bKash <Wallet size={20} />
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#fbbf24] text-[#064e3b] font-bold rounded-xl hover:bg-[#f59e0b] transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-[#064e3b] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Confirm Payment <Check size={20} /></>
                  )}
                </button>
                <button
                  onClick={() => setStep('form')}
                  className="w-full py-2 text-sm text-[#d1fae5]/50 hover:text-[#fbbf24] transition-colors"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          )}

          {step === 'instructions' && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full bg-[#064e3b] p-8 rounded-3xl border border-[#fbbf24]/20 shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="bg-[#fbbf24] w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Send size={24} className="text-[#064e3b]" />
                </div>
                <div className="inline-block px-3 py-1 bg-[#fbbf24]/20 border border-[#fbbf24]/30 rounded-full mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#fbbf24] animate-pulse">Payment Pending</span>
                </div>
                <h2 className="text-2xl font-bold text-[#fbbf24]">Send Money</h2>
                <p className="text-sm text-[#d1fae5]/70">Follow these steps to complete</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-[#fbbf24]/10 text-[#fbbf24] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1">1</div>
                  <p className="text-sm text-[#d1fae5]">If the bKash app didn't open automatically, click the button below.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-[#fbbf24]/10 text-[#fbbf24] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1">2</div>
                  <p className="text-sm text-[#d1fae5]">Send <span className="font-bold text-[#fbbf24]">৳{amount}</span> to <span className="font-bold text-[#fbbf24]">{BKASH_NUMBER}</span>.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-[#fbbf24]/10 text-[#fbbf24] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1">3</div>
                  <p className="text-sm text-[#d1fae5]">Once done, return here and click "Confirm Payment".</p>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={openBKashApp}
                  className="w-full py-4 bg-[#d1005d] text-white font-bold rounded-xl hover:bg-[#b0004e] transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  Try Opening bKash Again <Wallet size={20} />
                </button>
                <div className="h-px bg-[#fbbf24]/10 w-full my-2" />
                <button
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#fbbf24] text-[#064e3b] font-bold rounded-xl hover:bg-[#f59e0b] transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-[#064e3b] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Confirm Payment <Check size={20} /></>
                  )}
                </button>
                <button
                  onClick={() => setStep('payment')}
                  className="w-full py-2 text-xs text-[#d1fae5]/40 hover:text-[#fbbf24] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-full max-w-sm mx-auto perspective-1000"
            >
              {/* The "Eid Card" Letter Interface */}
              <div className="bg-[#fdfcf0] text-[#064e3b] p-8 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-t-[12px] border-[#fbbf24] relative overflow-hidden">
                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#064e3b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* Gold Corner Accents */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#fbbf24]/30 rounded-tr-sm"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#fbbf24]/30 rounded-bl-sm"></div>

                <div className="relative z-10 space-y-8">
                  <div className="text-center space-y-2">
                    <Moon size={32} className="text-[#fbbf24] mx-auto fill-[#fbbf24]" />
                    <h2 className="font-serif text-3xl italic font-bold tracking-tight">Eid Mubarak</h2>
                    <div className="h-px bg-[#064e3b]/10 w-24 mx-auto"></div>
                  </div>

                  <div className="space-y-6 font-serif leading-relaxed text-lg">
                    <p className="italic">Dear <span className="font-bold border-b border-[#fbbf24]">{name}</span>,</p>
                    
                    <p className="font-bold text-[#b45309] text-xl">
                      Thank you, {name}! Your Selami of ৳{amount} has been received.
                    </p>

                    <p>
                      May this Eid bring you endless joy and prosperity. Wishing you and your family a blessed day filled with love, laughter, and delicious treats!
                    </p>

                    {message && (
                      <div className="bg-[#064e3b]/5 p-4 rounded-lg border-l-4 border-[#fbbf24] italic text-sm">
                        "{message}"
                      </div>
                    )}
                  </div>

                  <div className="pt-8 flex justify-between items-end border-t border-[#064e3b]/5">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest opacity-50">Date</p>
                      <p className="text-sm font-medium">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest opacity-50">With Love,</p>
                      <p className="font-serif italic text-xl">The Collector</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <button
                  onClick={() => {
                    setStep('landing');
                    setName('');
                    setAmount('');
                  }}
                  className="w-full py-4 bg-[#fbbf24] text-[#064e3b] font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform active:scale-95"
                >
                  Send Another Selami
                </button>
                <p className="text-center text-[10px] uppercase tracking-[0.4em] text-[#fbbf24]/40">
                  Digital Eid Card • 2026
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-6 w-full text-center text-[10px] uppercase tracking-[0.3em] text-[#fbbf24]/30 pointer-events-none">
        Eid-ul-Fitr 2026 • Crafted with Love
      </footer>
    </div>
  );
}
