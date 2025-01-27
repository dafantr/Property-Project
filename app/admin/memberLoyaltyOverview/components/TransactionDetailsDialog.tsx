'use client';

import React from 'react';

interface TransactionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    name: string;
    memberId: string;
    type: string;
    point: number;
    dateTime: Date;
  } | null;
}

const TransactionDetailsDialog = ({ isOpen, onClose, transaction }: TransactionDetailsProps) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold dark:text-white">Transaction Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-black/40 p-3 rounded border dark:border-gray-800">
            <label className="text-sm font-semibold dark:text-gray-300">Member Name</label>
            <p className="mt-1 dark:text-white">{transaction.name}</p>
          </div>
          <div className="bg-gray-50 dark:bg-black/40 p-3 rounded border dark:border-gray-800">
            <label className="text-sm font-semibold dark:text-gray-300">Member ID</label>
            <p className="mt-1 dark:text-white">{transaction.memberId}</p>
          </div>
          <div className="bg-gray-50 dark:bg-black/40 p-3 rounded border dark:border-gray-800">
            <label className="text-sm font-semibold dark:text-gray-300">Type</label>
            <p className="mt-1 dark:text-white">{transaction.type}</p>
          </div>
          <div className="bg-gray-50 dark:bg-black/40 p-3 rounded border dark:border-gray-800">
            <label className="text-sm font-semibold dark:text-gray-300">Points Redeemed</label>
            <p className="mt-1 dark:text-white">{transaction.point}</p>
          </div>
          <div className="bg-gray-50 dark:bg-black/40 p-3 rounded border dark:border-gray-800">
            <label className="text-sm font-semibold dark:text-gray-300">Date/Time</label>
            <p className="mt-1 dark:text-white">
              {new Date(transaction.dateTime).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              }).replace(',', '/').replace(/\//g, '-').replace('-/', '/')}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 rounded transition-colors border dark:border-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsDialog;