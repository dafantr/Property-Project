import { fetchMemberById, fetchProfileById } from "@/utils/actions";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditMemberForm from "@/app/admin/memberOverview/components/EditMemberForm";

export default async function EditMemberPage({
	params,
}: {
	params: { id: string };
}) {
	const memberDatas = await fetchMemberById(params.id);
	if (!memberDatas) redirect("/admin/memberOverview");

	const citizenshipOptions = await fetchCitizenshipOptions();

	return (
		<main className="flex min-h-screen flex-col p-4 sm:p-6 dark:bg-black">
			<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
				<Link
					href="/admin/memberOverview"
					className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
					<ArrowLeft className="w-4 h-4 mr-1" />
					Back to Members
				</Link>
				<h1 className="text-xl sm:text-2xl font-bold dark:text-white">Member Profile</h1>
			</div>

			<div className="bg-white dark:bg-black rounded-lg shadow-sm p-4 sm:p-8">
				<EditMemberForm
					member={JSON.stringify(memberDatas)}
					citizenshipOptions={citizenshipOptions}
				/>
			</div>
		</main>
	);
}

async function fetchCitizenshipOptions() {
	const response = await fetch("https://countriesnow.space/api/v0.1/countries");
	const data = await response.json();
	return data.data.map((item: { country: string; iso2: string }) => ({
		value: item.iso2,
		label: item.country,
	}));
}
