import React from 'react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

function ExportButton({ data, filename, buttonText = "Export to Excel" }) {
    const exportToExcel = () => {
        if (!data || data.length === 0) {
            toast.error('No data to export');
            return;
        }

        try {
            // Create a new workbook
            const wb = XLSX.utils.book_new();

            // Convert data to worksheet
            const ws = XLSX.utils.json_to_sheet(data);

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

            // Generate file name with timestamp
            const timestamp = new Date().toISOString().split('T')[0];
            const fileName = `${filename}_${timestamp}.xlsx`;

            // Save file
            XLSX.writeFile(wb, fileName);

            toast.success('Exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export data');
        }
    };

    return (
        <button
            className="btn-export"
            onClick={exportToExcel}
            title="Export to Excel"
        >
            <i className="fas fa-file-excel"></i> {buttonText}
        </button>
    );
}

export default ExportButton;
