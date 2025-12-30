<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Giveaway extends Model
{
    use HasFactory;

    protected $table = 'free_food';

    protected $fillable = [
        'user_id',
        'food_title',
        'description',
        'quantity',
        'pickup_time',
        'pickup_instruction',
        'latitude',
        'longitude',
        'expiration_time',
        'status',
        'category',
        'report_category',
    ];

    protected function casts(): array
    {
        return [
            'expiration_time' => 'datetime',
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    public function user()
    {
        return $this->belongsTo(Login::class, 'user_id');
    }

    public function images()
    {
        return $this->hasMany(GiveawayImage::class, 'food_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'food_id');
    }
}

