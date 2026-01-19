<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('admin123'),
            'role' => 'super_admin',
        ]);

        // 2. Create Sample Companies
        $companies = [
            ['name' => 'BuildPro North', 'location' => 'Delhi'],
            ['name' => 'BuildPro West', 'location' => 'Mumbai'],
        ];

        foreach ($companies as $companyData) {
            $company = \App\Models\Company::create($companyData);

            // 3. Create Supervisor for the Company
            User::create([
                'name' => $company->name . ' Supervisor',
                'email' => strtolower(str_replace(' ', '.', $company->name)) . '@company.com',
                'password' => bcrypt('password'),
                'role' => 'supervisor',
                'company_id' => $company->id,
            ]);

            // 4. Create Teams for the Company
            $teams = ['Operators', 'Loading', 'Maintenance'];
            foreach ($teams as $teamName) {
                $team = \App\Models\Team::create([
                    'name' => $teamName,
                    'company_id' => $company->id,
                ]);

                // 5. Create Sample Workers for each Team
                for ($i = 1; $i <= 3; $i++) {
                    \App\Models\Worker::create([
                        'name' => "Worker $i ($teamName)",
                        'phone' => '98765' . rand(10000, 99999),
                        'team_id' => $team->id,
                        'company_id' => $company->id,
                    ]);
                }
            }
        }
    }
}
