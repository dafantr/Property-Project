import React from 'react';

const RedemptionRequest = () => {
  // Mock data - replace with actual data fetching
  const redemptionData = [
    {
      name: 'John Doe',
      memberId: '9291123',
      pointRedeem: 120,
      rewardName: 'Singapore Tour',
      redeemStatus: 'Pending',
      requestedDateTime: '2023-10-01 / 12:28:01',
    },
    // ... existing redemption data
  ];

  return (
    <div className="bg-white rounded-lg p-4 mt-4">
      <h2 className="text-xl font-bold mb-4">Reward Redemption Request List</h2>
      {/* ... existing redemption request table code ... */}
    </div>
  );
};

export default RedemptionRequest;