import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertCircle,
    Check,
    Plus,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface TeamMember {
    userId: string;
    userName: string;
    role: string;
    commissionRate: number;
    isPrimary: boolean;
}

interface ManageTeamAssignmentProps {
    accountId: string;
    accountName: string;
    onClose: () => void;
    onSave?: (teamMembers: TeamMember[]) => void;
}

const ManageTeamAssignment = ({
    accountId,
    accountName,
    onSave,
    onClose,
}: ManageTeamAssignmentProps) => {
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [showAddMember, setShowAddMember] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');

    // Load users from localStorage
    useEffect(() => {
        const savedUsers = localStorage.getItem('systemUsers');
        if (savedUsers) {
            try {
                const users = JSON.parse(savedUsers);
                // Only show users with commissions enabled (mock - you can add this property)
                setAvailableUsers(users);
            } catch (error) {
                console.error('Failed to load users:', error);
            }
        }

        // Load existing team assignment for this account
        const savedAssignments = localStorage.getItem(
            'accountTeamAssignments',
        );
        if (savedAssignments) {
            try {
                const assignments = JSON.parse(savedAssignments);
                const accountAssignment = assignments[accountId];
                if (accountAssignment) {
                    setTeamMembers(accountAssignment);
                }
            } catch (error) {
                console.error('Failed to load team assignments:', error);
            }
        }
    }, [accountId]);

    const totalCommission = teamMembers.reduce(
        (sum, member) => sum + member.commissionRate,
        0,
    );
    const isValidTotal = Math.abs(totalCommission - 100) < 0.01; // Allow for floating point precision

    const handleAddMember = () => {
        if (!selectedUserId) return;

        const user = availableUsers.find((u) => u.id === selectedUserId);
        if (!user) return;

        // Check if user already assigned
        if (teamMembers.some((m) => m.userId === user.id)) {
            alert('This user is already assigned to this account');
            return;
        }

        const newMember: TeamMember = {
            userId: user.id,
            userName: user.name,
            role: user.role,
            commissionRate: 0,
            isPrimary: teamMembers.length === 0, // First member is primary
        };

        const updated = [...teamMembers, newMember];
        setTeamMembers(updated);
        setSelectedUserId('');
        setShowAddMember(false);
        saveAssignment(updated);
    };

    const handleRemoveMember = (userId: string) => {
        const updated = teamMembers.filter((m) => m.userId !== userId);

        // If we removed the primary, make the first remaining member primary
        if (updated.length > 0 && !updated.some((m) => m.isPrimary)) {
            updated[0].isPrimary = true;
        }

        setTeamMembers(updated);
        saveAssignment(updated);
    };

    const handleCommissionChange = (userId: string, rate: number) => {
        const updated = teamMembers.map((m) =>
            m.userId === userId ? { ...m, commissionRate: rate } : m,
        );
        setTeamMembers(updated);
        saveAssignment(updated);
    };

    const handleSetPrimary = (userId: string) => {
        const updated = teamMembers.map((m) => ({
            ...m,
            isPrimary: m.userId === userId,
        }));
        setTeamMembers(updated);
        saveAssignment(updated);
    };

    const saveAssignment = (members: TeamMember[]) => {
        // Save to localStorage
        const savedAssignments = localStorage.getItem(
            'accountTeamAssignments',
        );
        let assignments: any = {};

        if (savedAssignments) {
            try {
                assignments = JSON.parse(savedAssignments);
            } catch (error) {
                console.error('Failed to parse assignments:', error);
            }
        }

        assignments[accountId] = members;
        localStorage.setItem(
            'accountTeamAssignments',
            JSON.stringify(assignments),
        );

        // Call onSave callback if provided
        if (onSave) {
            onSave(members);
        }
    };

    const availableToAdd = availableUsers.filter(
        (u) => !teamMembers.some((m) => m.userId === u.id),
    );

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                onClick={onClose}
            >
                <div
                    className="w-full max-w-5xl rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="flex items-center gap-2 text-gray-900">
                                <Users className="h-5 w-5" />
                                Sales Team Assignment
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Assign users to this account and set commission
                                splits
                            </p>
                        </div>
                        <Button
                            type="button"
                            onClick={() => setShowAddMember(true)}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add Member
                        </Button>
                    </div>

                    {/* Validation Alert */}
                    {teamMembers.length > 0 && !isValidTotal && (
                        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                            <div>
                                <p className="text-red-900">
                                    Commission total must equal 100%
                                </p>
                                <p className="mt-1 text-sm text-red-700">
                                    Current total: {totalCommission.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    )}

                    {teamMembers.length > 0 && isValidTotal && (
                        <div className="mb-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                            <div>
                                <p className="text-green-900">
                                    Commission split is valid (100%)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Team Members List */}
                    {teamMembers.length === 0 ? (
                        <div className="rounded-lg bg-gray-50 py-12 text-center">
                            <Users className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                            <p className="text-gray-600">
                                No team members assigned
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Click "Add Member" to assign users to this
                                account
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {teamMembers.map((member) => (
                                <div
                                    key={member.userId}
                                    className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
                                >
                                    <div className="flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <p className="text-gray-900">
                                                {member.userName}
                                            </p>
                                            {member.isPrimary && (
                                                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {member.userId} • {member.role}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="custom-form-field">
                                            <Label className="mb-1 block text-xs text-gray-600">
                                                Commission %
                                            </Label>
                                            <Input
                                                type="number"
                                                value={member.commissionRate}
                                                onChange={(e) =>
                                                    handleCommissionChange(
                                                        member.userId,
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                className="w-24"
                                            />
                                        </div>

                                        {!member.isPrimary && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    handleSetPrimary(
                                                        member.userId,
                                                    )
                                                }
                                                className="text-sm"
                                            >
                                                Set Primary
                                            </Button>
                                        )}

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleRemoveMember(
                                                    member.userId,
                                                )
                                            }
                                            title="Remove"
                                            className="h-8 w-8"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Total */}
                            <div className="flex items-center justify-between rounded-lg border-2 border-gray-300 bg-gray-100 p-4">
                                <span className="text-gray-900">
                                    Total Commission Split
                                </span>
                                <span
                                    className={`text-lg ${
                                        isValidTotal
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}
                                >
                                    {totalCommission.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-end border-t border-gray-200 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>

            {/* Add Member Modal */}
            {showAddMember && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
                    onClick={() => {
                        setShowAddMember(false);
                        setSelectedUserId('');
                    }}
                >
                    <div
                        className="w-full max-w-md rounded-lg bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <h3 className="text-gray-900">Add Team Member</h3>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setShowAddMember(false);
                                    setSelectedUserId('');
                                }}
                                className="h-9 w-9"
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <div className="custom-form-field">
                                <Label className="mb-2 block text-gray-700">
                                    Select User{' '}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    value={selectedUserId}
                                    onChange={(e) =>
                                        setSelectedUserId(e.target.value)
                                    }
                                    className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Choose a user...</option>
                                    {availableToAdd.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} - {user.role}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {availableToAdd.length === 0 && (
                                <p className="mb-4 text-sm text-gray-600">
                                    No users available. All users are already
                                    assigned.
                                </p>
                            )}

                            <div className="flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowAddMember(false);
                                        setSelectedUserId('');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleAddMember}
                                    disabled={!selectedUserId}
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Add Member
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageTeamAssignment;

