<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrganizationController extends Controller
{
    public function profile(Request $request)
    {
        $user = $request->user();
        
        $organization = Organization::where('email', $user->email)->first();

        if (!$organization) {
            return response()->json([
                'success' => false,
                'message' => 'Organization not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'organization' => [
                    'org_id' => $organization->org_id,
                    'org_name' => $organization->org_name,
                    'org_type' => $organization->org_type,
                    'email' => $organization->email,
                    'phone' => $organization->phone,
                    'website' => $organization->website,
                    'address' => $organization->address,
                    'services' => $organization->services,
                    'status' => $organization->status,
                    'profile_completed' => $organization->profile_completed,
                    'profile_pic' => $organization->profile_pic ? base64_encode($organization->profile_pic) : null,
                ]
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $organization = Organization::where('email', $user->email)->first();

        if (!$organization) {
            return response()->json([
                'success' => false,
                'message' => 'Organization not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'org_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:25',
            'website' => 'sometimes|nullable|string|max:255',
            'address' => 'sometimes|string',
            'services' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $organization->update($request->only([
            'org_name', 'phone', 'website', 'address', 'services'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Organization profile updated successfully'
        ]);
    }

    public function employees(Request $request)
    {
        $user = $request->user();
        
        $organization = Organization::where('email', $user->email)->first();

        if (!$organization) {
            return response()->json([
                'success' => false,
                'message' => 'Organization not found'
            ], 404);
        }

        $employees = Employee::where('organization_id', $organization->org_id)
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'age' => $employee->age,
                    'post' => $employee->post,
                    'email' => $employee->email,
                    'nic_passport' => $employee->nic_passport,
                    'address' => $employee->address,
                    'photo' => $employee->photo ? base64_encode($employee->photo) : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'employees' => $employees,
            ]
        ]);
    }

    public function createEmployee(Request $request)
    {
        $user = $request->user();
        
        $organization = Organization::where('email', $user->email)->first();

        if (!$organization) {
            return response()->json([
                'success' => false,
                'message' => 'Organization not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'age' => 'required|integer',
            'post' => 'required|string|max:100',
            'email' => 'required|string|email|max:100',
            'nic_passport' => 'required|string|max:20',
            'address' => 'required|string',
            'photo' => 'required|string', // base64 encoded
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $employee = Employee::create([
            'name' => $request->name,
            'age' => $request->age,
            'post' => $request->post,
            'email' => $request->email,
            'nic_passport' => $request->nic_passport,
            'address' => $request->address,
            'photo' => base64_decode($request->photo),
            'organization_id' => $organization->org_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully',
            'data' => [
                'employee' => [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'post' => $employee->post,
                ]
            ]
        ], 201);
    }
}

