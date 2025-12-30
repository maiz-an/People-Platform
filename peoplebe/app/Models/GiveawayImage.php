<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiveawayImage extends Model
{
    use HasFactory;

    protected $table = 'free_food_images';

    protected $fillable = [
        'food_id',
        'food_image',
        'image_type',
    ];

    public function giveaway()
    {
        return $this->belongsTo(Giveaway::class, 'food_id');
    }
}

