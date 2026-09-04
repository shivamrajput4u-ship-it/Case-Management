export function pillClassFor(status) {
  switch (status) {
    case "Active":
      return "pill-active";
    case "Pending":
      return "pill-pending";
    case "Closed":
      return "pill-closed";
    case "Urgent":
      return "pill-urgent";
    default:
      return "pill-pending";
  }
}
