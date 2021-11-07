<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Medio extends Model
{
    use SoftDeletes;
    use HasFactory;

    protected $fillable = [
        'tipo_medio', 'alcance', 'url', 'nombre', 'imagen'
    ];
}
