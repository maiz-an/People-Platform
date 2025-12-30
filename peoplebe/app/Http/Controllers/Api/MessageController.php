<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get distinct user IDs from messages
        $userIds = DB::table('messages')
            ->select('sender_id as user_id')
            ->where('receiver_id', $user->id)
            ->union(
                DB::table('messages')
                    ->select('receiver_id as user_id')
                    ->where('sender_id', $user->id)
            )
            ->distinct()
            ->pluck('user_id');

        $users = Login::whereIn('id', $userIds)
            ->get()
            ->map(function ($chatUser) use ($user) {
                // Get last message
                $lastMessage = Message::where(function ($q) use ($user, $chatUser) {
                    $q->where('sender_id', $user->id)->where('receiver_id', $chatUser->id);
                })->orWhere(function ($q) use ($user, $chatUser) {
                    $q->where('sender_id', $chatUser->id)->where('receiver_id', $user->id);
                })->orderBy('timestamp', 'desc')->first();

                // Get unread count
                $unreadCount = Message::where('sender_id', $chatUser->id)
                    ->where('receiver_id', $user->id)
                    ->where('is_read', 0)
                    ->count();

                return [
                    'id' => $chatUser->id,
                    'name' => $chatUser->name,
                    'profile_pic' => $chatUser->profile_pic ? base64_encode($chatUser->profile_pic) : null,
                    'last_message' => $lastMessage ? $lastMessage->message : null,
                    'last_message_time' => $lastMessage ? $lastMessage->timestamp : null,
                    'is_sender' => $lastMessage ? $lastMessage->sender_id == $user->id : false,
                    'unread_count' => $unreadCount,
                ];
            })
            ->sortByDesc('last_message_time')
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $users,
            ]
        ]);
    }

    public function show(Request $request, Login $user)
    {
        $currentUser = $request->user();

        // Mark messages as read
        Message::where('sender_id', $user->id)
            ->where('receiver_id', $currentUser->id)
            ->where('is_read', 0)
            ->update(['is_read' => 1]);

        // Get all messages between current user and selected user
        $messages = Message::where(function ($query) use ($currentUser, $user) {
                $query->where('sender_id', $currentUser->id)
                      ->where('receiver_id', $user->id);
            })
            ->orWhere(function ($query) use ($currentUser, $user) {
                $query->where('sender_id', $user->id)
                      ->where('receiver_id', $currentUser->id);
            })
            ->orderBy('timestamp', 'asc')
            ->get()
            ->map(function ($message) use ($currentUser) {
                return [
                    'id' => $message->id,
                    'message' => $message->message,
                    'is_sender' => $message->sender_id == $currentUser->id,
                    'sender' => [
                        'id' => $message->sender->id,
                        'name' => $message->sender->name,
                    ],
                    'receiver' => [
                        'id' => $message->receiver->id,
                        'name' => $message->receiver->name,
                    ],
                    'is_read' => $message->is_read,
                    'timestamp' => $message->timestamp,
                    'created_at' => $message->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'profile_pic' => $user->profile_pic ? base64_encode($user->profile_pic) : null,
                ],
                'messages' => $messages,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|exists:login,id',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $sender = $request->user();

        if ($sender->id == $request->receiver_id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot send a message to yourself'
            ], 400);
        }

        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
            'is_read' => false,
            'timestamp' => now(),
        ]);

        $message->load(['sender:id,name', 'receiver:id,name']);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => [
                'message' => [
                    'id' => $message->id,
                    'message' => $message->message,
                    'sender' => [
                        'id' => $message->sender->id,
                        'name' => $message->sender->name,
                    ],
                    'receiver' => [
                        'id' => $message->receiver->id,
                        'name' => $message->receiver->name,
                    ],
                    'timestamp' => $message->timestamp,
                ]
            ]
        ], 201);
    }

    public function markAsRead(Request $request, Message $message)
    {
        $user = $request->user();

        if ($message->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $message->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Message marked as read'
        ]);
    }

    public function unreadCount(Request $request)
    {
        $user = $request->user();

        $count = Message::where('receiver_id', $user->id)
            ->where('is_read', 0)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'unread_count' => $count,
            ]
        ]);
    }
}

