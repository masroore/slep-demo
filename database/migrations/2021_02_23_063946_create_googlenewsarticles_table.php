<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGoogleNewsArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('google_news_articles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('title');
            $table->text('link');
            $table->dateTime('published_date',0);
            $table->text('description');
            $table->text('source');

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
        Schema::dropIfExists('google_news_articles');
    }
}
