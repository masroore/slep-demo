<?php


namespace App\Http\Controllers;

use App\Http\Controllers\TwitterWSController;
use App\Models\Campania;
use App\Models\Busqueda;
use App\Models\Tweet;
use App\Models\YoutubeVideo;
use App\Models\GoogleNewsArticle;
use App\Models\FacebookPost;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use DB;

use App\Models\Empresa;

class EmpresaController extends Controller
{
    public function crearEmpresa(Request $request){
        $nuevaEmpresa = new Empresa;
        $nuevaEmpresa->nombre = $request->nombreEmpresa;
        $nuevaEmpresa->save();
    }
    public function GetAll(){
        return Empresa::all();
    }
    public function asociarEmpresa(Request $request){
        $user = User::where('id',auth()->id())->first();   
        $user->empresas()->sync($request->e_ids);

        return dd($request->all());
    }
}
?>