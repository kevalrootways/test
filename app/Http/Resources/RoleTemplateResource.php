<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\Permission\Models\Permission;

class RoleTemplateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $spatiePermissions = $this->whenLoaded('permissions');
        $spatiePermissionNames = $spatiePermissions ? $spatiePermissions->pluck('name')->toArray() : [];
        $templatePermissions = $this->template_permissions ?? [];
        $allPermissionNames = Permission::where('guard_name', 'web')->pluck('name')->toArray();
        $permissions = [];
        foreach ($allPermissionNames as $permName) {
            $permissions[$permName] = in_array($permName, $spatiePermissionNames) || ($templatePermissions[$permName] ?? false);
        }
        return [
            'id' => $this->uuid ?? (string) $this->id,
            'name' => $this->name,
            'description' => $this->description ?? '',
            'permissions' => $permissions,
            'commissionEnabled' => $this->commission_enabled ?? false,
            'defaultCommission' => (float) ($this->default_commission ?? 0),
            'isDefault' => $this->is_default ?? false,
            'createdDate' => $this->created_at->format('Y-m-d'),
        ];
    }
}

