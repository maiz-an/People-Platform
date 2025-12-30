<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Organization;

class EnsureUserIsOrganization
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        // Check if user is organization
        if ($user->user_type !== 'organization') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Organization access required.'
            ], 403);
        }

        // Verify organization exists and is allowed
        $organization = Organization::where('email', $user->email)->first();
        
        if (!$organization || $organization->status !== 'allowed') {
            return response()->json([
                'success' => false,
                'message' => 'Organization account not found or not approved.'
            ], 403);
        }

        return $next($request);
    }
}

