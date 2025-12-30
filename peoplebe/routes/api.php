<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\GiveawayController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\HomeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/organization/register', [AuthController::class, 'registerOrganization']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    
    // Home/Feed routes
    Route::get('/home', [HomeController::class, 'index']);
    Route::get('/feeds', [FeedController::class, 'index']);
    Route::post('/feeds', [FeedController::class, 'store']);
    Route::post('/feeds/{feed}/like', [FeedController::class, 'like']);
    Route::delete('/feeds/{feed}', [FeedController::class, 'destroy']);
    
    // Giveaway routes
    Route::get('/giveaways', [GiveawayController::class, 'index']);
    Route::post('/giveaways', [GiveawayController::class, 'store']);
    Route::get('/giveaways/{giveaway}', [GiveawayController::class, 'show']);
    Route::post('/giveaways/{giveaway}/request', [GiveawayController::class, 'requestItem']);
    Route::put('/giveaways/{giveaway}/status', [GiveawayController::class, 'updateStatus']);
    Route::delete('/giveaways/{giveaway}', [GiveawayController::class, 'destroy']);
    
    // Homeless support routes
    Route::get('/homeless-requests', [GiveawayController::class, 'homelessRequests']);
    Route::post('/homeless-requests', [GiveawayController::class, 'createHomelessRequest']);
    
    // Message routes
    Route::get('/messages', [MessageController::class, 'index']);
    Route::get('/messages/{user}', [MessageController::class, 'show']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::put('/messages/{message}/read', [MessageController::class, 'markAsRead']);
    Route::get('/messages/unread-count', [MessageController::class, 'unreadCount']);
    
    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/subscribe', [NotificationController::class, 'subscribe']);
    
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto']);
    Route::get('/dashboard', [ProfileController::class, 'dashboard']);
    
    // Organization routes
    Route::middleware(['auth:sanctum', 'organization'])->group(function () {
        Route::get('/organization/profile', [OrganizationController::class, 'profile']);
        Route::put('/organization/profile', [OrganizationController::class, 'updateProfile']);
        Route::get('/organization/employees', [OrganizationController::class, 'employees']);
        Route::post('/organization/employees', [OrganizationController::class, 'createEmployee']);
    });
    
    // Admin routes
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::put('/admin/users/{user}/status', [AdminController::class, 'updateUserStatus']);
        Route::get('/admin/organizations', [AdminController::class, 'organizations']);
        Route::put('/admin/organizations/{organization}/status', [AdminController::class, 'updateOrganizationStatus']);
        Route::get('/admin/analytics', [AdminController::class, 'analytics']);
        Route::get('/admin/giveaways', [AdminController::class, 'giveaways']);
    });
    
    // Search
    Route::get('/search', [HomeController::class, 'search']);
});

