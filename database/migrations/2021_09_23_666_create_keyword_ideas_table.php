<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKeywordIdeasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('keyword_ideas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->json('json_output');
            //Definicion de clave foranea de una busqueda
            $table->biginteger('busqueda_id')->unsigned();            
            $table->foreign('busqueda_id')->references('id')->on('busquedas');
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
        Schema::dropIfExists('keyword_ideas');
    }
}
