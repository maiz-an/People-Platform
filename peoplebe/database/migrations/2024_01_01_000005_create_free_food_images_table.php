<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('free_food_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('food_id');
            $table->longBinary('food_image');
            $table->string('image_type', 50);
            $table->timestamps();
            
            $table->foreign('food_id')->references('id')->on('free_food')->onDelete('cascade');
            $table->index('food_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('free_food_images');
    }
};

