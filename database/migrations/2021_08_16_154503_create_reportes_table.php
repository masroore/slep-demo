<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reportes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('fuente');
            $table->text('link');
            $table->string('autor');
            $table->string('fecha');
            $table->string('hora');
            $table->integer('seguidores');
            $table->integer('interacciones');
            $table->integer('viralizaciones');
            $table->string('impacto');
            $table->string('etiquetas');
            $table->text('mensaje');
            $table->integer('id_db');
            $table->string('keywords_busqueda');
            $table->string('nombre_busqueda');
            $table->string('nombre_campania');
             //Definicion de clave foranea de una busqueda
             $table->biginteger('busqueda_id')->unsigned();            
             $table->foreign('busqueda_id')->references('id')->on('busquedas');
             //Definicion de clave foranea de una busqueda
             $table->biginteger('campania_id')->unsigned();            
             $table->foreign('campania_id')->references('id')->on('campanias');
            $table->string('keywords_campania');
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
        Schema::dropIfExists('reportes');
    }
}
