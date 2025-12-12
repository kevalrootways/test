<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountController extends Controller
{

    public function index()
    {
        // Sample data matching the design
        $accounts = [
            [
                'id' => 'ACC-001',
                'name' => 'John Smith',
                'contactFirstName' => 'John',
                'contactLastName' => 'Smith',
                'email' => 'john.smith@email.com',
                'phone' => '(555) 123-4567',
                'type' => 'Individual',
                'status' => 'Active',
                'totalPurchases' => 1,
                'totalSpent' => 28500,
                'lastPurchase' => '2024-11-20',
                'city' => 'Toronto',
                'provinceState' => 'ON',
                'country' => 'Canada',
                'salesRep' => 'Sarah Sales',
                'customerGroup' => 'BMW',
                'warrantyText' => 'Standard Warranty',
                'storeProducts' => [
                    ['productId' => 'SKU-001', 'yearsOfService' => 3],
                    ['productId' => 'SKU-002', 'yearsOfService' => 5]
                ],
                'inventoryCount' => 245,
                'lastInventoryUpdate' => '2024-12-01 10:30 AM',
                'allowValidationAPI' => false,
                'validationAPIKey' => '',
            ],
            [
                'id' => 'ACC-002',
                'name' => 'Sarah Johnson',
                'contactFirstName' => 'Sarah',
                'contactLastName' => 'Johnson',
                'email' => 'sarah.j@email.com',
                'phone' => '(555) 234-5678',
                'type' => 'Individual',
                'status' => 'Active',
                'totalPurchases' => 2,
                'totalSpent' => 61300,
                'lastPurchase' => '2024-11-19',
                'city' => 'Vancouver',
                'provinceState' => 'BC',
                'country' => 'Canada',
                'salesRep' => 'John Sales Manager',
                'customerGroup' => 'BMW',
                'warrantyText' => 'Extended Warranty',
                'storeProducts' => [],
                'inventoryCount' => 182,
                'lastInventoryUpdate' => '2024-12-01 10:28 AM',
                'allowValidationAPI' => true,
                'validationAPIKey' => '123456',
            ],
            [
                'id' => 'ACC-003',
                'name' => 'Mike Davis',
                'contactFirstName' => 'Mike',
                'contactLastName' => 'Davis',
                'email' => 'mike.davis@email.com',
                'phone' => '(555) 345-6789',
                'type' => 'Individual',
                'status' => 'Active',
                'totalPurchases' => 1,
                'totalSpent' => 45200,
                'lastPurchase' => '2024-11-18',
                'city' => 'Calgary',
                'provinceState' => 'AB',
                'country' => 'Canada',
                'salesRep' => 'Emily Thompson',
                'customerGroup' => 'Policaro',
                'warrantyText' => 'Premium Warranty',
                'storeProducts' => [],
                'inventoryCount' => 98,
                'lastInventoryUpdate' => '2024-12-01 09:15 AM',
                'allowValidationAPI' => false,
                'validationAPIKey' => '',
            ],
        ];

        // Calculate stats
        $totalAccounts = count($accounts);
        $activeAccounts = count(array_filter($accounts, fn($a) => $a['status'] === 'Active'));
        $vipAccounts = count(array_filter($accounts, fn($a) => $a['status'] === 'VIP'));
        $totalRevenue = array_sum(array_column($accounts, 'totalSpent'));

        return Inertia::render('accounts/manage', [
            'accounts' => $accounts,
            'totalAccounts' => $totalAccounts,
            'activeAccounts' => $activeAccounts,
            'vipAccounts' => $vipAccounts,
            'totalRevenue' => $totalRevenue,
            'csrfToken' => csrf_token(),
            'accountTypes' => ['Individual', 'Business', 'Corporate', 'Government', 'Partner'],
            'countries' => ['Canada', 'United States', 'Mexico', 'United Kingdom', 'Other'],
            'customerGroups' => ['BMW', 'Policaro', 'Ford', 'Toyota', 'General'],
            'salesReps' => [],
            'warrantyOptions' => ['Standard Warranty', 'Extended Warranty', 'Premium Warranty', 'Limited Warranty', 'No Warranty'],
        ]);
    }

    public function create()
    {
        return Inertia::render('accounts/create', [
            'accountTypes' => ['Individual', 'Business', 'Corporate', 'Government', 'Partner'],
            'countries' => ['Canada', 'United States', 'Mexico', 'United Kingdom', 'Other'],
            'customerGroups' => ['BMW', 'Policaro', 'Ford', 'Toyota', 'General'],
            'salesReps' => [],
            'warrantyOptions' => ['Standard Warranty', 'Extended Warranty', 'Premium Warranty', 'Limited Warranty', 'No Warranty'],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'type' => 'required|string',
            'status' => 'required|string',
            'country' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            DB::commit();
            return redirect()->route('accounts.index')->with('success', 'Account created successfully');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create account'])->withInput();
        }
    }

    public function show($id)
    {
        // TODO: Load account from database when Account model is ready
        // $account = Account::findOrFail($id);

        $account = null;

        return Inertia::render('accounts/show', [
            'account' => $account,
        ]);
    }

    public function edit($id)
    {
        // TODO: Load account from database when Account model is ready
        // $account = Account::findOrFail($id);

        $account = null;

        return Inertia::render('accounts/edit', [
            'account' => $account,
            'accountTypes' => ['Individual', 'Business', 'Corporate', 'Government', 'Partner'],
            'countries' => ['Canada', 'United States', 'Mexico', 'United Kingdom', 'Other'],
            'customerGroups' => ['BMW', 'Policaro', 'Ford', 'Toyota', 'General'],
            'salesReps' => [],
            'warrantyOptions' => ['Standard Warranty', 'Extended Warranty', 'Premium Warranty', 'Limited Warranty', 'No Warranty'],
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'type' => 'required|string',
            'status' => 'required|string',
            'country' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            // TODO: Update account in database when Account model is ready
            // $account = Account::findOrFail($id);
            // $account->update($validated);

            DB::commit();
            return redirect()->route('accounts.index')->with('success', 'Account updated successfully');
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update account'])->withInput();
        }
    }

    public function destroy($id)
    {
        try {
            // TODO: Delete account from database when Account model is ready
            // $account = Account::findOrFail($id);
            // $account->delete();

            return redirect()->route('accounts.index')->with('success', 'Account deleted successfully');
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => 'Failed to delete account']);
        }
    }

    public function table()
    {
        // TODO: Implement DataTables when Account model is ready
        // For now, return empty data
        return response()->json([
            'data' => [],
            'recordsTotal' => 0,
            'recordsFiltered' => 0,
        ]);
    }
}
