import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface UserInputProps {
    errors: Record<string, string>;
    data?: {
        name?: string;
        email?: string;
        phone?: string;
        password?: string;
        role?: string;
        status?: string;
    };
}

const UserInput = ({ errors, data }: UserInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <div className="space-y-4">
                <div className="custom-form-field">
                    <Label className="mb-2 block text-gray-700">
                        Full Name{' '}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        name="name"
                        defaultValue={data?.name ?? ''}
                        required
                        placeholder="Enter full name"
                        className="w-full"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="custom-form-field">
                    <Label className="mb-2 block text-gray-700">
                        Email Address{' '}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="email"
                        name="email"
                        defaultValue={data?.email ?? ''}
                        required
                        placeholder="user@example.com"
                        className="w-full"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="custom-form-field">
                    <Label className="mb-2 block text-gray-700">
                        Phone Number{' '}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="tel"
                        name="phone"
                        defaultValue={data?.phone ?? ''}
                        required
                        placeholder="(555) 123-4567"
                        className="w-full"
                    />
                    <InputError message={errors.phone} />
                </div>

                <div className="custom-form-field">
                    <Label className="mb-2 block text-gray-700">
                        Password{' '}
                        <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            defaultValue={data?.password ?? ''}
                            required
                            placeholder="Enter password"
                            className="w-full"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                    <InputError message={errors.password} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Role{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <select
                            name="role"
                            defaultValue={data?.role ?? 'Store User'}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Store User">Store User</option>
                            <option value="Store Admin">Store Admin</option>
                            <option value="Store Manager">Store Manager</option>
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Status{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <select
                            name="status"
                            defaultValue={data?.status ?? 'Active'}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                        <InputError message={errors.status} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInput;

