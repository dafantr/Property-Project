'use client';

import { useState } from 'react';

interface ReferralTier {
  tier: number;
  membersRecruited: string;
  commission: number;
  notes?: string;
}

export default function ManageCommissionPage() {
  const [discountPercentage, setDiscountPercentage] = useState(20);
  const [commissionPercentage, setCommissionPercentage] = useState(10);
  const [membersFrom, setMembersFrom] = useState('138');
  const [membersTo, setMembersTo] = useState('138');
  const [overrideCommission, setOverrideCommission] = useState(false);
  const [overridePercentage, setOverridePercentage] = useState(1);

  const [referralTiers, setReferralTiers] = useState<ReferralTier[]>([
    { tier: 1, membersRecruited: '1-20', commission: 6 },
    { tier: 2, membersRecruited: '21-40', commission: 7 },
    { tier: 3, membersRecruited: '41-60', commission: 8 },
    { tier: 4, membersRecruited: '61-80', commission: 9 },
    { tier: 5, membersRecruited: '81-100', commission: 10 },
  ]);

  const handleAddRow = () => {
    const newTier = {
      tier: referralTiers.length + 1,
      membersRecruited: '',
      commission: 0,
    };
    setReferralTiers([...referralTiers, newTier]);
  };

  const handleRemoveRow = () => {
    if (referralTiers.length > 1) {
      setReferralTiers(referralTiers.slice(0, -1));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Passive Commission Section */}
      <div className="bg-white dark:bg-black rounded-lg p-4 md:p-6 shadow">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Current Passive Commission Rule</h2>
        <p className="mb-4 dark:text-gray-200 text-sm md:text-base">
          You earn a {commissionPercentage}% commission each time a {discountPercentage}% discount is used for room bookings referred by you.
        </p>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4">
          Example: Total spending after discount = Rp18.000.000, your commission = Rp1.800.000.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
              Discount Percentage (used for referral bookings):
            </label>
            <input
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(Number(e.target.value))}
              className="w-full p-2 border rounded dark:bg-black dark:border-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
              Commission Percentage (earned by referral):
            </label>
            <input
              type="number"
              value={commissionPercentage}
              onChange={(e) => setCommissionPercentage(Number(e.target.value))}
              className="w-full p-2 border rounded dark:bg-black dark:border-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-end gap-2 mt-4">
          <button className="w-full md:w-auto px-4 py-2 bg-[#C4A484] text-white rounded">
            Save Changes
          </button>
          <button className="w-full md:w-auto px-4 py-2 border rounded">
            Reset to Default
          </button>
        </div>
      </div>

      {/* Referral Membership Rules Section */}
      <div className="bg-white dark:bg-black rounded-lg p-4 md:p-6 shadow">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Current Referral Membership Rules</h2>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full mb-4 min-w-[600px]">
            <thead>
              <tr className="bg-[#C4A484] text-white">
                <th className="p-2 text-left">Tier</th>
                <th className="p-2 text-left">Members Recruited</th>
                <th className="p-2 text-left">Commission (%)</th>
                <th className="p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody className="dark:text-gray-200">
              {referralTiers.map((tier) => (
                <tr key={tier.tier} className="border-b dark:border-gray-800">
                  <td className="p-2">Tier {tier.tier}</td>
                  <td className="p-2">{tier.membersRecruited}</td>
                  <td className="p-2">{tier.commission}%</td>
                  <td className="p-2">{tier.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
              Members Recruited From:
            </label>
            <input
              type="text"
              value={membersFrom}
              onChange={(e) => setMembersFrom(e.target.value)}
              className="w-full p-2 border rounded dark:bg-black dark:border-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
              Members Recruited To:
            </label>
            <input
              type="text"
              value={membersTo}
              onChange={(e) => setMembersTo(e.target.value)}
              className="w-full p-2 border rounded dark:bg-black dark:border-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
              Commission Percentage:
            </label>
            <input
              type="text"
              value={membersTo}
              className="w-full p-2 border rounded dark:bg-black dark:border-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <button
            onClick={handleAddRow}
            className="w-full md:w-auto px-4 py-2 bg-[#C4A484] text-white rounded"
          >
            Add Row
          </button>
          <button
            onClick={handleRemoveRow}
            className="w-full md:w-auto px-4 py-2 border rounded"
          >
            Remove Row
          </button>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 dark:text-gray-200">
            <input
              type="checkbox"
              checked={overrideCommission}
              onChange={(e) => setOverrideCommission(e.target.checked)}
              className="rounded dark:bg-black dark:border-gray-800"
            />
            <span>Enable Override Commission</span>
          </label>
        </div>

        {overrideCommission && (
          <div className="mb-4">
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
              Override Commission Percentage:
            </label>
            <input
              type="number"
              value={overridePercentage}
              onChange={(e) => setOverridePercentage(Number(e.target.value))}
              className="w-full p-2 border rounded dark:bg-black dark:border-gray-800 dark:text-white"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row md:justify-end gap-2">
          <button className="w-full md:w-auto px-4 py-2 bg-[#C4A484] text-white rounded">
            Save Changes
          </button>
          <button className="w-full md:w-auto px-4 py-2 border rounded">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
