<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceJsonResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        // chek if is /api/*
        $excludded_containing_endpoints =[
            '/register',
            '/pdf'
        ];


        foreach ($excludded_containing_endpoints as $endpoint) {
            if (strpos($request->getRequestUri(), $endpoint) !== false) {
                return $next($request);
            }
        }
        $request->headers->set('Accept', 'application/json');
        return $next($request);
    }
}
