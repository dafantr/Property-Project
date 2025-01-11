import { fetchProfile, fetchMember } from "@/utils/actions";
import { redirect } from "next/navigation";
import Downline from "@/components/member/Downline";

const exampleData = {
    id: "1",
    name: "John Doe",
    memberId: "REF1",
    downlines: [
      {
        id: "2",
        name: "Alice Smith",
        memberId: "REF2",
        downlines: [
          { id: "4", name: "Bob Johnson", memberId: "REF3" },
          { id: "5", name: "Carol White", memberId: "REF4" }
        ]
      },
      {
        id: "3",
        name: "David Brown",
        memberId: "REF5",
        downlines: [
          { id: "6", name: "Eve Wilson", memberId: "REF6" }
        ]
      },{
        id: "7",
        name: "Alice Smeagull",
        memberId: "REF7",
        downlines: [
          { id: "4", name: "Bob Johnson", memberId: "REF8" },
          { id: "5", name: "Carol White", memberId: "REF9" }
        ]
      },
      {
        id: "8",
        name: "David Smeagull",
        memberId: "REF10",
        downlines: [
          { id: "6", name: "Eve Wilson", memberId: "REF11" }
        ]
      },{
        id: "9",
        name: "Alice Treetops",
        memberId: "REF12",
        downlines: [
          { id: "4", name: "Bob Johnson", memberId: "REF13" },
          { id: "5", name: "Carol White", memberId: "REF14" }
        ]
      },
      {
        id: "10",
        name: "David Brown",
        memberId: "REF15",
        downlines: [
          { id: "6", name: "Eve Wilson", memberId: "REF16" }
        ]
      }
    ]
  };

export default async function DownlinePage() {
	const profile = await fetchProfile();
	if (!profile) {
		redirect('/profile/create');
	}

	const member = await fetchMember(profile?.clerkId);
	if (member === null) {
		redirect('/member/create');
	}
	
	return (
        <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700">
				<h1 className="text-xl font-semibold mb-4 dark:text-white">Referral Tree</h1>
                <div className="relative w-full overflow-auto p-8">
                    <div className="min-w-max flex justify-center">
                    <Downline member={exampleData} />
                    </div>
                </div>
            </div>
        </div>
	);
}
