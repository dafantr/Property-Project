'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { createRewardAction, deleteRewardAction, updateRewardAction, fetchRewards } from '@/utils/actions';

interface Reward {
  id: string;
  rewardName: string;
  pointReq: number;
}

export default function ManageRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [createState, createAction] = useFormState(createRewardAction, null);
  const [updateState, updateAction] = useFormState(updateRewardAction, null);

  useEffect(() => {
    const loadRewards = async () => {
      const rewardsList = await fetchRewards();
      setRewards(rewardsList);
    };
    loadRewards();
  }, [createState, updateState]);

  const handleAddReward = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    await createAction(formData);
    form.reset();
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('id', editingReward?.id || '');
    await updateAction(formData);
    setEditingReward(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      await deleteRewardAction(id);
      setRewards(rewards.filter(reward => reward.id !== id));
    }
  };

  return (
    <div className="p-2 sm:p-6 dark:bg-black">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 dark:text-white">Manage Rewards</h1>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Add New Reward Section */}
        <div className="bg-gray-50 dark:bg-black border dark:border-gray-800 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 dark:text-white">
            {editingReward ? 'Edit Reward' : 'Add New Reward'}
          </h2>
          <form onSubmit={editingReward ? handleUpdate : handleAddReward}>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Reward Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingReward?.rewardName}
                  className="w-full p-2 text-sm sm:text-base border rounded-md dark:bg-black dark:text-white dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Point Requirements</label>
                <input
                  type="number"
                  name="points"
                  defaultValue={editingReward?.pointReq}
                  className="w-full p-2 border rounded-md dark:bg-black dark:text-white dark:border-gray-700"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 text-sm sm:text-base bg-[#B5A17C] text-white rounded-md hover:opacity-90"
              >
                {editingReward ? 'Update Reward' : 'Add Reward'}
              </button>
              {editingReward && (
                <button
                  type="button"
                  onClick={() => setEditingReward(null)}
                  className="w-full p-2 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Rewards Section */}
        <div className="bg-gray-50 dark:bg-black border dark:border-gray-800 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 dark:text-white">Existing Rewards</h2>
          <div className="space-y-2 sm:space-y-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-black dark:border dark:border-gray-800 p-3 sm:p-4 rounded-lg shadow gap-2 sm:gap-0"
              >
                <div>
                  <h3 className="font-semibold dark:text-white text-sm sm:text-base">{reward.rewardName}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{reward.pointReq} Points</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(reward)}
                    className="px-3 py-1 text-sm sm:text-base bg-[#B5A17C] text-white rounded hover:opacity-90"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reward.id)}
                    className="px-3 py-1 text-sm sm:text-base bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}