<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColTagsResults extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tweets', function (Blueprint $table) {
            $table->string('tags')->default('');
        });
        Schema::table('youtube_videos', function (Blueprint $table) {
            $table->string('tags')->default('');
        });
        Schema::table('google_news_articles', function (Blueprint $table) {
            $table->string('tags')->default('');
        });
        Schema::table('facebook_posts', function (Blueprint $table) {
            $table->string('tags')->default('');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
