<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Worker;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SupervisorController extends Controller
{
    public function companyStats(Request $request)
    {
        $companyId = $request->user()->company_id;
        
        $teamStats = Team::where('company_id', $companyId)
            ->withCount(['workers', 'workers as present_today_count' => function ($query) {
                $query->whereHas('attendances', function ($q) {
                    $q->whereDate('date', now()->toDateString())->where('status', 'present');
                });
            }])->get();

        return response()->json([
            'total_teams' => Team::where('company_id', $companyId)->count(),
            'total_workers' => Worker::where('company_id', $companyId)->count(),
            'today_attendance' => Attendance::whereHas('worker', function($q) use ($companyId) {
                $q->where('company_id', $companyId);
            })->whereDate('date', now()->toDateString())->count(),
            'team_stats' => $teamStats,
        ]);
    }

    public function teams(Request $request)
    {
        return response()->json(Team::where('company_id', $request->user()->company_id)->withCount('workers')->get());
    }

    public function workers(Request $request)
    {
        $query = Worker::where('company_id', $request->user()->company_id)->with('team');
        
        if ($request->has('team_id')) {
            $query->where('team_id', $request->team_id);
        }

        return response()->json($query->get());
    }

    public function storeAttendance(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.worker_id' => 'required|exists:workers,id',
            'attendances.*.status' => 'required|in:present,absent,half_day',
            'attendances.*.notes' => 'nullable|string',
        ]);

        $results = [];
        $date = Carbon::parse($validated['date'])->toDateString();

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $date, $request, &$results) {
            // Remove duplicates from request if any
            $uniqueAttendances = collect($validated['attendances'])->unique('worker_id');

            foreach ($uniqueAttendances as $data) {
                $attendance = Attendance::updateOrCreate(
                    [
                        'worker_id' => (int)$data['worker_id'],
                        'date' => $date,
                    ],
                    [
                        'supervisor_id' => $request->user()->id,
                        'status' => $data['status'],
                        'notes' => $data['notes'] ?? null,
                    ]
                );
                $results[] = $attendance;
            }
        });

        return response()->json([
            'message' => 'Attendance recorded successfully',
            'data' => $results
        ]);
    }

    public function attendanceHistory(Request $request)
    {
        $companyId = $request->user()->company_id;
        $date = $request->query('date', now()->toDateString());

        $attendance = Attendance::whereHas('worker', function($q) use ($companyId) {
            $q->where('company_id', $companyId);
        })
        ->with(['worker', 'worker.team'])
        ->whereDate('date', $date)
        ->get();

        return response()->json($attendance);
    }

    public function storeWorker(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'team_id' => 'required|exists:teams,id',
        ]);

        $worker = Worker::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'team_id' => $validated['team_id'],
            'company_id' => $request->user()->company_id,
        ]);

        return response()->json(['message' => 'Worker added successfully', 'worker' => $worker]);
    }

    public function updateWorker(Request $request, $id)
    {
        $worker = Worker::where('company_id', $request->user()->company_id)->findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'team_id' => 'required|exists:teams,id',
        ]);

        $worker->update($validated);

        return response()->json(['message' => 'Worker updated successfully', 'worker' => $worker]);
    }

    public function destroyWorker(Request $request, $id)
    {
        $worker = Worker::where('company_id', $request->user()->company_id)->findOrFail($id);
        $worker->delete();

        return response()->json(['message' => 'Worker deleted successfully']);
    }

    public function workerHistory(Request $request, $id)
    {
        $companyId = $request->user()->company_id;
        $worker = Worker::where('company_id', $companyId)->with(['team'])->findOrFail($id);
        
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
        $companyId = $request->user()->company_id;

        $workers = Worker::where('company_id', $companyId)
            ->with(['team'])
            ->get();

        $csvFileName = 'company_attendance_report_' . now()->timestamp . '.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $handle = fopen('php://temp', 'w+');
        fputcsv($handle, ['Date', 'Worker Name', 'Team', 'Status', 'Notes']);

        foreach ($workers as $worker) {
            $attendance = Attendance::where('worker_id', $worker->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->first();

            fputcsv($handle, [
                $startDate == $endDate ? $startDate : "$startDate to $endDate",
                $worker->name,
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
