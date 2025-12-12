import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Mail, Phone, MapPin, UserRound, Building2, Calendar, DollarSign } from 'lucide-react';

interface ShowAccountProps {
    account?: {
        uuid?: string;
        id?: string;
        name?: string;
        contactFirstName?: string;
        contactLastName?: string;
        email?: string;
        phone?: string;
        mobilePhone?: string;
        address1?: string;
        address2?: string;
        city?: string;
        provinceState?: string;
        postalCode?: string;
        country?: string;
        type?: string;
        status?: string;
        customerGroup?: string;
        warranty?: string;
        salesRep?: string;
        totalPurchases?: number;
        totalSpent?: number;
        lastPurchase?: string;
    };
}

const ShowAccount = ({ account }: ShowAccountProps) => {
    const accountData = (account as any)?.data || account;

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-700';
            case 'VIP':
                return 'bg-purple-100 text-purple-700';
            case 'Inactive':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <>
            <Head title="Account Details" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <UserRound className="h-4 w-4" />
                            </div>
                            Account Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {accountData?.id && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Account ID</label>
                                    <p className="text-base font-semibold">{accountData.id}</p>
                                </div>
                            )}

                            {accountData?.name && (
                                <div className="space-y-2 border-t pt-3 md:col-span-2">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Account Name</label>
                                    <p className="text-base font-semibold">{accountData.name}</p>
                                </div>
                            )}

                            {(accountData?.contactFirstName || accountData?.contactLastName) && (
                                <div className="space-y-2 border-t pt-3 md:col-span-2">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Contact Name</label>
                                    <p className="text-base font-semibold">
                                        {[accountData.contactFirstName, accountData.contactLastName].filter(Boolean).join(' ')}
                                    </p>
                                </div>
                            )}

                            {accountData?.email && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Email</label>
                                    <p className="flex items-center gap-2 text-sm break-all">
                                        <Mail className="h-4 w-4" /> {accountData.email}
                                    </p>
                                </div>
                            )}

                            {accountData?.phone && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Phone</label>
                                    <p className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4" /> {accountData.phone}
                                    </p>
                                </div>
                            )}

                            {accountData?.mobilePhone && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Mobile Phone</label>
                                    <p className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4" /> {accountData.mobilePhone}
                                    </p>
                                </div>
                            )}

                            {(accountData?.address1 || accountData?.address2) && (
                                <div className="space-y-2 border-t pt-3 md:col-span-2">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Address</label>
                                    <p className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4" />
                                        {[accountData.address1, accountData.address2].filter(Boolean).join(', ')}
                                    </p>
                                </div>
                            )}

                            {accountData?.city && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">City</label>
                                    <p className="text-sm">{accountData.city}</p>
                                </div>
                            )}

                            {accountData?.provinceState && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Province/State</label>
                                    <p className="text-sm">{accountData.provinceState}</p>
                                </div>
                            )}

                            {accountData?.postalCode && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Postal Code</label>
                                    <p className="text-sm">{accountData.postalCode}</p>
                                </div>
                            )}

                            {accountData?.country && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Country</label>
                                    <p className="text-sm">{accountData.country}</p>
                                </div>
                            )}

                            {accountData?.type && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Account Type</label>
                                    <p className="flex items-center gap-2 text-sm">
                                        <Building2 className="h-4 w-4" /> {accountData.type}
                                    </p>
                                </div>
                            )}

                            {accountData?.status && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Status</label>
                                    <p className="text-sm">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getStatusColor(accountData.status)}`}>
                                            {accountData.status}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {accountData?.customerGroup && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Customer Group</label>
                                    <p className="text-sm">{accountData.customerGroup}</p>
                                </div>
                            )}

                            {accountData?.salesRep && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Sales Rep</label>
                                    <p className="text-sm">{accountData.salesRep}</p>
                                </div>
                            )}

                            {accountData?.warranty && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Warranty</label>
                                    <p className="text-sm">{accountData.warranty}</p>
                                </div>
                            )}

                            {accountData?.totalPurchases !== undefined && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Total Purchases</label>
                                    <p className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4" /> {accountData.totalPurchases}
                                    </p>
                                </div>
                            )}

                            {accountData?.totalSpent !== undefined && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Total Spent</label>
                                    <p className="flex items-center gap-2 text-sm font-semibold">
                                        <DollarSign className="h-4 w-4" /> ${accountData.totalSpent.toLocaleString()}
                                    </p>
                                </div>
                            )}

                            {accountData?.lastPurchase && (
                                <div className="space-y-2 border-t pt-3">
                                    <label className="text-sm font-semibold tracking-wide text-foreground">Last Purchase</label>
                                    <p className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4" /> {accountData.lastPurchase}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

ShowAccount.layout = (page: React.ReactNode) => {
    return <AppLayout children={page} />;
};

export default ShowAccount;

