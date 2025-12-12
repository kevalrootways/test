<?php

namespace App\Http\Requests;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleTemplateRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check();
    }

    public function rules()
    {
        $roleParam = $this->route('template');
        $role = null;
        if ($roleParam) {
            $role = Role::where('uuid', $roleParam)
                ->orWhere('id', $roleParam)
                ->first();
        }

        return [
            'name' => 'required|string|max:50|unique:roles,name,' . ($role->id ?? 'NULL'),
            'description' => 'required|string',
            'permissions' => [
                'required',
                'array',
                function ($attribute, $value, $fail) {
                    if (!is_array($value)) {
                        $fail('The permissions must be an array.');
                        return;
                    }
                    $hasSelectedPermission = false;
                    foreach ($value as $permission => $enabled) {
                        if ($enabled === true) {
                            $hasSelectedPermission = true;
                            break;
                        }
                    }
                    if (!$hasSelectedPermission) {
                        $fail('At least one module permission must be selected.');
                    }
                },
            ],
            'permissions.*' => 'boolean',
            'commissionEnabled' => 'sometimes|boolean',
            'defaultCommission' => 'sometimes|numeric|min:0|max:100',
            'isDefault' => 'sometimes|boolean',
        ];
    }
}

