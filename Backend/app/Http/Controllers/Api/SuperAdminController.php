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
        $last7Days = collect(range(6, 0))->map(function ($days) {
            $date = now()->subDays($days)->toDateString();
            return [
                'date' => $date,
                'count' => Attendance::whereDate('date', $date)->where('status', 'present')->count(),
            ];
        });

        return response()->json([
            'total_companies' => Company::count(),
            'total_supervisors' => User::where('role', 'supervisor')->count(),
            'total_workers' => Worker::count(),
            'today_attendance' => Attendance::whereDate('date', now()->toDateString())->count(),
            'attendance_trend' => $last7Days,
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
        $date = $request->query('date', now()->toDateString());
        $companyId = $request->query('company_id');

        if ($companyId && $companyId !== 'all') {
            // Return all workers for this company with their attendance for this date
            $workers = Worker::where('company_id', $companyId)
                ->with(['team', 'attendances' => function($q) use ($date) {
                    $q->whereDate('date', $date)->with('supervisor');
                }])
                ->get();
            
            // Map to unified structure
            $records = $workers->map(function($worker) use ($date) {
                $attendance = $worker->attendances->first();
                return [
                    'id' => $attendance?->id,
                    'worker_id' => $worker->id,
                    'worker' => $worker,
                    'date' => $date,
                    'status' => $attendance?->status ?? 'not_marked',
                    'notes' => $attendance?->notes,
                    'supervisor' => $attendance?->supervisor,
                ];
            });
            
            return response()->json($records);
        }

        $query = Attendance::with(['worker', 'worker.company', 'worker.team', 'supervisor']);

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
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

    public function workerHistory($id)
    {
        $worker = Worker::with(['company', 'team'])->findOrFail($id);
        $attendance = Attendance::where('worker_id', $id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'worker' => $worker,
            'attendance' => $attendance
        ]);
    }

    public function exportAttendance(Request $request)
    {
        $startDate = $request->query('start_date', now()->toDateString());
        $endDate = $request->query('end_date', now()->toDateString());
        $companyId = $request->query('company_id');

        $workerQuery = Worker::with(['company', 'team']);
        if ($companyId && $companyId !== 'all') {
            $workerQuery->where('company_id', $companyId);
        }
        $workers = $workerQuery->get();

        $csvFileName = 'attendance_report_' . now()->timestamp . '.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $handle = fopen('php://temp', 'w+');
        fputcsv($handle, ['Date', 'Worker Name', 'Company', 'Team', 'Status', 'Notes']);

        foreach ($workers as $worker) {
            // If exporting a range, we might need a row per day. 
            // For now, if start == end (standard dashboard behavior), we do one row.
            $attendance = Attendance::where('worker_id', $worker->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->first();

            fputcsv($handle, [
                $startDate == $endDate ? $startDate : "$startDate to $endDate",
                $worker->name,
                $worker->company->name,
                $worker->team->name,
                $attendance?->status ?? 'Not Marked',
                $attendance?->notes ?? '-'
            ]);
        }

        rewind($handle);
        $csvContent = stream_get_contents($handle);
        fclose($handle);

        return response($csvContent, 200, $headers);
    }
}
