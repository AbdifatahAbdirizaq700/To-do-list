export function SortOptions({ onSort }) {
    return (
      <select
        onChange={(e) => onSort(e.target.value)}
        className="border rounded-md p-2"
      >
        <option value="date">Sort by Date</option>
        <option value="priority">Sort by Priority</option>
        <option value="status">Sort by Status</option>
      </select>
    )
  }
  