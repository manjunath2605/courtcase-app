import { Link } from "react-router-dom";

export default function CaseTable({ cases }) {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Court</th>
          <th>Case No</th>
          <th>Party</th>
          <th>Status</th>
          <th>Next Date</th>
        </tr>
      </thead>
      <tbody>
        {cases.map(c => (
          <tr key={c._id}>
            <td>{c.court}</td>
            <td><Link to={`/cases/${c._id}`}>{c.caseNo}</Link></td>
            <td>{c.partyName}</td>
            <td>{c.status}</td>
            <td>{c.nextDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
