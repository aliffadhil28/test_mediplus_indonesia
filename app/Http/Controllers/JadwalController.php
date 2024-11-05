<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Klinik;
use App\Models\Jadwal;
use App\Models\Booking;
use RealRashid\SweetAlert\Facades\Alert;

class JadwalController extends Controller
{
    public function index($id){
        return Inertia::render('Admin/Jadwal',[
            'klinik' => Klinik::find($id),
            'jadwal' => Jadwal::where('klinik_id', $id)->get(),
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'tanggal' => 'required|date',
            'klinik_id' => 'required',
            'quota' => 'required|integer',
            'harga' => 'required|integer',
        ]);
        Jadwal::create([
            'klinik_id' => $request->klinik_id,
            'tanggal' => $request->tanggal,
            'quota' => $request->quota,
            'harga' => $request->harga,
        ]);
        return response()->json(['success'=> true,'message' => 'Jadwal Berhasil Ditambahkan']);
    }

    public function destroy($id){
        $jadwal = Jadwal::find($id);
        $jadwal->delete();
        return response()->json(['success'=> true,'message' => 'Jadwal Berhasil Dihapus']);
    }

    public function booking($id){
        $jadwal = Jadwal::find($id);
        if($jadwal->quota == 0){
            return response()->json(['success'=> false,'message' => 'Jadwal Sudah Penuh']);
        }
        $jadwal->quota = $jadwal->quota - 1;
        $jadwal->save();

        $check = Booking::where('jadwal_id', $id)->where('user_id', auth()->user()->id)->first();
        if($check){
            return response()->json(['success'=> false,'message' => 'Jadwal Sudah Di Booking']);
        }
        $booking = new Booking();
        $booking->user_id = auth()->user()->id;
        $booking->jadwal_id = $jadwal->id;
        $booking->save();

        return response()->json(['success'=> true,'message' => 'Booking Berhasil Ditambahkan']);
    }
}
