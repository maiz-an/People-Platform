<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Login;
use App\Models\Organization;
use App\Models\Giveaway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function users(Request $request)
    {
        $perPage = $request->get('per_page', config('api.pagination.per_page'));
        $status = $request->get('status');

        $query = Login::query();

        if ($status) {
            $query->where('status', $status);
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function updateUserStatus(Request $request, Login $user)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:allowed,pending,blocked',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status,
                ]
            ]
        ]);
    }

    public function organizations(Request $request)
    {
        $perPage = $request->get('per_page', config('api.pagination.per_page'));
        $status = $request->get('status');

        $query = Organization::query();

        if ($status) {
            $query->where('status', $status);
        }

        $organizations = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $organizations
        ]);
    }

    public function updateOrganizationStatus(Request $request, Organization $organization)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,allowed,blocked',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $organization->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Organization status updated successfully',
            'data' => [
                'organization' => [
                    'org_id' => $organization->org_id,
                    'org_name' => $organization->org_name,
                    'email' => $organization->email,
                    'status' => $organization->status,
                ]
            ]
        ]);
    }

    public function analytics(Request $request)
    {
        $totalUsers = Login::count();
        $activeUsers = Login::where('status', 'allowed')->count();
        $pendingUsers = Login::where('status', 'pending')->count();
        $blockedUsers = Login::where('status', 'blocked')->count();

        $totalOrganizations = Organization::count();
        $allowedOrganizations = Organization::where('status', 'allowed')->count();
        $pendingOrganizations = Organization::where('status', 'pending')->count();

        $totalGiveaways = Giveaway::count();
        $activeGiveaways = Giveaway::where('status', 'normal')->count();
        $completedGiveaways = Giveaway::where('status', 'completed')->count();

        $totalFeeds = DB::table('feeds')->count();
        $totalMessages = DB::table('messages')->count();
        $totalNotifications = DB::table('notifications')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'users' => [
                    'total' => $totalUsers,
                    'active' => $activeUsers,
                    'pending' => $pendingUsers,
                    'blocked' => $blockedUsers,
                ],
                'organizations' => [
                    'total' => $totalOrganizations,
                    'allowed' => $allowedOrganizations,
                    'pending' => $pendingOrganizations,
                ],
                'giveaways' => [
                    'total' => $totalGiveaways,
                    'active' => $activeGiveaways,
                    'completed' => $completedGiveaways,
                ],
                'feeds' => [
                    'total' => $totalFeeds,
                ],
                'messages' => [
                    'total' => $totalMessages,
                ],
                'notifications' => [
                    'total' => $totalNotifications,
                ],
            ]
        ]);
    }

    public function giveaways(Request $request)
    {
        $perPage = $request->get('per_page', config('api.pagination.per_page'));
        $status = $request->get('status');

        $query = Giveaway::with(['user:id,name,email']);

        if ($status) {
            $query->where('status', $status);
        }

        $giveaways = $query->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $giveaways
        ]);
    }
}

