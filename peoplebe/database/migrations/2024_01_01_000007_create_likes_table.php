<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('feed_id');
            $table->timestamps();
            
            $table->unique(['user_id', 'feed_id']);
            $table->foreign('user_id')->references('id')->on('login')->onDelete('cascade');
            $table->foreign('feed_id')->references('feed_id')->on('feeds')->onDelete('cascade');
            $table->index('feed_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};

