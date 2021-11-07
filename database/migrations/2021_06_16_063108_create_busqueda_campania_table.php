<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBusquedaCampaniaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('busqueda_campania', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('busqueda_id');
            $table->unsignedBigInteger('campania_id');

            $table->foreign('busqueda_id')->references('id')->on('busquedas')->onDelete('cascade');
            $table->foreign('campania_id')->references('id')->on('campanias')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('busquedas_campanias');
    }
}
