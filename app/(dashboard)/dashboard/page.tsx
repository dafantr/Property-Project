import { auth } from "@clerk/nextjs/server";
import { createClient } from '@supabase/supabase-js'
import { Users, Gift, Network, RefreshCcw } from "lucide-react";

export default async function DashboardPage() {




  return (
    <div className="grid grid-cols-2 gap-6">
      {/* User Profile Card */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <Users className="h-8 w-8 text-blue-500" />
          <h2 className="text-xl font-semibold dark:text-white">Profile Overview</h2>
        </div>
        <div className="space-y-3 dark:text-gray-300">
          <p>Name: {user?.firstName} {user?.lastName}</p>
          <p>Email: {user?.emailAddresses[0].emailAddress}</p>
          <p>Member Since: {new Date(userData?.created_at || "").toLocaleDateString()}</p>
          <p>Membership Type: {userData?.membership_type || 'Basic'}</p>
          <p>Status: {userData?.status || 'Active'}</p>
        </div>
      </div>

      {/* Referral & Commission Card */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <RefreshCcw className="h-8 w-8 text-green-500" />
          <h2 className="text-xl font-semibold dark:text-white">Referrals & Commissions</h2>
        </div>
        <div className="space-y-3 dark:text-gray-300">
          <p>Total Referrals: {referralsData?.length || 0}</p>
          <p>Active Referrals: {
            referralsData?.filter(ref => ref.status === 'active').length || 0
          }</p>
          <p>Total Commission: ${
            referralsData?.reduce((acc, ref) => acc + (ref.commission_amount || 0), 0).toFixed(2) || '0.00'
          }</p>
          <p>Pending Commission: ${
            referralsData?.filter(ref => ref.status === 'pending')
              .reduce((acc, ref) => acc + (ref.commission_amount || 0), 0).toFixed(2) || '0.00'
          }</p>
        </div>
      </div>

      {/* Loyalty Points Card */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <Gift className="h-8 w-8 text-purple-500" />
          <h2 className="text-xl font-semibold dark:text-white">Loyalty Points</h2>
        </div>
        <div className="space-y-3 dark:text-gray-300">
          <p>Current Points: {loyaltyData?.points || 0}</p>
          <p>Points to Next Reward: {
            loyaltyData?.next_reward_threshold
              ? loyaltyData.next_reward_threshold - (loyaltyData.points || 0)
              : 100
          }</p>
          <div className="mt-4">
            <h3 className="font-semibold mb-2 dark:text-white">Available Rewards:</h3>
            <ul className="list-disc list-inside">
              <li>500 points: Free Month Subscription</li>
              <li>1000 points: Premium Features Access</li>
              <li>2000 points: Special Member Status</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Downline Tree Card */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <Network className="h-8 w-8 text-orange-500" />
          <h2 className="text-xl font-semibold dark:text-white">Downline Overview</h2>
        </div>
        <div className="space-y-3 dark:text-gray-300">
          <p>Direct Downlines: {downlineData?.length || 0}</p>
          <p>Total Network Size: {downlineData?.length || 0}</p>
          <p>Network Level: {userData?.network_level || 1}</p>
          <div className="mt-4">
            <h3 className="font-semibold mb-2 dark:text-white">Recent Downlines:</h3>
            <div className="space-y-2">
              {downlineData && downlineData.length > 0 ? (
                downlineData.slice(0, 5).map((downline) => (
                  <div key={downline.id} className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{downline.first_name} {downline.last_name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No downlines yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
