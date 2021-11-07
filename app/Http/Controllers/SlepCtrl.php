<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use \stdClass;

use DB;

class SlepCtrl extends Controller
{
    public function getMantenedores(){
        return view('dashboard.slep.mantenedores'); 
    }
    public function getReportes(){
        return view('dashboard.slep.reportes'); 
    }
}
?>