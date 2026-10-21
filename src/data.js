// Edit this tree to match your real team. "dept" colors a branch: "analytics" or "dev".
export const orgChart = {
  name: "Priya Sharma",
  role: "Head of Data",
  email: "priya.sharma@example.com",
  children: [
    {
      dept: "analytics",
      name: "Maria Santos",
      role: "Manager, Analytics & Reports",
      email: "maria.santos@example.com",
      department: "Analytics & Reports",
      children: [
        { name: "Jon Reyes", role: "Senior Data Analyst", email: "jon.reyes@example.com" },
        { name: "Aisha Khan", role: "Reporting Analyst", email: "aisha.khan@example.com" },
        { name: "Luis Garcia", role: "BI Developer", email: "luis.garcia@example.com" },
      ],
    },
    {
      dept: "dev",
      name: "Daniel Cruz",
      role: "Manager, App Development",
      email: "daniel.cruz@example.com",
      department: "App Development",
      children: [
        { name: "Rafael Lim", role: "Senior Developer", email: "rafael.lim@example.com" },
        { name: "Kim Tan", role: "Full-stack Developer", email: "kim.tan@example.com" },
        { name: "Noel Ramos", role: "Data Engineer", email: "noel.ramos@example.com" },
      ],
    },
  ],
};

export const columns = ["Backlog", "In progress", "In review", "Released"];

export const initialCards = [
  { id: 1, title: "Self-service report request form", owner: "Kim Tan", tag: "Web", col: 0 },
  { id: 2, title: "Fix inventory pipeline timeout", owner: "Noel Ramos", tag: "Data pipeline", col: 1 },
  { id: 3, title: "Role-based access for dashboards", owner: "Rafael Lim", tag: "Security", col: 1 },
  { id: 4, title: "Export reports to Excel", owner: "Kim Tan", tag: "Web", col: 2 },
  { id: 5, title: "Sales dashboard API", owner: "Noel Ramos", tag: "API", col: 3 },
  { id: 6, title: "Alerting for failed refreshes", owner: "Rafael Lim", tag: "Data pipeline", col: 0 },
];
