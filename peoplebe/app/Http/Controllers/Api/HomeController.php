<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Giveaway;
use App\Models\Feed;
use App\Models\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get available giveaways (excluding user's own)
        $giveaways = Giveaway::where('user_id', '!=', $user->id)
            ->where('status', 'normal')
            ->with(['user:id,name,profile_pic'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($giveaway) {
                return [
                    'id' => $giveaway->id,
                    'food_title' => $giveaway->food_title,
                    'description' => $giveaway->description,
                    'quantity' => $giveaway->quantity,
                    'pickup_time' => $giveaway->pickup_time,
                    'category' => $giveaway->category,
                    'latitude' => $giveaway->latitude,
                    'longitude' => $giveaway->longitude,
                    'expiration_time' => $giveaway->expiration_time,
                    'poster' => [
                        'id' => $giveaway->user->id,
                        'name' => $giveaway->user->name,
                        'profile_pic' => $giveaway->user->profile_pic ? base64_encode($giveaway->user->profile_pic) : null,
                    ],
                    'created_at' => $giveaway->created_at,
                ];
            });

        // Get unread notifications count
        $unreadNotifications = DB::table('notifications')
            ->where('poster_id', $user->id)
            ->where('is_read', 0)
            ->count();

        // Get unread messages count
        $unreadMessages = DB::table('messages')
            ->where('receiver_id', $user->id)
            ->where('is_read', 0)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'giveaways' => $giveaways,
                'unread_notifications' => $unreadNotifications,
                'unread_messages' => $unreadMessages,
                'poll_intervals' => config('api.poll_intervals'),
            ]
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $user = $request->user();

        if (empty($query)) {
            return response()->json([
                'success' => true,
                'data' => [
                    'giveaways' => [],
                    'feeds' => [],
                ]
            ]);
        }

        // Search giveaways
        $giveaways = Giveaway::where('user_id', '!=', $user->id)
            ->where('status', 'normal')
            ->where(function ($q) use ($query) {
                $q->where('food_title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->with(['user:id,name'])
            ->limit(10)
            ->get();

        // Search feeds
        $feeds = Feed::where('content', 'like', "%{$query}%")
            ->with(['user:id,name'])
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'giveaways' => $giveaways,
                'feeds' => $feeds,
            ]
        ]);
    }
}

