import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Image,
    Mail,
    MapPin,
    Package,
    Plus,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface AccountInputProps {
    errors: Record<string, string>;
    data?: {
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
        warrantyText?: string;
        salesRep?: string;
        allowValidationAPI?: boolean;
        validationAPIKey?: string;
        storeLogo?: string;
        alertEmails?: string[];
        storeProducts?: Array<{ productId: string; yearsOfService: number }>;
    };
    accountTypes?: string[];
    countries?: string[];
    customerGroups?: string[];
    salesReps?: string[];
    warrantyOptions?: string[];
    mockProducts?: Array<{ id: string; name: string; basePrice: number }>;
}

const AccountInput = ({
    errors,
    data,
    accountTypes = [
        'Individual',
        'Business',
        'Corporate',
        'Government',
        'Partner',
    ],
    countries = [
        'Canada',
        'United States',
        'Mexico',
        'United Kingdom',
        'Other',
    ],
    customerGroups = ['BMW', 'Policaro', 'Ford', 'Toyota', 'General'],
    salesReps = [],
    warrantyOptions = [
        'Standard Warranty',
        'Extended Warranty',
        'Premium Warranty',
        'Limited Warranty',
        'No Warranty',
    ],
    mockProducts = [
        { id: 'SKU-001', name: 'KYCS Locate XT', basePrice: 349.0 },
        { id: 'SKU-002', name: '2024 Toyota RAV4 XLE', basePrice: 32900 },
        { id: 'SKU-003', name: '2024 Ford F-150 Lariat', basePrice: 45200 },
        {
            id: 'SKU-004',
            name: '2024 Tesla Model 3 Long Range',
            basePrice: 42000,
        },
        { id: 'SKU-005', name: '2024 BMW X5 xDrive40i', basePrice: 58900 },
    ],
}: AccountInputProps) => {
    const [alertEmails, setAlertEmails] = useState<string[]>(
        data?.alertEmails && data.alertEmails.length > 0
            ? data.alertEmails
            : [''],
    );
    const [selectedProducts, setSelectedProducts] = useState<
        Array<{ productId: string; yearsOfService: number }>
    >(
        data?.storeProducts && data.storeProducts.length > 0
            ? data.storeProducts
            : [{ productId: '', yearsOfService: 1 }],
    );
    const [logoPreview, setLogoPreview] = useState<string>(
        data?.storeLogo || '',
    );
    const [allowValidationAPI, setAllowValidationAPI] = useState<boolean>(
        data?.allowValidationAPI || false,
    );

    useEffect(() => {
        if (data?.storeLogo) {
            setLogoPreview(data.storeLogo);
        }
    }, [data?.storeLogo]);

    const handleAlertEmailChange = (index: number, value: string) => {
        const newEmails = [...alertEmails];
        newEmails[index] = value;
        setAlertEmails(newEmails);
    };

    const addAlertEmail = () => {
        if (alertEmails.length < 6) {
            setAlertEmails([...alertEmails, '']);
        }
    };

    const removeAlertEmail = (index: number) => {
        if (alertEmails.length > 1) {
            const newEmails = alertEmails.filter((_, i) => i !== index);
            setAlertEmails(newEmails);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogoPreview('');
        const fileInput = document.getElementById(
            'logo-upload',
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleProductChange = (
        index: number,
        field: 'productId' | 'yearsOfService',
        value: string | number,
    ) => {
        const newProducts = [...selectedProducts];
        newProducts[index] = { ...newProducts[index], [field]: value };
        setSelectedProducts(newProducts);
    };

    const handleAddProduct = () => {
        setSelectedProducts([
            ...selectedProducts,
            { productId: '', yearsOfService: 1 },
        ]);
    };

    const handleRemoveProduct = (index: number) => {
        if (selectedProducts.length > 1) {
            setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-gray-900">
                    <User className="h-4 w-4" />
                    Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="custom-form-field md:col-span-2">
                        <Label className="mb-2 block text-gray-700">
                            Account/Business Name{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="name"
                            defaultValue={data?.name ?? ''}
                            required
                            placeholder="Enter account or business name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Contact First Name{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="contactFirstName"
                            defaultValue={data?.contactFirstName ?? ''}
                            required
                            placeholder="First name"
                        />
                        <InputError message={errors.contactFirstName} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Contact Last Name{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="contactLastName"
                            defaultValue={data?.contactLastName ?? ''}
                            required
                            placeholder="Last name"
                        />
                        <InputError message={errors.contactLastName} />
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
                            placeholder="account@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="tel"
                            name="phone"
                            defaultValue={data?.phone ?? ''}
                            required
                            placeholder="(555) 123-4567"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Mobile Phone
                        </Label>
                        <Input
                            type="tel"
                            name="mobilePhone"
                            defaultValue={data?.mobilePhone ?? ''}
                            placeholder="(555) 987-6543"
                        />
                        <InputError message={errors.mobilePhone} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Account Type <span className="text-red-500">*</span>
                        </Label>
                        <select
                            name="type"
                            defaultValue={data?.type ?? 'Individual'}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            {accountTypes.map((type) => (
                                <option key={type.toLowerCase()} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.type} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Status
                        </Label>
                        <select
                            name="status"
                            defaultValue={data?.status ?? 'Active'}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="Active">Active</option>
                            <option value="VIP">VIP</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        <InputError message={errors.status} />
                    </div>
                </div>
            </div>

            {/* Address Information Section */}
            <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-gray-900">
                    <MapPin className="h-4 w-4" />
                    Address Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="custom-form-field md:col-span-2">
                        <Label className="mb-2 block text-gray-700">
                            Address Line 1{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="address1"
                            defaultValue={data?.address1 ?? ''}
                            required
                            placeholder="Street address, P.O. box, company name, c/o"
                        />
                        <InputError message={errors.address1} />
                    </div>

                    <div className="custom-form-field md:col-span-2">
                        <Label className="mb-2 block text-gray-700">
                            Address Line 2
                        </Label>
                        <Input
                            type="text"
                            name="address2"
                            defaultValue={data?.address2 ?? ''}
                            placeholder="Apartment, suite, unit, building, floor, etc."
                        />
                        <InputError message={errors.address2} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            City <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="city"
                            defaultValue={data?.city ?? ''}
                            required
                            placeholder="City"
                        />
                        <InputError message={errors.city} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Province/State{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="provinceState"
                            defaultValue={data?.provinceState ?? ''}
                            required
                            placeholder="Province or State"
                        />
                        <InputError message={errors.provinceState} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Postal/Zip Code{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            name="postalCode"
                            defaultValue={data?.postalCode ?? ''}
                            required
                            placeholder="M5V 3A8 or 90210"
                        />
                        <InputError message={errors.postalCode} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Country <span className="text-red-500">*</span>
                        </Label>
                        <select
                            name="country"
                            defaultValue={data?.country ?? 'Canada'}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.country} />
                    </div>
                </div>
            </div>

            {/* Alert Email Addresses Section */}
            <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-gray-900">
                    <Mail className="h-4 w-4" />
                    Alert Email Addresses
                </h3>
                <div className="space-y-3">
                    {alertEmails.map((email, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    handleAlertEmailChange(
                                        index,
                                        e.target.value,
                                    )
                                }
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder={`Alert email ${index + 1}`}
                            />
                            {alertEmails.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeAlertEmail(index)}
                                    className="h-9 w-9 text-red-600 hover:bg-red-50"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    ))}
                    {alertEmails.length < 6 && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={addAlertEmail}
                            className="h-auto p-0 text-sm text-blue-600 hover:text-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add another alert email ({alertEmails.length}/6)
                        </Button>
                    )}
                </div>
                {/* Hidden input for alert emails */}
                <input
                    type="hidden"
                    name="alertEmails"
                    value={JSON.stringify(
                        alertEmails.filter((email) => email.trim() !== ''),
                    )}
                />
            </div>

            {/* Business Configuration Section */}
            <div className="mb-6">
                <h3 className="mb-4 text-gray-900">Business Configuration</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Sales Representative{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <select
                            name="salesRep"
                            defaultValue={data?.salesRep ?? ''}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Select Sales Rep</option>
                            {salesReps.map((rep) => (
                                <option key={rep} value={rep}>
                                    {rep}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.salesRep} />
                    </div>

                    <div className="custom-form-field">
                        <Label className="mb-2 block text-gray-700">
                            Customer Group{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <select
                            name="customerGroup"
                            defaultValue={data?.customerGroup ?? ''}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Select Customer Group</option>
                            {customerGroups.map((group) => (
                                <option key={group.toLowerCase()} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            Manage groups in{' '}
                            <strong>Setup → Customer Groups</strong>
                        </p>
                        <InputError message={errors.customerGroup} />
                    </div>

                    <div className="md:col-span-2">
                        <Label className="mb-2 block text-gray-700">
                            Warranty Text{' '}
                            <span className="text-red-500">*</span>
                        </Label>
                        <select
                            name="warrantyText"
                            defaultValue={
                                data?.warrantyText ?? 'Standard Warranty'
                            }
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            {warrantyOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.warrantyText} />
                    </div>

                    <div className="md:col-span-2">
                            <Label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                name="allowValidationAPI"
                                defaultChecked={
                                    data?.allowValidationAPI || false
                                }
                                onChange={(e) =>
                                    setAllowValidationAPI(e.target.checked)
                                }
                                className="h-4 w-4 rounded text-blue-600"
                            />
                            <span className="text-gray-700">
                                Allow Validation API
                            </span>
                        </Label>
                        <p className="mt-1 ml-6 text-sm text-gray-500">
                            Enable API validation for this account's
                            transactions and data
                        </p>
                    </div>

                    {/* Conditional API Key Field */}
                    {allowValidationAPI && (
                        <div className="custom-form-field md:col-span-2">
                            <Label className="mb-2 block text-gray-700">
                                Validation API Key{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="validationAPIKey"
                                defaultValue={data?.validationAPIKey ?? ''}
                                required={allowValidationAPI}
                                pattern="[0-9]{6,7}"
                                maxLength={7}
                                placeholder="Enter 6-7 digit API key"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Enter a 6 or 7 digit numeric API key (e.g.,
                                123456 or 1234567)
                            </p>
                            <InputError message={errors.validationAPIKey} />
                        </div>
                    )}

                    {/* Store Logo Field */}
                    <div className="md:col-span-2">
                        <Label className="mb-2 block text-gray-700">
                            <div className="flex items-center gap-2">
                                <Image className="h-4 w-4" />
                                Store Logo
                            </div>
                        </Label>

                        {/* Logo Preview */}
                        {logoPreview && (
                            <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="h-16 w-auto rounded border border-gray-300 bg-white object-contain p-2"
                                        />
                                        <div className="text-sm text-gray-600">
                                            <p>Logo preview</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                This will appear in the
                                                storefront
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleRemoveLogo}
                                        className="h-9 w-9 text-red-600 hover:bg-red-50"
                                        title="Remove logo"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* File Upload */}
                        <div className="flex items-center gap-3">
                            <Label className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                    id="logo-upload"
                                    name="storeLogo"
                                />
                                <div className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 transition-colors hover:bg-gray-50">
                                    {logoPreview
                                        ? 'Change Logo'
                                        : 'Upload Logo'}
                                </div>
                            </Label>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Upload an image file for the account's custom store
                            logo (max 2MB, appears in their storefront portal)
                        </p>
                        <InputError message={errors.storeLogo} />
                    </div>
                </div>
            </div>

            {/* Store Product Access Section */}
            <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-gray-900">
                    <Package className="h-4 w-4" />
                    Store Product Access & Years of Service
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                    Select which products this account can see in their store
                    and specify years of service for each product
                </p>

                {selectedProducts.map((item, index) => (
                    <div
                        key={index}
                        className="mb-3 grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 md:grid-cols-2"
                    >
                        <div className="custom-form-field">
                            <Label className="mb-2 block text-sm text-gray-700">
                                Product
                            </Label>
                            <select
                                value={item.productId}
                                onChange={(e) =>
                                    handleProductChange(
                                        index,
                                        'productId',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">Select Product</option>
                                {mockProducts.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - $
                                        {product.basePrice.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="custom-form-field">
                            <Label className="mb-2 block text-sm text-gray-700">
                                Years of Service
                            </Label>
                            <div className="flex gap-2">
                                <select
                                    value={item.yearsOfService}
                                    onChange={(e) =>
                                        handleProductChange(
                                            index,
                                            'yearsOfService',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                        (year) => (
                                            <option key={year} value={year}>
                                                {year}{' '}
                                                {year === 1 ? 'Year' : 'Years'}
                                            </option>
                                        ),
                                    )}
                                </select>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveProduct(index)}
                                    className="h-9 w-9 text-red-600 hover:bg-red-50"
                                    title="Remove product"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddProduct}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                    <Plus className="h-4 w-4" />
                    Add Product to Store
                </Button>
                {/* Hidden input for store products */}
                <input
                    type="hidden"
                    name="storeProducts"
                    value={JSON.stringify(
                        selectedProducts.filter((p) => p.productId !== ''),
                    )}
                />
            </div>
        </div>
    );
};

export default AccountInput;
