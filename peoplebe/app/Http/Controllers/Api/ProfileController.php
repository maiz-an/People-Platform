<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Login;
use App\Models\Giveaway;
use App\Models\Feed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $user->load(['giveaways', 'feeds']);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'gender' => $user->gender,
                    'user_type' => $user->user_type,
                    'status' => $user->status,
                    'latitude' => $user->latitude,
                    'longitude' => $user->longitude,
                    'profile_pic' => $user->profile_pic ? base64_encode($user->profile_pic) : null,
                    'created_at' => $user->created_at,
                ]
            ]
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:male,female,organization',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
            'password' => 'sometimes|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->only(['name', 'gender', 'latitude', 'longitude']);

        if ($request->has('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'gender' => $user->gender,
                    'user_type' => $user->user_type,
                    'status' => $user->status,
                ]
            ]
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profile_pic' => 'required|string', // base64 encoded
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $user->update([
            'profile_pic' => base64_decode($request->profile_pic)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile picture updated successfully'
        ]);
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();

        $myGiveaways = Giveaway::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($giveaway) {
                return [
                    'id' => $giveaway->id,
                    'food_title' => $giveaway->food_title,
                    'status' => $giveaway->status,
                    'category' => $giveaway->category,
                    'created_at' => $giveaway->created_at,
                ];
            });

        $myFeeds = Feed::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($feed) {
                return [
                    'id' => $feed->feed_id,
                    'content' => $feed->content,
                    'likes_count' => $feed->likes_count,
                    'created_at' => $feed->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'giveaways' => $myGiveaways,
                'feeds' => $myFeeds,
            ]
        ]);
    }
}

