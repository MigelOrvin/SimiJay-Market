<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class Role
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = Auth::user();

            
        if ($user->role === 'customer' && $request->user()->id == $request->route('id')) {
            return $next($request);
        }       

        if (in_array($user->role, $roles)) {
            return $next($request);
        }

        if ($request->isMethod('GET')) {
            return $next($request);
        }
  
        if ($request->isMethod('PUT')) {
            return $next($request);
        }
        
        abort(403, 'Unauthorized');
    }
}
