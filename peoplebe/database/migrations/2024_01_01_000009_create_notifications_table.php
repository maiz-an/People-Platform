<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('poster_id');
            $table->unsignedBigInteger('requester_id');
            $table->unsignedBigInteger('food_id')->nullable();
            $table->text('message');
            $table->boolean('is_read')->default(0);
            $table->timestamps();
            
            $table->foreign('poster_id')->references('id')->on('login')->onDelete('cascade');
            $table->foreign('requester_id')->references('id')->on('login')->onDelete('cascade');
            $table->foreign('food_id')->references('id')->on('free_food')->onDelete('cascade');
            $table->index('poster_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};

