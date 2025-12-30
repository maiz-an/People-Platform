<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('login', function (Blueprint $table) {
            $table->id();
            $table->text('name');
            $table->string('email', 60)->unique();
            $table->text('password');
            $table->enum('gender', ['male', 'female', 'organization'])->nullable();
            $table->enum('user_type', ['regular', 'organization'])->default('regular');
            $table->enum('status', ['allowed', 'pending', 'blocked'])->default('pending');
            $table->longBinary('profile_pic')->nullable();
            $table->float('latitude')->nullable();
            $table->float('longitude')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('login');
    }
};

