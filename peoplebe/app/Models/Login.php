<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Login extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'login';
    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'email',
        'password',
        'gender',
        'user_type',
        'status',
        'profile_pic',
        'latitude',
        'longitude',
    ];

    protected $hidden = [
        'password',
        'profile_pic',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function giveaways()
    {
        return $this->hasMany(Giveaway::class, 'user_id');
    }

    public function feeds()
    {
        return $this->hasMany(Feed::class, 'user_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'poster_id');
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'user_id');
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class, 'user_id');
    }
}

