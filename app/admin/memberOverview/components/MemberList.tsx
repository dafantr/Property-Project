'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableRowMember,
} from "@/components/ui/table";
import { MemberActions } from "./MemberActions";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface MemberListProps {
    initialMembers: any[];
    tierList: any[];
}

export function MemberList({ initialMembers, tierList }: MemberListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [tierFilter, setTierFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const resetFilters = () => {
        setSearchTerm('');
        setTierFilter('all');
        setStatusFilter('all');
        setCurrentPage(1);
    };

    const filteredMembers = initialMembers.filter(member => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            member.profile.firstName.toLowerCase().includes(searchLower) ||
            member.profile.lastName.toLowerCase().includes(searchLower) ||
            member.memberId.toLowerCase().includes(searchLower) ||
            member.tier.tierName.toLowerCase().includes(searchLower) ||
            new Date(member.profile.createdAt).toLocaleDateString().toLowerCase().includes(searchLower) ||
            (member.isActive === 1 ? "active" : "inactive").includes(searchLower);

        const matchesTier = tierFilter === 'all' || member.tier.tierName === tierFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && member.isActive === 1) ||
            (statusFilter === 'inactive' && member.isActive === 0);

        return matchesSearch && matchesTier && matchesStatus;
    });

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search by name, ID, tier, date, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by tier" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        {tierList.map((tier) => (
                            <SelectItem key={tier.id} value={tier.tierName}>
                                {tier.tierName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    Clear Filters
                </button>
            </div>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Member ID</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[180px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedMembers.map((member) => (
                            <TableRowMember key={member.id} variant={member.isDeleted === 1 ? 'deleted' : 'default'}>
                                <TableCell>
                                    {member.profile.firstName} {member.profile.lastName}
                                </TableCell>
                                <TableCell>{member.memberId}</TableCell>
                                <TableCell>
                                    {new Date(member.profile.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{member.tier.tierName}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                            member.isActive === 1
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {member.isActive === 1 ? "Active" : "Inactive"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <MemberActions member={member} tierList={tierList} />
                                </TableCell>
                            </TableRowMember>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of{' '}
                    {filteredMembers.length} results
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}