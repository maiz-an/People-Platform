<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Login;
use App\Models\Organization;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:60|unique:login,email',
            'password' => 'required|string|min:8',
            'gender' => 'nullable|in:male,female,organization',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = Login::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'gender' => $request->gender ?? null,
            'user_type' => 'regular',
            'status' => 'pending',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully. Please verify your account.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'user_type' => $user->user_type,
                    'status' => $user->status,
                ],
                'token' => $token,
            ]
        ], 201);
    }

    public function registerOrganization(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'org_name' => 'required|string|max:255',
            'org_type' => 'required|string|max:255',
            'org_registration' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:organization,email',
            'phone' => 'required|string|max:25',
            'website' => 'nullable|string|max:255',
            'address' => 'required|string',
            'proof_registration' => 'required|string', // base64 encoded
            'services' => 'required|string',
            'org_password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $organization = Organization::create([
            'org_name' => $request->org_name,
            'org_type' => $request->org_type,
            'org_registration' => $request->org_registration,
            'email' => $request->email,
            'phone' => $request->phone,
            'website' => $request->website,
            'address' => $request->address,
            'proof_registration' => base64_decode($request->proof_registration),
            'services' => $request->services,
            'org_password' => Hash::make($request->org_password),
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Organization registered successfully. Please wait for admin approval.',
            'data' => [
                'organization' => [
                    'org_id' => $organization->org_id,
                    'org_name' => $organization->org_name,
                    'email' => $organization->email,
                    'status' => $organization->status,
                ]
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Try regular user login
        $user = Login::where('email', $request->email)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            if ($user->status === 'blocked') {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account has been blocked. Please contact support.'
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'user_type' => $user->user_type,
                        'status' => $user->status,
                        'gender' => $user->gender,
                    ],
                    'token' => $token,
                ]
            ]);
        }

        // Try organization login
        $organization = Organization::where('email', $request->email)->first();

        if ($organization && Hash::check($request->password, $organization->org_password)) {
            if ($organization->status === 'blocked') {
                return response()->json([
                    'success' => false,
                    'message' => 'Your organization account has been blocked. Please contact support.'
                ], 403);
            }

            if ($organization->status === 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Your organization account is pending approval.'
                ], 403);
            }

            // Create a login record for organization if it doesn't exist
            $user = Login::firstOrCreate(
                ['email' => $organization->email],
                [
                    'name' => $organization->org_name,
                    'password' => $organization->org_password,
                    'user_type' => 'organization',
                    'status' => 'allowed',
                ]
            );

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'user_type' => 'organization',
                        'status' => $user->status,
                    ],
                    'token' => $token,
                ]
            ]);
        }

        // Try admin login
        $admin = Admin::where('email', $request->email)->first();

        if ($admin && Hash::check($request->password, $admin->password)) {
            // Create a login record for admin if it doesn't exist
            $user = Login::firstOrCreate(
                ['email' => $admin->email],
                [
                    'name' => $admin->name,
                    'password' => $admin->password,
                    'user_type' => 'regular', // Admin uses regular user type
                    'status' => 'allowed',
                ]
            );

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'user_type' => 'admin',
                        'status' => $user->status,
                    ],
                    'token' => $token,
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'user_type' => $user->user_type,
                    'status' => $user->status,
                    'gender' => $user->gender,
                    'latitude' => $user->latitude,
                    'longitude' => $user->longitude,
                ]
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'gender' => 'sometimes|in:male,female,organization',
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($request->only(['name', 'gender', 'latitude', 'longitude']));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'user_type' => $user->user_type,
                    'status' => $user->status,
                    'gender' => $user->gender,
                ]
            ]
        ]);
    }

    public function forgotPassword(Request $request)
    {
        // Implementation for password reset
        return response()->json([
            'success' => false,
            'message' => 'Password reset functionality not implemented yet'
        ], 501);
    }

    public function resetPassword(Request $request)
    {
        // Implementation for password reset
        return response()->json([
            'success' => false,
            'message' => 'Password reset functionality not implemented yet'
        ], 501);
    }
}

