<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = [
        'poster_id',
        'requester_id',
        'food_id',
        'message',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }

    public function poster()
    {
        return $this->belongsTo(Login::class, 'poster_id');
    }

    public function requester()
    {
        return $this->belongsTo(Login::class, 'requester_id');
    }

    public function giveaway()
    {
        return $this->belongsTo(Giveaway::class, 'food_id');
    }
}

