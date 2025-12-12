import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, CheckCircle, Copy, Send, X } from 'lucide-react';
import { useState } from 'react';

interface SendFormProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const SendForm = ({ onClose, onSuccess }: SendFormProps) => {
    const [formSent, setFormSent] = useState(false);
    const [customerFormEmail, setCustomerFormEmail] = useState('');
    const [generatedFormLink, setGeneratedFormLink] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

    const handleSendFormToCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual API call to generate form link
        // For now, generate a mock link
        const mockLink = `${window.location.origin}/customer-form/${Date.now()}`;
        setGeneratedFormLink(mockLink);
        setFormSent(true);
        if (onSuccess) {
            onSuccess();
        }
    };

    const copyLinkToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedFormLink);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const handleClose = () => {
        setFormSent(false);
        setCustomerFormEmail('');
        setGeneratedFormLink('');
        setLinkCopied(false);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md rounded-lg bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-200 p-6">
                    <h2 className="text-gray-900">
                        {formSent
                            ? 'Form Link Generated'
                            : 'Send Form to Customer'}
                    </h2>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="h-9 w-9"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </Button>
                </div>

                {!formSent ? (
                    <form onSubmit={handleSendFormToCustomer} className="p-6">
                        <div className="custom-form-field mb-4">
                            <Label className="mb-2 block text-gray-700">
                                Customer Email Address{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="email"
                                value={customerFormEmail}
                                onChange={(e) =>
                                    setCustomerFormEmail(e.target.value)
                                }
                                required
                                className="w-full"
                                placeholder="customer@example.com"
                            />
                        </div>
                        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <h3 className="mb-2 text-sm text-gray-900">
                                What happens next?
                            </h3>
                            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                                <li>
                                    Customer receives an email with a unique
                                    form link
                                </li>
                                <li>
                                    They fill in their account and address
                                    information
                                </li>
                                <li>
                                    Account is created with "Inactive" status
                                </li>
                                <li>
                                    You receive a notification to complete and
                                    activate
                                </li>
                            </ul>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <Send className="h-4 w-4" />
                                Generate Link
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="p-6">
                        <div className="mb-4 flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <p className="text-sm">
                                Link generated successfully for{' '}
                                <span className="font-medium">
                                    {customerFormEmail}
                                </span>
                            </p>
                        </div>
                        <div className="mb-4">
                            <Label className="mb-2 block text-sm text-gray-700">
                                Customer Form Link
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    value={generatedFormLink}
                                    readOnly
                                    className="flex-1 bg-gray-50"
                                />
                                <Button
                                    type="button"
                                    onClick={copyLinkToClipboard}
                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                    title="Copy link"
                                >
                                    {linkCopied ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <h3 className="mb-2 text-sm text-gray-900">
                                Next Steps
                            </h3>
                            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                                <li>
                                    Share this link with your customer via email
                                    or messaging
                                </li>
                                <li>
                                    Customer fills out their information using
                                    the form
                                </li>
                                <li>
                                    You'll receive a notification when they
                                    submit
                                </li>
                                <li>
                                    Review and activate their account in the
                                    system
                                </li>
                            </ul>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    window.open(generatedFormLink, '_blank')
                                }
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                                <Send className="h-4 w-4" />
                                Test Form
                            </Button>
                            <Button
                                type="button"
                                onClick={handleClose}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SendForm;
