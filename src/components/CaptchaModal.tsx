'use client';

import { useState, useEffect } from 'react';

interface CaptchaModalProps {
  isOpen: boolean;
  onVerify: (success: boolean) => void;
  onClose: () => void;
}

export default function CaptchaModal({ isOpen, onVerify, onClose }: CaptchaModalProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<'+' | '-'>('+');
  const [userAnswer, setUserAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Generate new equation when modal opens
  useEffect(() => {
    if (isOpen) {
      generateChallenge();
    }
  }, [isOpen]);

  const generateChallenge = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    const op = Math.random() > 0.5 ? '+' : '-';
    
    // Ensure positive results for subtraction
    if (op === '-' && n1 < n2) {
      setNum1(n2);
      setNum2(n1);
    } else {
      setNum1(n1);
      setNum2(n2);
    }
    
    setOperator(op as '+' | '-');
    setUserAnswer('');
    setErrorMsg('');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
    const parsedUserAnswer = parseInt(userAnswer.trim());

    if (isNaN(parsedUserAnswer)) {
      setErrorMsg('Please enter a valid number.');
      return;
    }

    if (parsedUserAnswer === correctAnswer) {
      onVerify(true);
    } else {
      setErrorMsg('Incorrect answer. Please try again.');
      generateChallenge(); // Generate a new one on failure
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl transition-all dark:border-gray-800 dark:bg-gray-950 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-150 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Security Verification
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-900 dark:hover:text-gray-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-normal">
            To prevent automated abuse, please solve this simple arithmetic equation to continue:
          </p>

          <div className="flex items-center justify-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-900 text-lg font-bold text-gray-800 dark:text-gray-200">
            <span>{num1}</span>
            <span>{operator}</span>
            <span>{num2}</span>
            <span>=</span>
            <input
              type="text"
              required
              autoFocus
              className="w-20 rounded-md border border-gray-300 px-2.5 py-1 text-center font-bold text-gray-900 focus:border-rose-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-amber-500"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="?"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-500 text-center">
              {errorMsg}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-350 dark:hover:bg-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-linear-to-r from-rose-500 to-amber-500 py-2.5 text-sm font-semibold text-white hover:from-rose-600 hover:to-amber-600 shadow-md shadow-rose-500/10"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
