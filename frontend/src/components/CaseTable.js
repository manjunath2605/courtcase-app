import { Link } from "react-router-dom";

export default function CaseTable({ cases }) {
  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toISOString().slice(0, 10);
  };

  const getLastHearing = (caseData) => {
    const history = Array.isArray(caseData.history) ? caseData.history : [];
    if (history.length === 0) {
      return {
        date: caseData.nextDate,
        status: caseData.status,
        remarks: caseData.remarks
      };
    }

    return [...history].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  };

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Court</th>
          <th>Case No</th>
          <th>Party</th>
          <th>Current Status</th>
          <th>Next Date</th>
          <th>Last Hearing Date</th>
          <th>Last Hearing Status</th>
          <th>Last Hearing Remarks</th>
        </tr>
      </thead>
      <tbody>
        {cases.map(c => {
          const lastHearing = getLastHearing(c);
          return (
          <tr key={c._id}>
            <td>{c.court}</td>
            <td><Link to={`/cases/${c._id}`}>{c.caseNo}</Link></td>
            <td>{c.partyName}</td>
            <td>{c.status}</td>
            <td>{formatDate(c.nextDate)}</td>
            <td>{formatDate(lastHearing?.date)}</td>
            <td>{lastHearing?.status || "-"}</td>
            <td>{lastHearing?.remarks || "-"}</td>
          </tr>
        )})}
      </tbody>
    </table>
  );
}
