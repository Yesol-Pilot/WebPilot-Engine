import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SortingHatOverlayProps {
    onComplete: (house: string) => void;
}

type DialogueStage = 'intro' | 'q1' | 'result';

export function SortingHatOverlay({ onComplete }: SortingHatOverlayProps) {
    const [stage, setStage] = useState<DialogueStage>('intro');
    const [text, setText] = useState('');
    const [fullText, setFullText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Dialogue Scripts
    const SCRIPTS = {
        intro: "Hmm... difficult. Very difficult. Plenty of courage, I see. Not a bad mind either. There's talent, oh my goodness, yes.",
        q1: "So... where shall I put you?",
        gryffindor: "GRYFFINDOR!",
        slytherin: "SLYTHERIN!",
        hufflepuff: "HUFFLEPUFF!",
        ravenclaw: "RAVENCLAW!"
    };

    const startDialogue = (content: string) => {
        setFullText(content);
        setText('');
        setIsTyping(true);
    };

    useEffect(() => {
        startDialogue(SCRIPTS.intro);
    }, []);

    useEffect(() => {
        if (isTyping && text.length < fullText.length) {
            const timeout = setTimeout(() => {
                setText(fullText.slice(0, text.length + 1));
            }, 50); // Typing speed
            return () => clearTimeout(timeout);
        } else {
            setIsTyping(false);
        }
    }, [text, isTyping, fullText]);

    const handleNext = () => {
        if (stage === 'intro') {
            setStage('q1');
            startDialogue(SCRIPTS.q1);
        }
    };

    const handleSelectHouse = (house: string) => {
        setStage('result');
        const resultScript = SCRIPTS[house.toLowerCase() as keyof typeof SCRIPTS] || house;
        startDialogue(resultScript);

        // Notify parent after delay
        setTimeout(() => {
            onComplete(house);
        }, 3000);
    };

    return (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-2xl p-6 z-50">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-black/80 border-2 border-[#d4af37] rounded-lg p-6 shadow-[0_0_30px_rgba(212,175,55,0.3)] backdrop-blur-sm"
                >
                    {/* Hat Name Tag */}
                    <div className="absolute -top-4 left-6 bg-[#2a2a2a] border border-[#d4af37] px-4 py-1 rounded text-[#d4af37] font-serif font-bold tracking-wider">
                        SORTING HAT
                    </div>

                    {/* Dialogue Text */}
                    <p className="text-xl md:text-2xl text-[#f0e6d2] font-serif leading-relaxed min-h-[80px]">
                        {text}
                        {isTyping && <span className="animate-pulse">|</span>}
                    </p>

                    {/* Interaction Buttons */}
                    {!isTyping && stage === 'intro' && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 bg-[#d4af37] text-black font-bold rounded hover:bg-[#ffd700] transition-colors font-serif"
                            >
                                Continue...
                            </button>
                        </div>
                    )}

                    {!isTyping && stage === 'q1' && (
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button onClick={() => handleSelectHouse('Gryffindor')} className="p-3 border border-red-800 bg-red-900/40 text-red-100 hover:bg-red-800/60 rounded transition-all font-serif">
                                I desire bravery and chivalry.
                            </button>
                            <button onClick={() => handleSelectHouse('Slytherin')} className="p-3 border border-green-800 bg-green-900/40 text-green-100 hover:bg-green-800/60 rounded transition-all font-serif">
                                I seek greatness and power.
                            </button>
                            <button onClick={() => handleSelectHouse('Ravenclaw')} className="p-3 border border-blue-800 bg-blue-900/40 text-blue-100 hover:bg-blue-800/60 rounded transition-all font-serif">
                                I value wit and learning.
                            </button>
                            <button onClick={() => handleSelectHouse('Hufflepuff')} className="p-3 border border-yellow-800 bg-yellow-900/40 text-yellow-100 hover:bg-yellow-800/60 rounded transition-all font-serif">
                                I value loyalty and patience.
                            </button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
