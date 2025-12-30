<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Giveaway;
use App\Models\GiveawayImage;
use App\Models\Notification;
use App\Models\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class GiveawayController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $category = $request->get('category');
        $perPage = $request->get('per_page', config('api.pagination.per_page'));

        $query = Giveaway::where('user_id', '!=', $user->id)
            ->where('status', 'normal')
            ->with(['user:id,name,profile_pic']);

        if ($category) {
            $query->where('category', $category);
        }

        $giveaways = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $giveaways->getCollection()->transform(function ($giveaway) {
            return [
                'id' => $giveaway->id,
                'food_title' => $giveaway->food_title,
                'description' => $giveaway->description,
                'quantity' => $giveaway->quantity,
                'pickup_time' => $giveaway->pickup_time,
                'pickup_instruction' => $giveaway->pickup_instruction,
                'latitude' => $giveaway->latitude,
                'longitude' => $giveaway->longitude,
                'expiration_time' => $giveaway->expiration_time,
                'status' => $giveaway->status,
                'category' => $giveaway->category,
                'poster' => [
                    'id' => $giveaway->user->id,
                    'name' => $giveaway->user->name,
                    'profile_pic' => $giveaway->user->profile_pic ? base64_encode($giveaway->user->profile_pic) : null,
                ],
                'created_at' => $giveaway->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $giveaways
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'food_title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|string',
            'pickup_time' => 'nullable|string|max:50',
            'pickup_instruction' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'category' => 'required|in:food,non-food,homeless',
            'show_up_duration' => 'nullable|numeric|min:1',
            'images' => 'nullable|array',
            'images.*' => 'string', // base64 encoded
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $showUpDuration = $request->show_up_duration ?? 24; // Default 24 hours

        $giveaway = Giveaway::create([
            'user_id' => $user->id,
            'food_title' => $request->food_title,
            'description' => $request->description,
            'quantity' => $request->quantity,
            'pickup_time' => $request->pickup_time,
            'pickup_instruction' => $request->pickup_instruction,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'category' => $request->category,
            'expiration_time' => now()->addHours($showUpDuration),
        ]);

        // Save images if provided
        if ($request->has('images') && is_array($request->images)) {
            foreach ($request->images as $image) {
                GiveawayImage::create([
                    'food_id' => $giveaway->id,
                    'food_image' => base64_decode($image),
                    'image_type' => 'image/jpeg',
                ]);
            }
        }

        // Notify nearby users (simplified - you can enhance this)
        $this->notifyNearbyUsers($giveaway, $user);

        return response()->json([
            'success' => true,
            'message' => 'Giveaway created successfully',
            'data' => [
                'giveaway' => [
                    'id' => $giveaway->id,
                    'food_title' => $giveaway->food_title,
                    'description' => $giveaway->description,
                    'category' => $giveaway->category,
                    'expiration_time' => $giveaway->expiration_time,
                    'created_at' => $giveaway->created_at,
                ]
            ]
        ], 201);
    }

    public function show(Request $request, Giveaway $giveaway)
    {
        $giveaway->load(['user:id,name,profile_pic', 'images']);

        $images = $giveaway->images->map(function ($image) {
            return [
                'id' => $image->id,
                'image' => base64_encode($image->food_image),
                'image_type' => $image->image_type,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'giveaway' => [
                    'id' => $giveaway->id,
                    'food_title' => $giveaway->food_title,
                    'description' => $giveaway->description,
                    'quantity' => $giveaway->quantity,
                    'pickup_time' => $giveaway->pickup_time,
                    'pickup_instruction' => $giveaway->pickup_instruction,
                    'latitude' => $giveaway->latitude,
                    'longitude' => $giveaway->longitude,
                    'expiration_time' => $giveaway->expiration_time,
                    'status' => $giveaway->status,
                    'category' => $giveaway->category,
                    'images' => $images,
                    'poster' => [
                        'id' => $giveaway->user->id,
                        'name' => $giveaway->user->name,
                        'profile_pic' => $giveaway->user->profile_pic ? base64_encode($giveaway->user->profile_pic) : null,
                    ],
                    'created_at' => $giveaway->created_at,
                ]
            ]
        ]);
    }

    public function requestItem(Request $request, Giveaway $giveaway)
    {
        $user = $request->user();

        if ($giveaway->user_id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot request your own item'
            ], 400);
        }

        if ($giveaway->status !== 'normal') {
            return response()->json([
                'success' => false,
                'message' => 'This item is no longer available'
            ], 400);
        }

        // Create notification
        $notification = Notification::create([
            'poster_id' => $giveaway->user_id,
            'requester_id' => $user->id,
            'food_id' => $giveaway->id,
            'message' => "{$user->name} requested your item: {$giveaway->food_title}",
            'is_read' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Request sent successfully',
            'data' => [
                'notification_id' => $notification->id,
            ]
        ]);
    }

    public function updateStatus(Request $request, Giveaway $giveaway)
    {
        $user = $request->user();

        if ($giveaway->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:normal,holded,completed,rejected,expired',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $oldStatus = $giveaway->status;
        $giveaway->update(['status' => $request->status]);

        // If status changed to 'holded', send message to requester
        if ($request->status === 'holded' && $oldStatus !== 'holded') {
            $notification = Notification::where('food_id', $giveaway->id)
                ->where('poster_id', $user->id)
                ->where('is_read', 0)
                ->first();

            if ($notification) {
                // Create automatic message
                DB::table('messages')->insert([
                    'sender_id' => $user->id,
                    'receiver_id' => $notification->requester_id,
                    'message' => "I have placed the {$giveaway->food_title} on hold for you.",
                    'is_read' => 0,
                    'timestamp' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $notification->update(['is_read' => 1]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => [
                'giveaway' => [
                    'id' => $giveaway->id,
                    'status' => $giveaway->status,
                ]
            ]
        ]);
    }

    public function destroy(Request $request, Giveaway $giveaway)
    {
        $user = $request->user();

        if ($giveaway->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $giveaway->delete();

        return response()->json([
            'success' => true,
            'message' => 'Giveaway deleted successfully'
        ]);
    }

    public function homelessRequests(Request $request)
    {
        $user = $request->user();
        $perPage = $request->get('per_page', config('api.pagination.per_page'));

        $requests = Giveaway::where('category', 'homeless')
            ->where('status', 'normal')
            ->with(['user:id,name,profile_pic'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $requests
        ]);
    }

    public function createHomelessRequest(Request $request)
    {
        $request->merge(['category' => 'homeless']);
        return $this->store($request);
    }

    private function notifyNearbyUsers($giveaway, $poster)
    {
        if (!$giveaway->latitude || !$giveaway->longitude) {
            return;
        }

        $radius = 10; // 10 km radius

        // Find nearby users using Haversine formula
        $nearbyUsers = Login::selectRaw("
                id, name, email, latitude, longitude,
                (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
                cos(radians(longitude) - radians(?)) + 
                sin(radians(?)) * sin(radians(latitude)))) AS distance
            ", [$giveaway->latitude, $giveaway->longitude, $giveaway->latitude])
            ->having('distance', '<', $radius)
            ->where('id', '!=', $poster->id)
            ->where('status', 'allowed')
            ->get();

        foreach ($nearbyUsers as $nearbyUser) {
            Notification::create([
                'poster_id' => $poster->id,
                'requester_id' => $nearbyUser->id,
                'food_id' => $giveaway->id,
                'message' => "New {$giveaway->category} available near you: {$giveaway->food_title}",
                'is_read' => false,
            ]);
        }
    }
}

