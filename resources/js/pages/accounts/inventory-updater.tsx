import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertCircle,
    Check,
    Loader,
    Package,
    RefreshCw,
    Upload,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Account {
    id: string;
    name: string;
    inventoryCount?: number;
    lastInventoryUpdate?: string;
    inventoryStatus?: 'synced' | 'pending' | 'error';
}

interface InventoryUpdaterProps {
    onClose: () => void;
    onInventoryUpdate?: (
        updates: { accountId: string; inventoryCount: number }[],
    ) => void;
    accounts: Account[];
}

const InventoryUpdater = ({
    onClose,
    onInventoryUpdate,
    accounts,
}: InventoryUpdaterProps) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateProgress, setUpdateProgress] = useState(0);
    const [updateResults, setUpdateResults] = useState<any[]>([]);
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(300); // seconds
    const [lastUpdateTime, setLastUpdateTime] = useState<string>('');

    // Load saved API settings
    useEffect(() => {
        const savedSettings = localStorage.getItem('inventoryAPISettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setApiEndpoint(parsed.apiEndpoint || '');
                setApiKey(parsed.apiKey || '');
                setAutoRefresh(parsed.autoRefresh || false);
                setRefreshInterval(parsed.refreshInterval || 300);
            } catch (error) {
                console.error('Failed to load API settings:', error);
            }
        }
    }, []);

    // Auto-refresh functionality
    useEffect(() => {
        if (autoRefresh && refreshInterval > 0) {
            const interval = setInterval(() => {
                handleUpdateInventory();
            }, refreshInterval * 1000);

            return () => clearInterval(interval);
        }
    }, [autoRefresh, refreshInterval]);

    const saveAPISettings = () => {
        const settings = {
            apiEndpoint,
            apiKey,
            autoRefresh,
            refreshInterval,
        };
        localStorage.setItem(
            'inventoryAPISettings',
            JSON.stringify(settings),
        );
    };

    const handleUpdateInventory = async () => {
        setIsUpdating(true);
        setUpdateProgress(0);
        setUpdateResults([]);

        // Save settings before updating
        saveAPISettings();

        // Simulate API call with progress
        // In production, replace this with actual API integration
        const updates: { accountId: string; inventoryCount: number }[] = [];

        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            try {
                // MOCK API CALL - Replace with actual API integration
                const mockInventoryData = await fetchInventoryFromAPI(
                    account.id,
                );

                updates.push({
                    accountId: account.id,
                    inventoryCount: mockInventoryData.count,
                });

                setUpdateResults((prev) => [
                    ...prev,
                    {
                        accountId: account.id,
                        accountName: account.name,
                        status: 'success',
                        inventoryCount: mockInventoryData.count,
                        message: `Updated successfully`,
                    },
                ]);
            } catch (error) {
                setUpdateResults((prev) => [
                    ...prev,
                    {
                        accountId: account.id,
                        accountName: account.name,
                        status: 'error',
                        message: `Failed to update: ${error}`,
                    },
                ]);
            }

            setUpdateProgress(
                Math.round(((i + 1) / accounts.length) * 100),
            );
        }

        // Apply updates
        if (onInventoryUpdate) {
            onInventoryUpdate(updates);
        }
        setLastUpdateTime(new Date().toLocaleString());
        setIsUpdating(false);
    };

    // MOCK API function - Replace with your actual API integration
    const fetchInventoryFromAPI = async (
        accountId: string,
    ): Promise<{ count: number }> => {
        // This is a MOCK function. Replace with actual API call:
        /*
        const response = await fetch(`${apiEndpoint}/inventory/${accountId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        
        const data = await response.json();
        return { count: data.inventoryCount };
        */

        // MOCK: Return random inventory count
        return {
            count: Math.floor(Math.random() * 1000) + 100,
        };
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                    <div className="flex items-center gap-3">
                        <RefreshCw className="h-6 w-6" />
                        <div>
                            <h2 className="text-xl">Inventory API Updater</h2>
                            <p className="text-sm text-blue-100">
                                Sync inventory counts from external API
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-9 w-9 text-white hover:bg-white/20"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
                    {/* API Configuration */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h3 className="mb-4 flex items-center gap-2 text-gray-900">
                            <Upload className="h-5 w-5" />
                            API Configuration
                        </h3>

                        <div className="space-y-4">
                            <div className="custom-form-field">
                                <Label className="mb-1 block text-sm text-gray-700">
                                    API Endpoint URL
                                </Label>
                                <Input
                                    type="text"
                                    value={apiEndpoint}
                                    onChange={(e) =>
                                        setApiEndpoint(e.target.value)
                                    }
                                    placeholder="https://api.yourdomain.com/inventory"
                                    className="w-full"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Base URL for your inventory API endpoint
                                </p>
                            </div>

                            <div className="custom-form-field">
                                <Label className="mb-1 block text-sm text-gray-700">
                                    API Key / Bearer Token
                                </Label>
                                <Input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter your API key or bearer token"
                                    className="w-full"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Authentication token for API access
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <Label className="flex cursor-pointer items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={autoRefresh}
                                        onChange={(e) =>
                                            setAutoRefresh(e.target.checked)
                                        }
                                        className="h-4 w-4 rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Enable Auto-Refresh
                                    </span>
                                </Label>

                                {autoRefresh && (
                                    <div className="flex items-center gap-2">
                                        <Label className="text-sm text-gray-700">
                                            Interval:
                                        </Label>
                                        <select
                                            value={refreshInterval}
                                            onChange={(e) =>
                                                setRefreshInterval(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value={60}>1 minute</option>
                                            <option value={300}>5 minutes</option>
                                            <option value={600}>
                                                10 minutes
                                            </option>
                                            <option value={900}>
                                                15 minutes
                                            </option>
                                            <option value={1800}>
                                                30 minutes
                                            </option>
                                            <option value={3600}>1 hour</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <Button
                                type="button"
                                onClick={saveAPISettings}
                                className="bg-gray-600 text-white hover:bg-gray-700"
                            >
                                Save API Settings
                            </Button>
                        </div>
                    </div>

                    {/* Update Status */}
                    {lastUpdateTime && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                            <Check className="h-5 w-5 text-green-600" />
                            <span className="text-sm text-green-800">
                                Last updated: {lastUpdateTime}
                            </span>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {isUpdating && (
                        <div className="mb-6">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm text-gray-700">
                                    Updating inventory...
                                </span>
                                <span className="text-sm text-gray-700">
                                    {updateProgress}%
                                </span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
                                    style={{ width: `${updateProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {updateResults.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="mb-3 text-gray-900">
                                Update Results
                            </h3>
                            <div className="max-h-96 space-y-2 overflow-y-auto">
                                {updateResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-3 rounded-lg border p-3 ${
                                            result.status === 'success'
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-red-50 border-red-200'
                                        }`}
                                    >
                                        {result.status === 'success' ? (
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                                        ) : (
                                            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                                        )}
                                        <div className="flex-1">
                                            <p
                                                className={`text-sm ${
                                                    result.status === 'success'
                                                        ? 'text-green-900'
                                                        : 'text-red-900'
                                                }`}
                                            >
                                                <span className="font-medium">
                                                    {result.accountName}
                                                </span>{' '}
                                                ({result.accountId})
                                            </p>
                                            {result.status === 'success' && (
                                                <p className="text-sm text-green-700">
                                                    Inventory Count:{' '}
                                                    {result.inventoryCount}
                                                </p>
                                            )}
                                            <p
                                                className={`mt-1 text-xs ${
                                                    result.status === 'success'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {result.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Account Summary */}
                    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            <h3 className="text-blue-900">
                                Accounts to Update
                            </h3>
                        </div>
                        <p className="text-sm text-blue-700">
                            {accounts.length} account(s) will be synced with
                            the inventory API
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button
                        type="button"
                        onClick={handleUpdateInventory}
                        disabled={isUpdating || !apiEndpoint}
                        className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isUpdating ? (
                            <>
                                <Loader className="h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="h-4 w-4" />
                                Update All Inventory
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InventoryUpdater;

