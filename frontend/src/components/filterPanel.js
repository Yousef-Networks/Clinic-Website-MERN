import React from 'react';

const FilterPanel = ({ onFilter }) => {
  const [date, setDate] = React.useState('');
  const [status, setStatus] = React.useState('');

  const handleFilter = () => {
    onFilter({ date, status });
  };

  return (
    <div className="form-container">
      <label>
        Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>
        Status:
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="available">Available</option>
        </select>
      </label>
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default FilterPanel;