<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $table = 'messages';

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
        'is_read',
        'timestamp',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'timestamp' => 'datetime',
        ];
    }

    public function sender()
    {
        return $this->belongsTo(Login::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(Login::class, 'receiver_id');
    }
}

