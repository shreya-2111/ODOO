import React from 'react';

const Table = ({ headers = [], data = [], renderRow, emptyMessage = 'No records found' }) => {
  return (
    <div className="table-responsive table-erp">
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-4 text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
