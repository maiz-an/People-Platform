<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organization', function (Blueprint $table) {
            $table->id('org_id');
            $table->string('org_name', 255);
            $table->string('org_type', 255);
            $table->string('org_registration', 255);
            $table->string('email', 255)->unique();
            $table->string('phone', 25);
            $table->string('website', 255)->nullable();
            $table->text('address');
            $table->longBinary('proof_registration');
            $table->text('services');
            $table->enum('status', ['pending', 'allowed', 'blocked'])->default('pending');
            $table->string('org_password', 255);
            $table->longBinary('profile_pic')->nullable();
            $table->boolean('profile_completed')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organization');
    }
};

