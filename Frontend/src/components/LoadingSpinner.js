import React from 'react';
import './LoadingSpinner.css';

export function LoadingSpinner() {
    return (
        <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
        </div>
    );
}

export function TableSkeleton({ rows = 5, columns = 6 }) {
    return (
        <div className="table-skeleton">
            <table>
                <thead>
                    <tr>
                        {[...Array(columns)].map((_, i) => (
                            <th key={i}>
                                <div className="skeleton skeleton-header"></div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(rows)].map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {[...Array(columns)].map((_, colIndex) => (
                                <td key={colIndex}>
                                    <div className="skeleton skeleton-cell"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="stat-card">
            <div className="skeleton skeleton-number"></div>
            <div className="skeleton skeleton-text"></div>
        </div>
    );
}
