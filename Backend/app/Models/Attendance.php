<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = ['worker_id', 'supervisor_id', 'date', 'status', 'notes'];

    protected $casts = [
        'date' => 'date',
    ];

    /**
     * Prepare a date for array / JSON serialization.
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d');
    }

    /**
     * Get the format for database stored dates.
     */
    public function getDateFormat()
    {
        return 'Y-m-d';
    }

    public function worker()
    {
        return $this->belongsTo(Worker::class);
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }
}
