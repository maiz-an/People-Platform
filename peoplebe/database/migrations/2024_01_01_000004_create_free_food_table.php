<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('free_food', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('food_title', 255);
            $table->text('description')->nullable();
            $table->text('quantity');
            $table->string('pickup_time', 50)->nullable();
            $table->text('pickup_instruction')->nullable();
            $table->float('latitude')->nullable();
            $table->float('longitude')->nullable();
            $table->dateTime('expiration_time')->nullable();
            $table->enum('status', ['normal', 'holded', 'completed', 'rejected', 'expired'])->default('normal');
            $table->enum('category', ['food', 'non-food', 'homeless'])->default('food');
            $table->enum('report_category', [
                'Spam',
                'Inappropriate Content',
                'Fraud or Scam',
                'Expired or Invalid',
                'Safety Concerns',
                'Wrong Category',
                'Offensive to Homeless',
                'Other'
            ])->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('login')->onDelete('cascade');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('free_food');
    }
};

