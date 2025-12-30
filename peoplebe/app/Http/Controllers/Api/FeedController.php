<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feed;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FeedController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $perPage = $request->get('per_page', config('api.pagination.per_page'));

        $feeds = Feed::with(['user:id,name,profile_pic'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $feeds->getCollection()->transform(function ($feed) use ($user) {
            return [
                'id' => $feed->feed_id,
                'content' => $feed->content,
                'content_img' => $feed->content_img ? base64_encode($feed->content_img) : null,
                'likes_count' => $feed->likes_count,
                'feed_type' => $feed->feed_type,
                'is_liked' => $feed->isLikedBy($user->id),
                'user' => [
                    'id' => $feed->user->id,
                    'name' => $feed->user->name,
                    'profile_pic' => $feed->user->profile_pic ? base64_encode($feed->user->profile_pic) : null,
                ],
                'created_at' => $feed->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $feeds
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'content_img' => 'nullable|string', // base64 encoded
            'feed_type' => 'nullable|string|in:community_feed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $contentImg = null;

        if ($request->has('content_img') && !empty($request->content_img)) {
            $contentImg = base64_decode($request->content_img);
        }

        $feed = Feed::create([
            'user_id' => $user->id,
            'content' => $request->content,
            'content_img' => $contentImg,
            'feed_type' => $request->feed_type ?? 'community_feed',
            'likes_count' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Feed posted successfully',
            'data' => [
                'feed' => [
                    'id' => $feed->feed_id,
                    'content' => $feed->content,
                    'content_img' => $feed->content_img ? base64_encode($feed->content_img) : null,
                    'likes_count' => $feed->likes_count,
                    'feed_type' => $feed->feed_type,
                    'created_at' => $feed->created_at,
                ]
            ]
        ], 201);
    }

    public function like(Request $request, Feed $feed)
    {
        $user = $request->user();

        $like = Like::where('user_id', $user->id)
            ->where('feed_id', $feed->feed_id)
            ->first();

        if ($like) {
            // Unlike
            $like->delete();
            $feed->decrement('likes_count');
            $isLiked = false;
        } else {
            // Like
            Like::create([
                'user_id' => $user->id,
                'feed_id' => $feed->feed_id,
            ]);
            $feed->increment('likes_count');
            $isLiked = true;
        }

        return response()->json([
            'success' => true,
            'message' => $isLiked ? 'Feed liked' : 'Feed unliked',
            'data' => [
                'is_liked' => $isLiked,
                'likes_count' => $feed->fresh()->likes_count,
            ]
        ]);
    }

    public function destroy(Request $request, Feed $feed)
    {
        $user = $request->user();

        if ($feed->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $feed->delete();

        return response()->json([
            'success' => true,
            'message' => 'Feed deleted successfully'
        ]);
    }
}

