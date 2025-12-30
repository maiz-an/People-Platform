<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feed extends Model
{
    use HasFactory;

    protected $table = 'feeds';
    protected $primaryKey = 'feed_id';

    protected $fillable = [
        'user_id',
        'content',
        'content_img',
        'likes_count',
        'feed_type',
    ];

    protected $hidden = [
        'content_img',
    ];

    public function user()
    {
        return $this->belongsTo(Login::class, 'user_id');
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'feed_id');
    }

    public function isLikedBy($userId)
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }
}

