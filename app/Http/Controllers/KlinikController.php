<?php

namespace App\Http\Controllers;

use App\Models\Klinik;
use Illuminate\Http\Request;
use Inertia\Inertia;
use RealRashid\SweetAlert\Facades\Alert;

class KlinikController extends Controller
{
    public function index(){
        $data = Klinik::all();
        return Inertia::render('Admin/Klinik',[
            'data' => $data
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|max:2048',
            'kategori' => 'required',
        ]);

        $image = $request->file('image');
        try {
            if($image){
                $image_name = $image->getClientOriginalName();
                $image->move(public_path('klinik-images'), $image_name);
            }
            Klinik::create([
                'name' => $request->name,
                'image' => url('klinik-images/' . $image_name), // Menghasilkan URL lengkap
                'kategori' => $request->kategori,
            ]);            

            return response()->json(['success' => true, 'message' => 'Data Berhasil Ditambahkan']);
        } catch (\Throwable $th) {
            return response()->json(['success' => false, 'message' => $th->getMessage()]);
        }
    }

    public function destroy($id){
        $klinik = Klinik::find($id);
        $klinik->delete();
        Alert::success('Success', 'Data Berhasil Dihapus');
        return response()->json(['success' => true, 'message' => 'Data Berhasil Dihapus']);
    }

    public function booking(Request $request){
        $klinik = Klinik::find($request->klinik_id);
        $klinik->limit = $klinik->limit - 1;
        $klinik->save();
        return response()->json(['success' => true, 'message' => 'Data Berhasil Dibooking']);
    }
}
