<?php

use Illuminate\Support\Facades\Log;

if (!function_exists('logError')) {
    function logError($name, $th)
    {
        Log::error($name, [
            'message' => $th->getMessage(),
            'file' => $th->getFile(),
            'line' => $th->getLine(),
            'trace' => $th->getTraceAsString(),
        ]);
    }
}

