<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid ?? $this->id,
            'userId' => $this->user_id ?? $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone ?? null,
            'role' => $this->whenLoaded('roles', function () {
                return $this->roles->first()?->name ?? 'No Role';
            }, 'No Role'),
            'status' => $this->status ?? 'Active',
            'lastLogin' => $this->last_login ? $this->last_login->format('Y-m-d') : null,
            'permissions' => $this->whenLoaded('permissions', function () {
                $directPermissions = $this->permissions->pluck('name')->toArray();
                $rolePermissions = $this->whenLoaded('roles', function () {
                    return $this->roles->flatMap(function ($role) {
                        return $role->permissions->pluck('name');
                    })->unique()->values()->toArray();
                }, []);
                return array_unique(array_merge($directPermissions, $rolePermissions));
            }, $this->whenLoaded('roles', function () {
                // Fallback: only role permissions if permissions not loaded
                return $this->roles->flatMap(function ($role) {
                    return $role->permissions->pluck('name');
                })->unique()->values()->toArray();
            }, [])),
            'assignedStore' => $this->assigned_store ?? null,
            'commissionEnabled' => (bool) ($this->commission_enabled ?? false),
            'commissionRate' => (float) ($this->commission_rate ?? 0),
            'createdDate' => $this->created_at ? $this->created_at->format('Y-m-d') : null,
        ];
    }
}
