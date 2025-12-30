<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id');
            $table->unsignedBigInteger('receiver_id');
            $table->text('message');
            $table->boolean('is_read')->default(0);
            $table->timestamp('timestamp')->useCurrent();
            $table->timestamps();
            
            $table->foreign('sender_id')->references('id')->on('login')->onDelete('cascade');
            $table->foreign('receiver_id')->references('id')->on('login')->onDelete('cascade');
            $table->index(['sender_id', 'receiver_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};

