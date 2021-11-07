<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOnboardingBusquedasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('onboarding_busquedas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('estado');
            $table->string('nombre_busqueda');
            $table->string('palabra_busqueda');
            $table->date('fecha_inicial');
            $table->date('fecha_final');
            $table->biginteger('campania_id')->unsigned();    
            $table->biginteger('user_id')->unsigned();    
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
        Schema::dropIfExists('onboarding_busquedas');
    }
}
