<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;

    protected $table = 'likes';

    protected $fillable = [
        'user_id',
        'feed_id',
    ];

    public function user()
    {
        return $this->belongsTo(Login::class, 'user_id');
    }

    public function feed()
    {
        return $this->belongsTo(Feed::class, 'feed_id');
    }
}

