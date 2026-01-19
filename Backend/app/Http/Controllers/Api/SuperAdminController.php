<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Models\Worker;
use App\Models\Attendance;
use Illuminate\Http\Request;

class SuperAdminController extends Controller
{
    public function dashboardStats()
    {
        return response()->json([
            'total_companies' => Company::count(),
            'total_supervisors' => User::where('role', 'supervisor')->count(),
            'total_workers' => Worker::count(),
            'today_attendance' => Attendance::whereDate('date', now()->toDateString())->count(),
        ]);
    }

    public function companies()
    {
        return response()->json(Company::withCount(['users', 'workers'])->get());
    }

    public function createCompany(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        $company = Company::create($validated);
        return response()->json($company, 201);
    }

    public function supervisors()
    {
        return response()->json(User::where('role', 'supervisor')->with('company')->get());
    }

    public function createSupervisor(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'company_id' => 'required|exists:companies,id',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $validated['role'] = 'supervisor';

        $user = User::create($validated);
        return response()->json($user, 201);
    }

    public function updateCompany(Request $request, $id)
    {
        $company = Company::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        $company->update($validated);
        return response()->json($company);
    }

    public function deleteCompany($id)
    {
        $company = Company::findOrFail($id);
        $company->delete();
        return response()->json(['message' => 'Company deleted successfully']);
    }

    public function updateSupervisor(Request $request, $id)
    {
        $user = User::where('role', 'supervisor')->findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$id,
            'password' => 'nullable|min:6',
            'company_id' => 'required|exists:companies,id',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);
        return response()->json($user);
    }

    public function deleteSupervisor($id)
    {
        $user = User::where('role', 'supervisor')->findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Supervisor deleted successfully']);
    }

    public function allWorkers()
    {
        return response()->json(Worker::with(['company', 'team'])->get());
    }

    public function updateWorker(Request $request, $id)
    {
        $worker = Worker::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string',
            'company_id' => 'required|exists:companies,id',
            'team_id' => 'required|exists:teams,id',
        ]);

        $worker->update($validated);
        return response()->json($worker);
    }

    public function deleteWorker($id)
    {
        $worker = Worker::findOrFail($id);
        $worker->delete();
        return response()->json(['message' => 'Worker deleted successfully']);
    }

    public function allTeams()
    {
        return response()->json(\App\Models\Team::with('company')->get());
    }

    public function allAttendance(Request $request)
    {
        $query = Attendance::with(['worker', 'worker.company', 'worker.team', 'supervisor']);

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('company_id') && $request->company_id !== 'all') {
            $query->whereHas('worker', function($q) use ($request) {
                $q->where('company_id', $request->company_id);
            });
        }

        return response()->json($query->orderBy('date', 'desc')->get());
    }

    public function updateAttendance(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:present,absent,half_day',
            'notes' => 'nullable|string',
        ]);

        $attendance->update($validated);
        return response()->json($attendance);
    }

    public function deleteAttendance($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();
        return response()->json(['message' => 'Attendance record deleted successfully']);
    }
}
