<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->integer('age');
            $table->string('post', 100);
            $table->string('email', 100);
            $table->string('nic_passport', 20);
            $table->text('address');
            $table->longBinary('photo');
            $table->unsignedBigInteger('organization_id');
            $table->timestamps();
            
            $table->foreign('organization_id')->references('org_id')->on('organization')->onDelete('cascade');
            $table->index('organization_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};

