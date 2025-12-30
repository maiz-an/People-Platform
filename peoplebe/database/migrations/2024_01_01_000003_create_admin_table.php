<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin', function (Blueprint $table) {
            $table->id('Aid');
            $table->text('name');
            $table->string('email', 60)->unique();
            $table->text('password');
            $table->text('location');
            $table->text('address');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin');
    }
};

