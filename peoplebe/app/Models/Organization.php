<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $table = 'organization';
    protected $primaryKey = 'org_id';

    protected $fillable = [
        'org_name',
        'org_type',
        'org_registration',
        'email',
        'phone',
        'website',
        'address',
        'proof_registration',
        'services',
        'status',
        'org_password',
        'profile_pic',
        'profile_completed',
    ];

    protected $hidden = [
        'org_password',
        'proof_registration',
        'profile_pic',
    ];

    protected function casts(): array
    {
        return [
            'org_password' => 'hashed',
            'profile_completed' => 'boolean',
        ];
    }

    public function employees()
    {
        return $this->hasMany(Employee::class, 'organization_id');
    }
}

