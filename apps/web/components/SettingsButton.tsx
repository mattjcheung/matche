'use client';

import { useState, useRef, useEffect } from 'react';
import { SignOutButton, UserProfile } from '@clerk/nextjs';

function CogIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.088-.277-.228-.297-.35l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
    </svg>
  );
}

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition border border-transparent hover:border-slate-200"
        aria-label="Settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <CogIcon className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-[200]">
          <button
            type="button"
            onClick={() => {
              setShowProfile(true);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-slate-800 hover:bg-slate-100 flex items-center gap-2 rounded-t-xl"
          >
            Manage account
          </button>
          <SignOutButton signOutOptions={{ redirectUrl: '/' }}>
            <button type="button" className="w-full px-4 py-2.5 text-left text-sm text-slate-800 hover:bg-slate-100 flex items-center gap-2 rounded-b-xl">
              Sign out
            </button>
          </SignOutButton>
        </div>
      )}

      {showProfile && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowProfile(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Manage account"
        >
          <div
            className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] min-h-[400px] overflow-auto text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowProfile(false)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="pt-12 pb-4 px-4 min-h-[360px]">
              <UserProfile
                routing="hash"
                appearance={{
                  variables: {
                    colorBackground: '#ffffff',
                    colorText: '#171717',
                    colorTextSecondary: '#64748b',
                    colorInputBackground: '#ffffff',
                    colorInputText: '#171717',
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
