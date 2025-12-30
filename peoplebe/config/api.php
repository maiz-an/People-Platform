<?php

return [
    /*
    |--------------------------------------------------------------------------
    | API Base URL
    |--------------------------------------------------------------------------
    |
    | This is the base URL for your API. This will be used by the mobile app
    | to make requests to your backend.
    |
    */
    'base_url' => env('API_BASE_URL', 'http://localhost:8000/api'),

    /*
    |--------------------------------------------------------------------------
    | Poll Intervals
    |--------------------------------------------------------------------------
    |
    | These intervals control how often the mobile app polls for updates.
    | Values are in milliseconds.
    |
    */
    'poll_intervals' => [
        'notifications' => env('POLL_INTERVAL_NOTIFICATIONS', 10000), // 10 seconds
        'messages' => env('POLL_INTERVAL_MESSAGES', 5000), // 5 seconds
        'feeds' => env('POLL_INTERVAL_FEEDS', 30000), // 30 seconds
        'giveaways' => env('POLL_INTERVAL_GIVEAWAYS', 30000), // 30 seconds
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    |
    | Default pagination settings for API responses.
    |
    */
    'pagination' => [
        'per_page' => env('API_PER_PAGE', 20),
        'max_per_page' => env('API_MAX_PER_PAGE', 100),
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Rate limiting settings for API endpoints.
    |
    */
    'rate_limit' => [
        'per_minute' => env('API_RATE_LIMIT', 60),
    ],
];

