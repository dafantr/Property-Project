import { fetchProfile, fetchMember, fetchDownlines } from "@/utils/actions";
import { redirect } from "next/navigation";
import Downline from "@/components/member/Downline";

export default async function DownlinePage() {
	const profile = await fetchProfile();
	if (!profile) {
		redirect('/profile/create');
	}

	const member = await fetchMember(profile?.clerkId);
	if (member === null) {
		redirect('/member/create');
	}

  const downlines = await fetchDownlines(member.id, 3);
  if (downlines === null) {
    return new Error('Failed to fetch downlines');
  }

  console.log(downlines);
	
	return (
        <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h1 className="text-xl font-semibold mb-4 dark:text-white">Referral Tree</h1>
                <div className="relative w-full overflow-auto p-8">
                    <div className="min-w-max flex justify-center">
                    <Downline member={downlines} />
                    </div>
                </div>
            </div>
        </div>
	);
}
