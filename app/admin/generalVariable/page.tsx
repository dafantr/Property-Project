'use client';

import { useEffect, useState, useMemo } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'react-hot-toast';
import {
	fetchGeneralVariables,
	updateGeneralVariableAction,
	createGeneralVariableAction,
	deleteGeneralVariableAction,
} from '@/utils/actions';
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Slider } from '@mui/material';

interface GeneralVariable {
	id: string;
	variableName: string;
	variableValue: string;
	variableType: string;
	createdAt: Date;
	updatedAt: Date;
}

export default function GeneralVariable() {
	const [variables, setVariables] = useState<GeneralVariable[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedType, setSelectedType] = useState('');

	const [createState, createAction] = useFormState(createGeneralVariableAction, null);
	const [updateState, updateAction] = useFormState(updateGeneralVariableAction, null);

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber);
	};

	useEffect(() => {
		loadVariables();
	}, []);

	useEffect(() => {
		if (createState?.status === 'success' || updateState?.status === 'success') {
			loadVariables();
			setShowCreateForm(false);
			setEditingId(null);
			if (createState?.message || updateState?.message) {
				toast.success(createState?.message || updateState?.message!);
			}
		} else if (createState?.status === 'error' || updateState?.status === 'error') {
			toast.error(createState?.message || updateState?.message || 'An error occurred');
		}
	}, [createState, updateState]);

	const filteredVariables = useMemo(() => {
		return variables.filter((item) => {
			const searchMatches = searchQuery
				? item.variableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				  item.variableValue.toLowerCase().includes(searchQuery.toLowerCase())
				: true;

			const typeMatches = selectedType
				? item.variableType === selectedType
				: true;

			return searchMatches && typeMatches;
		});
	}, [variables, searchQuery, selectedType]);

	// Update pagination to use filtered results
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredVariables.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredVariables.length / itemsPerPage);

	const loadVariables = async () => {
		try {
			const data = await fetchGeneralVariables();
			setVariables(data);
		} catch (error) {
			toast.error('Failed to load variables');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (window.confirm('Are you sure you want to delete this variable?')) {
			const result = await deleteGeneralVariableAction(id);
			if (result.status === 'success') {
				toast.success(result.message);
				loadVariables();
			} else {
				toast.error(result.message);
			}
		}
	};

	const resetFilters = () => {
		setSearchQuery('');
		setSelectedType('');
	};

	if (isLoading) {
		return <div className="flex justify-center items-center h-screen">Loading...</div>;
	}

	return (
		<div className="p-6 dark:bg-black">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold dark:text-white">General Variables</h1>
				<button
					onClick={() => setShowCreateForm(true)}
					className="bg-[#B5A17C] text-white px-4 py-2 rounded hover:opacity-90"
				>
					Add New Variable
				</button>
			</div>

			{showCreateForm && (
				<form action={createAction} className="mb-6 p-4 border rounded dark:border-gray-600 dark:bg-black">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<input
							type="text"
							name="name"
							placeholder="Variable Name"
							required
							className="border p-2 rounded dark:bg-black dark:border-gray-600 dark:text-white"
						/>
						<input
							type="text"
							name="value"
							placeholder="Variable Value"
							required
							className="border p-2 rounded dark:bg-black dark:border-gray-600 dark:text-white"
						/>
						<select name="type" required className="border p-2 rounded dark:bg-black dark:border-gray-600 dark:text-white">
							<option value="">Select Type</option>
							<option value="number">Number</option>
							<option value="text">Text</option>
							<option value="boolean">Boolean</option>
						</select>
					</div>
					<div className="mt-4 flex gap-2">
						<button
							type="submit"
							className="bg-[#B5A17C] text-white px-4 py-2 rounded hover:opacity-90"
						>
							Create
						</button>
						<button
							type="button"
							onClick={() => setShowCreateForm(false)}
							className="bg-gray-500 text-white px-4 py-2 rounded hover:opacity-90"
						>
							Cancel
						</button>
					</div>
				</form>
			)}

			{/* Search and Type Filter */}
			<div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
				<div className="w-full md:w-1/3">
					<input
						type="text"
						placeholder="Search by name or value"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="p-2 border rounded-md w-full dark:bg-black dark:border-gray-800 dark:text-white dark:placeholder-gray-500"
					/>
				</div>

				<div className="w-full md:w-1/3">
					<select
						value={selectedType}
						onChange={(e) => setSelectedType(e.target.value)}
						className="p-2 border rounded-md w-full dark:bg-black dark:border-gray-800 dark:text-white"
					>
						<option value="">All Types</option>
						<option value="number">Number</option>
						<option value="text">Text</option>
						<option value="boolean">Boolean</option>
					</select>
				</div>

				<div className="w-full md:w-1/3">
					<button
						onClick={resetFilters}
						className="px-4 py-2 border rounded-md dark:border-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 w-full"
					>
						Reset
					</button>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full bg-white dark:bg-black border rounded dark:border-gray-600">
					<thead className="bg-gray-50 dark:bg-black">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-600">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-600">
								Value
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-600">
								Type
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b dark:border-gray-600">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-600">
						{currentItems.map((variable) => (
							<tr key={variable.id} className="dark:text-white dark:hover:bg-gray-900">
								<td className="px-6 py-4 whitespace-nowrap">{variable.variableName}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{editingId === variable.id ? (
										<form action={updateAction} className="flex gap-2">
											<input type="hidden" name="id" value={variable.id} />
											<input
												type="text"
												name="value"
												defaultValue={variable.variableValue}
												className="border p-1 rounded dark:bg-black dark:border-gray-600 dark:text-white"
											/>
											<button
												type="submit"
												className="text-[#B5A17C] hover:opacity-70"
											>
												<CheckIcon className="h-4 w-4" />
											</button>
											<button
												type="button"
												onClick={() => setEditingId(null)}
												className="text-gray-500 hover:opacity-70"
											>
												<XMarkIcon className="h-4 w-4" />
											</button>
										</form>
									) : (
										variable.variableValue
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap">{variable.variableType}</td>
								<td className="px-6 py-4 whitespace-nowrap">
									{editingId !== variable.id && (
										<div className="flex gap-2">
											<button
												onClick={() => setEditingId(variable.id)}
												className="text-[#B5A17C] hover:opacity-70"
											>
												<PencilIcon className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDelete(variable.id)}
												className="text-red-500 hover:opacity-70"
											>
												<TrashIcon className="h-4 w-4" />
											</button>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* Pagination Controls */}
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 dark:text-white">
					<div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
						<span>Rows per page:</span>
						<select
							value={itemsPerPage}
							onChange={(e) => {
								setCurrentPage(1);
								setItemsPerPage(Number(e.target.value));
							}}
							className="border rounded p-1 dark:bg-black dark:border-gray-800"
						>
							{[5, 10, 25, 50].map((rows) => (
								<option key={rows} value={rows}>
									{rows}
								</option>
							))}
						</select>
					</div>
					<div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
						<span className="whitespace-nowrap">
							{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, variables.length)} of{' '}
							{variables.length}
						</span>
						<div className="flex gap-1">
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
							>
								Previous
							</button>
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
							>
								Next
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
