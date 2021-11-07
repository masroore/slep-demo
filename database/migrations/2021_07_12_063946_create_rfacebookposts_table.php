<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRFacebookPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('r_facebook_posts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('url');
            $table->integer('likes');
            $table->integer('comments');
            $table->integer('shares');
            $table->text('message');
            $table->text('image_url');
            $table->dateTime('date',0);
            $table->integer('followers');
            $table->text('autor_url');
            $table->text('autor');

            //Definicion de clave foranea de una busqueda
            $table->biginteger('busqueda_id')->unsigned();            
            $table->foreign('busqueda_id')->references('id')->on('busquedas');
            $table->string('tags')->default('');

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
        Schema::dropIfExists('r_facebook_posts');
    }
}
