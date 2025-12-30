<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $perPage = $request->get('per_page', config('api.pagination.per_page'));

        $notifications = Notification::where('poster_id', $user->id)
            ->with(['requester:id,name,profile_pic', 'giveaway:id,food_title'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $notifications->getCollection()->transform(function ($notification) {
            return [
                'id' => $notification->id,
                'message' => $notification->message,
                'is_read' => $notification->is_read,
                'requester' => [
                    'id' => $notification->requester->id,
                    'name' => $notification->requester->name,
                    'profile_pic' => $notification->requester->profile_pic ? base64_encode($notification->requester->profile_pic) : null,
                ],
                'giveaway' => $notification->giveaway ? [
                    'id' => $notification->giveaway->id,
                    'food_title' => $notification->giveaway->food_title,
                ] : null,
                'created_at' => $notification->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    public function markAsRead(Request $request, Notification $notification)
    {
        $user = $request->user();

        if ($notification->poster_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $notification->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read'
        ]);
    }

    public function unreadCount(Request $request)
    {
        $user = $request->user();

        $count = Notification::where('poster_id', $user->id)
            ->where('is_read', 0)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'unread_count' => $count,
            ]
        ]);
    }

    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'endpoint' => 'required|string',
            'keys' => 'required|array',
            'keys.p256dh' => 'required|string',
            'keys.auth' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        Subscription::updateOrCreate(
            ['user_id' => $user->id],
            [
                'endpoint' => $request->endpoint,
                'p256dh' => $request->keys['p256dh'],
                'auth' => $request->keys['auth'],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Subscription saved successfully'
        ]);
    }
}

