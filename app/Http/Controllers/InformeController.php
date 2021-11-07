<?php


namespace App\Http\Controllers;

use App\Http\Controllers\TwitterWSController;
use App\Models\Campania;
use App\Models\Busqueda;
use App\Models\Tweet;
use App\Models\YoutubeVideo;
use App\Models\GoogleNewsArticle;
use App\Models\FacebookPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use DB;

class InformeController extends Controller
{
    public function informeById($id){
        if($id[0] == 'c'){
            //Se trata de una campaña
            $id = substr($id, 1);
            $data = Campania::where('id', $id)->get();   
            $c = Campania::where('id',$id)->first();
            $informe_busquedas = $c->busquedas;

            $can_informe=true;

            foreach($informe_busquedas as &$busqueda){
                $busqueda->n_resultados()>=3?null:$can_informe=false;
            }

            if($can_informe){
                return view('informe', compact('data', 'informe_busquedas'));  
            }
            return view('successonboarding', compact('can_informe'));
        }else{
            //Se trata de una busqueda
        }
    }
}
?>