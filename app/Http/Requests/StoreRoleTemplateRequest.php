<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoleTemplateRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->check();
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:50|unique:roles,name',
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
        ];
    }
}

