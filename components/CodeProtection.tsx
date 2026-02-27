'use client';

import React, { useEffect, useState } from 'react';

const CodeProtection: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShowModal(true);
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12
      if (e.key === 'F12') {
        e.preventDefault();
        setShowModal(true);
        return false;
      }
      // Disable Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        setShowModal(true);
        return false;
      }
      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        setShowModal(true);
        return false;
      }
      // Disable Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        setShowModal(true);
        return false;
      }
      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        setShowModal(true);
        return false;
      }
      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        setShowModal(true);
        return false;
      }
      // Disable Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setShowModal(true);
        return false;
      }
    };

    // Detect DevTools opening
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      if (widthThreshold || heightThreshold) {
        setShowModal(true);
      }
    };

    // Disable text selection
    const disableSelection = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable drag
    const disableDrag = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setShowModal(true);
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectstart', disableSelection);
    document.addEventListener('dragstart', disableDrag);
    document.addEventListener('copy', handleCopy);

    // Check for DevTools periodically
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectstart', disableSelection);
      document.removeEventListener('dragstart', disableDrag);
      document.removeEventListener('copy', handleCopy);
      clearInterval(devToolsInterval);
    };
  }, []);

  const handleContactOwner = () => {
    window.location.href = '/contact';
    setShowModal(false);
  };

  const handleLinkedIn = () => {
    window.open('https://www.linkedin.com/in/pradipmourya-61a387218/', '_blank');
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Code Protection Active
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This website's code is protected. If you're interested in the source code or have any questions, please contact the owner.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleContactOwner}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Contact Admin
            </button>
            <button
              onClick={handleLinkedIn}
              className="w-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              LinkedIn Profile
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-2 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeProtection;
