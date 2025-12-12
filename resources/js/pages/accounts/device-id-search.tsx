import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertCircle,
    Battery,
    Clock,
    Loader,
    MapPin,
    Radio,
    Search,
    Signal,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface DeviceInfo {
    deviceId: string;
    status: 'active' | 'inactive' | 'sleep' | 'error';
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
        lastUpdate: string;
    };
    batteryLevel?: number;
    signalStrength?: number;
    lastCommunication?: string;
    accountName?: string;
    accountId?: string;
    model?: string;
    firmware?: string;
}

interface DeviceIDSearchProps {
    onClose: () => void;
}

const DeviceIDSearch = ({ onClose }: DeviceIDSearchProps) => {
    const [deviceId, setDeviceId] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
    const [searchError, setSearchError] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    // Load saved API settings
    useEffect(() => {
        const savedSettings = localStorage.getItem('deviceAPISettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setApiEndpoint(parsed.apiEndpoint || '');
                setApiKey(parsed.apiKey || '');
            } catch (error) {
                console.error('Failed to load API settings:', error);
            }
        }
    }, []);

    const saveAPISettings = () => {
        const settings = {
            apiEndpoint,
            apiKey,
        };
        localStorage.setItem('deviceAPISettings', JSON.stringify(settings));
        setShowSettings(false);
    };

    const handleSearch = async () => {
        if (!deviceId.trim()) {
            setSearchError('Please enter a device ID');
            return;
        }

        setIsSearching(true);
        setSearchError('');
        setDeviceInfo(null);

        try {
            // MOCK API CALL - Replace with actual API integration
            const deviceData = await fetchDeviceInfoFromAPI(deviceId);
            setDeviceInfo(deviceData);
        } catch (error: any) {
            setSearchError(
                error.message || 'Failed to fetch device information',
            );
        } finally {
            setIsSearching(false);
        }
    };

    // MOCK API function - Replace with your actual API integration
    const fetchDeviceInfoFromAPI = async (
        deviceId: string,
    ): Promise<DeviceInfo> => {
        // This is a MOCK function. Replace with actual API call:
        /*
        const response = await fetch(`${apiEndpoint}/devices/${deviceId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Device not found or API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
        */

        // MOCK: Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // MOCK: Random device data
        const statuses: Array<'active' | 'inactive' | 'sleep' | 'error'> = [
            'active',
            'inactive',
            'sleep',
            'error',
        ];
        const randomStatus =
            statuses[Math.floor(Math.random() * statuses.length)];

        return {
            deviceId: deviceId,
            status: randomStatus,
            location: {
                latitude: 43.6532 + (Math.random() - 0.5) * 0.1,
                longitude: -79.3832 + (Math.random() - 0.5) * 0.1,
                address: '123 King St W, Toronto, ON M5H 1A1, Canada',
                lastUpdate: new Date(
                    Date.now() - Math.random() * 3600000,
                ).toLocaleString(),
            },
            batteryLevel: Math.floor(Math.random() * 100),
            signalStrength: Math.floor(Math.random() * 100),
            lastCommunication: new Date(
                Date.now() - Math.random() * 86400000,
            ).toLocaleString(),
            accountName: 'Sample Account',
            accountId:
                'ACC-' +
                Math.floor(Math.random() * 1000)
                    .toString()
                    .padStart(3, '0'),
            model: 'KYCS Locate XT',
            firmware: 'v2.1.4',
        };
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            case 'sleep':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'error':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <Radio className="h-4 w-4 text-green-600" />;
            case 'inactive':
                return <AlertCircle className="h-4 w-4 text-gray-600" />;
            case 'sleep':
                return <Clock className="h-4 w-4 text-blue-600" />;
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-600" />;
            default:
                return null;
        }
    };

    const getBatteryColor = (level: number) => {
        if (level > 60) return 'text-green-600';
        if (level > 30) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getSignalColor = (strength: number) => {
        if (strength > 70) return 'text-green-600';
        if (strength > 40) return 'text-yellow-600';
        return 'text-red-600';
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
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white">
                    <div className="flex items-center gap-3">
                        <Search className="h-6 w-6" />
                        <div>
                            <h2 className="text-xl">Device ID Search</h2>
                            <p className="text-sm text-purple-100">
                                Lookup device status, location, and mapping
                                information
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
                    {/* API Settings Toggle */}
                    <div className="mb-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowSettings(!showSettings)}
                            className="h-auto p-0 text-sm text-purple-600 hover:text-purple-700 hover:underline"
                        >
                            {showSettings ? 'Hide' : 'Show'} API Settings
                        </Button>
                    </div>

                    {/* API Configuration */}
                    {showSettings && (
                        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <h3 className="mb-4 text-gray-900">
                                API Configuration
                            </h3>

                            <div className="space-y-4">
                                <div className="custom-form-field">
                                    <Label className="mb-1 block text-sm text-gray-700">
                                        Device API Endpoint URL
                                    </Label>
                                    <Input
                                        type="text"
                                        value={apiEndpoint}
                                        onChange={(e) =>
                                            setApiEndpoint(e.target.value)
                                        }
                                        placeholder="https://api.yourdomain.com/devices"
                                        className="w-full"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Base URL for your device tracking API
                                        endpoint
                                    </p>
                                </div>

                                <div className="custom-form-field">
                                    <Label className="mb-1 block text-sm text-gray-700">
                                        API Key / Bearer Token
                                    </Label>
                                    <Input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) =>
                                            setApiKey(e.target.value)
                                        }
                                        placeholder="Enter your API key or bearer token"
                                        className="w-full"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Authentication token for API access
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    onClick={saveAPISettings}
                                    className="bg-purple-600 text-white hover:bg-purple-700"
                                >
                                    Save API Settings
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Search Box */}
                    <div className="mb-6">
                        <Label className="mb-2 block text-gray-700">
                            Device ID
                        </Label>
                        <div className="custom-form-field flex gap-3">
                            <Input
                                type="text"
                                value={deviceId}
                                onChange={(e) => setDeviceId(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === 'Enter' && handleSearch()
                                }
                                placeholder="Enter device ID (e.g., DEV-12345, IMEI, Serial Number)"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                            >
                                {isSearching ? (
                                    <>
                                        <Loader className="h-5 w-5 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-5 w-5" />
                                        Search
                                    </>
                                )}
                            </Button>
                        </div>
                        {searchError && (
                            <p className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                {searchError}
                            </p>
                        )}
                    </div>

                    {/* Device Information */}
                    {deviceInfo && (
                        <div className="space-y-4">
                            {/* Status Badge */}
                            <div
                                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 ${getStatusColor(deviceInfo.status)}`}
                            >
                                {getStatusIcon(deviceInfo.status)}
                                <span className="capitalize">
                                    {deviceInfo.status}
                                </span>
                            </div>

                            {/* Device Details Grid */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Basic Info */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <h3 className="mb-3 flex items-center gap-2 text-gray-900">
                                        <Radio className="h-5 w-5" />
                                        Device Information
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Device ID:
                                            </span>
                                            <span className="text-gray-900">
                                                {deviceInfo.deviceId}
                                            </span>
                                        </div>
                                        {deviceInfo.model && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Model:
                                                </span>
                                                <span className="text-gray-900">
                                                    {deviceInfo.model}
                                                </span>
                                            </div>
                                        )}
                                        {deviceInfo.firmware && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Firmware:
                                                </span>
                                                <span className="text-gray-900">
                                                    {deviceInfo.firmware}
                                                </span>
                                            </div>
                                        )}
                                        {deviceInfo.accountName && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Account:
                                                </span>
                                                <span className="text-gray-900">
                                                    {deviceInfo.accountName}
                                                </span>
                                            </div>
                                        )}
                                        {deviceInfo.accountId && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Account ID:
                                                </span>
                                                <span className="text-gray-900">
                                                    {deviceInfo.accountId}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status Metrics */}
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <h3 className="mb-3 flex items-center gap-2 text-gray-900">
                                        <Signal className="h-5 w-5" />
                                        Device Metrics
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        {deviceInfo.batteryLevel !==
                                            undefined && (
                                            <div>
                                                <div className="mb-1 flex items-center justify-between">
                                                    <span className="flex items-center gap-1 text-gray-600">
                                                        <Battery className="h-4 w-4" />
                                                        Battery Level:
                                                    </span>
                                                    <span
                                                        className={getBatteryColor(
                                                            deviceInfo.batteryLevel,
                                                        )}
                                                    >
                                                        {
                                                            deviceInfo.batteryLevel
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            deviceInfo.batteryLevel >
                                                            60
                                                                ? 'bg-green-500'
                                                                : deviceInfo.batteryLevel >
                                                                    30
                                                                  ? 'bg-yellow-500'
                                                                  : 'bg-red-500'
                                                        }`}
                                                        style={{
                                                            width: `${deviceInfo.batteryLevel}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                        {deviceInfo.signalStrength !==
                                            undefined && (
                                            <div>
                                                <div className="mb-1 flex items-center justify-between">
                                                    <span className="flex items-center gap-1 text-gray-600">
                                                        <Signal className="h-4 w-4" />
                                                        Signal Strength:
                                                    </span>
                                                    <span
                                                        className={getSignalColor(
                                                            deviceInfo.signalStrength,
                                                        )}
                                                    >
                                                        {
                                                            deviceInfo.signalStrength
                                                        }
                                                        %
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className={`h-2 rounded-full ${
                                                            deviceInfo.signalStrength >
                                                            70
                                                                ? 'bg-green-500'
                                                                : deviceInfo.signalStrength >
                                                                    40
                                                                  ? 'bg-yellow-500'
                                                                  : 'bg-red-500'
                                                        }`}
                                                        style={{
                                                            width: `${deviceInfo.signalStrength}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                        {deviceInfo.lastCommunication && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Last Communication:
                                                </span>
                                                <span className="text-gray-900">
                                                    {
                                                        deviceInfo.lastCommunication
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Location Information */}
                            {deviceInfo.location && (
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                    <h3 className="mb-3 flex items-center gap-2 text-blue-900">
                                        <MapPin className="h-5 w-5" />
                                        Location Information
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        {deviceInfo.location.address && (
                                            <div>
                                                <span className="text-blue-700">
                                                    Address:
                                                </span>
                                                <p className="mt-1 text-blue-900">
                                                    {
                                                        deviceInfo.location
                                                            .address
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-blue-700">
                                                    Latitude:
                                                </span>
                                                <p className="text-blue-900">
                                                    {deviceInfo.location.latitude.toFixed(
                                                        6,
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-blue-700">
                                                    Longitude:
                                                </span>
                                                <p className="text-blue-900">
                                                    {deviceInfo.location.longitude.toFixed(
                                                        6,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-blue-200 pt-2">
                                            <span className="text-blue-700">
                                                Last Updated:
                                            </span>
                                            <span className="text-blue-900">
                                                {deviceInfo.location.lastUpdate}
                                            </span>
                                        </div>

                                        {/* Map Link */}
                                        <div className="pt-2">
                                            <a
                                                href={`https://www.google.com/maps?q=${deviceInfo.location.latitude},${deviceInfo.location.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                                            >
                                                <MapPin className="h-4 w-4" />
                                                View on Google Maps
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeviceIDSearch;
