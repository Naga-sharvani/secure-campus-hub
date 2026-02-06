import { useState } from "react";
import { ClipboardList, BookOpen, Search, Save, X, Edit } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VerificationModal } from "@/components/VerificationModal";
import { MOCK_MARKS, MOCK_ATTENDANCE, MOCK_STUDENTS } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Tab = "update-marks" | "view-attendance";

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("update-marks");
  const [rollSearch, setRollSearch] = useState("");
  const [foundStudent, setFoundStudent] = useState<typeof MOCK_STUDENTS[0] | null>(null);
  const [editingMarks, setEditingMarks] = useState<typeof MOCK_MARKS | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [verified, setVerified] = useState(false);
  const [saved, setSaved] = useState(false);

  const searchStudent = () => {
    const student = MOCK_STUDENTS.find((s) => s.rollNumber.toLowerCase() === rollSearch.toLowerCase());
    setFoundStudent(student || null);
    setEditingMarks(null);
    setVerified(false);
    setSaved(false);
  };

  const handleEditClick = () => {
    setShowVerification(true);
  };

  const handleVerified = () => {
    setShowVerification(false);
    setVerified(true);
    setEditingMarks(MOCK_MARKS.map((m) => ({ ...m })));
  };

  const handleSave = () => {
    setSaved(true);
    setVerified(false);
    setEditingMarks(null);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 animate-slide-up">
        <h2 className="text-xl font-bold text-foreground">Faculty Dashboard</h2>
        <p className="text-sm text-muted-foreground">Partial edit access • Verification required for updates</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        <button
          onClick={() => setActiveTab("update-marks")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "update-marks" ? "bg-faculty text-faculty-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Update Marks
        </button>
        <button
          onClick={() => setActiveTab("view-attendance")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "view-attendance" ? "bg-faculty text-faculty-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          View Attendance
        </button>
      </div>

      <div className="animate-fade-in">
        {activeTab === "update-marks" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="glass-card p-4">
              <div className="flex gap-3">
                <Input
                  value={rollSearch}
                  onChange={(e) => setRollSearch(e.target.value)}
                  placeholder="Enter Roll Number (e.g. CS2024001)"
                  className="bg-muted/50"
                  onKeyDown={(e) => e.key === "Enter" && searchStudent()}
                />
                <Button onClick={searchStudent} className="gap-2 bg-faculty hover:bg-faculty/90 text-faculty-foreground">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>

            {/* Student Info */}
            {foundStudent && (
              <div className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{foundStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {foundStudent.rollNumber} • {foundStudent.department} • Sem {foundStudent.semester}
                    </p>
                  </div>
                  {!verified && !saved && (
                    <Button onClick={handleEditClick} variant="outline" className="gap-2 border-faculty/30 text-faculty hover:bg-faculty/10">
                      <Edit className="h-4 w-4" />
                      Edit Marks
                    </Button>
                  )}
                  {saved && (
                    <span className="text-sm text-faculty font-medium">✓ Saved</span>
                  )}
                </div>

                {/* Marks Table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left p-3 text-muted-foreground font-medium">Subject</th>
                        <th className="text-center p-3 text-muted-foreground font-medium">Midterm</th>
                        <th className="text-center p-3 text-muted-foreground font-medium">Final</th>
                        <th className="text-center p-3 text-muted-foreground font-medium">Assignment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(editingMarks || MOCK_MARKS).map((m, i) => (
                        <tr key={m.subject} className="border-b border-border/30">
                          <td className="p-3 text-foreground font-medium">{m.subject}</td>
                          <td className="p-3 text-center">
                            {verified && editingMarks ? (
                              <input
                                type="number"
                                value={editingMarks[i].midterm}
                                onChange={(e) => {
                                  const updated = [...editingMarks];
                                  updated[i] = { ...updated[i], midterm: Number(e.target.value) };
                                  setEditingMarks(updated);
                                }}
                                className="w-16 text-center rounded bg-muted/50 border border-faculty/30 p-1 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-faculty"
                              />
                            ) : (
                              <span className="text-muted-foreground">{m.midterm}</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {verified && editingMarks ? (
                              <input
                                type="number"
                                value={editingMarks[i].final}
                                onChange={(e) => {
                                  const updated = [...editingMarks];
                                  updated[i] = { ...updated[i], final: Number(e.target.value) };
                                  setEditingMarks(updated);
                                }}
                                className="w-16 text-center rounded bg-muted/50 border border-faculty/30 p-1 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-faculty"
                              />
                            ) : (
                              <span className="text-muted-foreground">{m.final}</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {verified && editingMarks ? (
                              <input
                                type="number"
                                value={editingMarks[i].assignment}
                                onChange={(e) => {
                                  const updated = [...editingMarks];
                                  updated[i] = { ...updated[i], assignment: Number(e.target.value) };
                                  setEditingMarks(updated);
                                }}
                                className="w-16 text-center rounded bg-muted/50 border border-faculty/30 p-1 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-faculty"
                              />
                            ) : (
                              <span className="text-muted-foreground">{m.assignment}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {verified && editingMarks && (
                  <div className="flex gap-3 mt-4 justify-end">
                    <Button variant="outline" onClick={() => { setVerified(false); setEditingMarks(null); }}>
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-faculty hover:bg-faculty/90 text-faculty-foreground gap-2">
                      <Save className="h-4 w-4" /> Save Marks
                    </Button>
                  </div>
                )}
              </div>
            )}

            {rollSearch && !foundStudent && (
              <div className="glass-card p-6 text-center">
                <p className="text-muted-foreground">No student found with roll number "{rollSearch}"</p>
                <p className="text-xs text-muted-foreground mt-1">Try: CS2024001, CS2024002, CS2024003</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "view-attendance" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_ATTENDANCE.map((a) => (
              <div key={a.subject} className="glass-card p-4">
                <h4 className="font-medium text-foreground mb-3">{a.subject}</h4>
                <div className="flex items-end gap-3">
                  <span className={`text-3xl font-bold ${a.percentage >= 85 ? "text-faculty" : a.percentage >= 75 ? "text-student" : "text-admin"}`}>
                    {a.percentage}%
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">{a.attended}/{a.total}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${a.percentage >= 85 ? "bg-faculty" : a.percentage >= 75 ? "bg-student" : "bg-admin"}`}
                    style={{ width: `${a.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Read-only • Managed by admin</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <VerificationModal
        open={showVerification}
        onClose={() => setShowVerification(false)}
        onVerified={handleVerified}
        actionLabel="Edit Student Marks"
      />
    </DashboardLayout>
  );
};

export default FacultyDashboard;
