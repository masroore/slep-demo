<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAsyncResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('async_results', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('code');
            $table->text('source');
            $table->text('status');
            //Definicion de clave foranea de una busqueda
            $table->biginteger('busqueda_id')->unsigned();            
            $table->foreign('busqueda_id')->references('id')->on('busquedas');
            $table->biginteger('user_id')->unsigned();            
            $table->foreign('user_id')->references('id')->on('users');

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
        Schema::dropIfExists('async_results');
    }
}
