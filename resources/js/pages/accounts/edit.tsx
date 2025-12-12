import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import AccountInput from './input';

interface EditAccountProps {
    account?: {
        uuid?: string;
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
    };
    accountTypes?: string[];
    countries?: string[];
    customerGroups?: string[];
    salesReps?: string[];
    warrantyOptions?: string[];
    onSuccess?: () => void;
}

const EditAccount = ({
    account,
    accountTypes = [],
    countries = [],
    customerGroups = [],
    salesReps = [],
    warrantyOptions = [],
    onSuccess,
}: EditAccountProps) => {
    const accountData = (account as any)?.data || account;
    const accountUuid = accountData?.uuid || account?.id || '';

    return (
        <>
            <Head title="Edit Account" />
            <Form 
                method="put" 
                action={`/accounts/${accountUuid}`} 
                encType="multipart/form-data"
                onSuccess={onSuccess}
                preserveScroll
            >
                {({ processing, errors }) => (
                    <div>
                        <AccountInput
                            errors={errors}
                            data={accountData}
                            accountTypes={accountTypes}
                            countries={countries}
                            customerGroups={customerGroups}
                            salesReps={salesReps}
                            warrantyOptions={warrantyOptions}
                        />
                        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 mt-6">
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={onSuccess}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Update Account
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
};

EditAccount.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default EditAccount;

