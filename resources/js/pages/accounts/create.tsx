import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import AccountInput from './input';

interface CreateAccountProps {
    accountTypes?: string[];
    countries?: string[];
    customerGroups?: string[];
    salesReps?: string[];
    warrantyOptions?: string[];
    onSuccess?: () => void;
}

const CreateAccount = ({
    accountTypes = [],
    countries = [],
    customerGroups = [],
    salesReps = [],
    warrantyOptions = [],
    onSuccess,
}: CreateAccountProps) => {
    return (
        <>
            <Head title="Create Account" />
            <Form 
                method="post" 
                action="/accounts" 
                encType="multipart/form-data"
                onSuccess={onSuccess}
                preserveScroll
            >
                {({ processing, errors }) => (
                    <div>
                        <AccountInput
                            errors={errors}
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
                                Create Account
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
};

CreateAccount.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default CreateAccount;

