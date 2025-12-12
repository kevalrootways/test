<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected $fillable = [
        'uuid',
        'name',
        'guard_name',
        'description',
        'template_permissions',
        'commission_enabled',
        'default_commission',
        'is_default',
    ];

    protected $casts = [
        'template_permissions' => 'array',
        'commission_enabled' => 'boolean',
        'default_commission' => 'decimal:2',
        'is_default' => 'boolean',
    ];
}

