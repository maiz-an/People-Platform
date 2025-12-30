<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feeds', function (Blueprint $table) {
            $table->id('feed_id');
            $table->unsignedBigInteger('user_id');
            $table->text('content');
            $table->longBinary('content_img')->nullable();
            $table->integer('likes_count')->default(0);
            $table->string('feed_type', 50)->default('community_feed');
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('login')->onDelete('cascade');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feeds');
    }
};

