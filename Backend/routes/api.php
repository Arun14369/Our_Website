<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SuperAdminController;
use App\Http\Controllers\Api\SupervisorController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Super Admin Routes
    Route::middleware('can:is-super-admin')->group(function () {
        Route::get('/super-admin/stats', [SuperAdminController::class, 'dashboardStats']);
        Route::get('/super-admin/companies', [SuperAdminController::class, 'companies']);
        Route::post('/super-admin/companies', [SuperAdminController::class, 'createCompany']);
        Route::put('/super-admin/companies/{id}', [SuperAdminController::class, 'updateCompany']);
        Route::delete('/super-admin/companies/{id}', [SuperAdminController::class, 'deleteCompany']);
        
        Route::get('/super-admin/supervisors', [SuperAdminController::class, 'supervisors']);
        Route::post('/super-admin/supervisors', [SuperAdminController::class, 'createSupervisor']);
        Route::put('/super-admin/supervisors/{id}', [SuperAdminController::class, 'updateSupervisor']);
        Route::delete('/super-admin/supervisors/{id}', [SuperAdminController::class, 'deleteSupervisor']);

        Route::get('/super-admin/workers', [SuperAdminController::class, 'allWorkers']);
        Route::put('/super-admin/workers/{id}', [SuperAdminController::class, 'updateWorker']);
        Route::delete('/super-admin/workers/{id}', [SuperAdminController::class, 'deleteWorker']);
        Route::get('/super-admin/teams', [SuperAdminController::class, 'allTeams']);
        
        Route::get('/super-admin/attendance', [SuperAdminController::class, 'allAttendance']);
        Route::put('/super-admin/attendance/{id}', [SuperAdminController::class, 'updateAttendance']);
        Route::delete('/super-admin/attendance/{id}', [SuperAdminController::class, 'deleteAttendance']);
        Route::get('/super-admin/workers/{id}/history', [SuperAdminController::class, 'workerHistory']);
        Route::get('/super-admin/attendance/export', [SuperAdminController::class, 'exportAttendance']);
    });

    // Supervisor Routes
    Route::middleware('can:is-supervisor')->group(function () {
        Route::get('/supervisor/stats', [SupervisorController::class, 'companyStats']);
        Route::get('/supervisor/teams', [SupervisorController::class, 'teams']);
        Route::get('/supervisor/workers', [SupervisorController::class, 'workers']);
        Route::post('/supervisor/workers', [SupervisorController::class, 'storeWorker']);
        Route::put('/supervisor/workers/{id}', [SupervisorController::class, 'updateWorker']);
        Route::delete('/supervisor/workers/{id}', [SupervisorController::class, 'destroyWorker']);
        Route::post('/supervisor/attendance', [SupervisorController::class, 'storeAttendance']);
        Route::get('/supervisor/attendance-history', [SupervisorController::class, 'attendanceHistory']);
        Route::get('/supervisor/workers/{id}/history', [SupervisorController::class, 'workerHistory']);
        Route::get('/supervisor/attendance/export', [SupervisorController::class, 'exportAttendance']);
    });
});
