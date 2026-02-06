import { useState } from "react";
import { Users, ClipboardList, Bell, MessageSquare, Trash2, Upload, AlertTriangle, Plus, Save } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { VerificationModal } from "@/components/VerificationModal";
import { MOCK_STUDENTS, MOCK_FACULTY, MOCK_ATTENDANCE, MOCK_NOTICES, MOCK_FEEDBACK } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab = "attendance" | "accounts" | "notices" | "feedback";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("attendance");
  const [showVerification, setShowVerification] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [pendingLabel, setPendingLabel] = useState("");
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [faculty, setFaculty] = useState(MOCK_FACULTY);
  const [notices, setNotices] = useState(MOCK_NOTICES);
  const [newNotice, setNewNotice] = useState({ title: "", content: "" });
  const [showNewNotice, setShowNewNotice] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState(MOCK_ATTENDANCE.map((a) => ({ ...a })));
  const [editingAttendance, setEditingAttendance] = useState(false);

  const requireVerification = (label: string, action: () => void) => {
    setPendingLabel(label);
    setPendingAction(() => action);
    setShowVerification(true);
  };

  const handleVerified = () => {
    setShowVerification(false);
    pendingAction?.();
    setPendingAction(null);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setConfirmDelete(null);
  };

  const handleDeleteFaculty = (id: string) => {
    setFaculty((prev) => prev.filter((f) => f.id !== id));
    setConfirmDelete(null);
  };

  const handleUploadNotice = () => {
    if (!newNotice.title || !newNotice.content) return;
    setNotices((prev) => [
      { id: `n${Date.now()}`, title: newNotice.title, content: newNotice.content, date: new Date().toISOString().split("T")[0], priority: "medium" as const },
      ...prev,
    ]);
    setNewNotice({ title: "", content: "" });
    setShowNewNotice(false);
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "attendance", label: "Attendance", icon: <ClipboardList className="h-4 w-4" /> },
    { id: "accounts", label: "Accounts", icon: <Users className="h-4 w-4" /> },
    { id: "notices", label: "Notices", icon: <Bell className="h-4 w-4" /> },
    { id: "feedback", label: "Feedback", icon: <MessageSquare className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 animate-slide-up">
        <h2 className="text-xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">Full access • All actions require verification</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Students", value: students.length, color: "text-student" },
          { label: "Faculty", value: faculty.length, color: "text-faculty" },
          { label: "Notices", value: notices.length, color: "text-primary" },
          { label: "Feedback", value: MOCK_FEEDBACK.length, color: "text-admin" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? "bg-admin text-admin-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {activeTab === "attendance" && (
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Student Attendance</h3>
              {!editingAttendance ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => requireVerification("Edit Attendance", () => setEditingAttendance(true))}
                  className="border-admin/30 text-admin hover:bg-admin/10"
                >
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingAttendance(false)}>Cancel</Button>
                  <Button size="sm" onClick={() => setEditingAttendance(false)} className="bg-admin hover:bg-admin/90 text-admin-foreground gap-1">
                    <Save className="h-3 w-3" /> Save
                  </Button>
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-3 text-muted-foreground font-medium">Subject</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">Attended</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">Total</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">%</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((a, i) => (
                    <tr key={a.subject} className="border-b border-border/30">
                      <td className="p-3 text-foreground">{a.subject}</td>
                      <td className="p-3 text-center">
                        {editingAttendance ? (
                          <input
                            type="number"
                            value={a.attended}
                            onChange={(e) => {
                              const updated = [...attendanceData];
                              updated[i] = { ...updated[i], attended: Number(e.target.value), percentage: Math.round((Number(e.target.value) / updated[i].total) * 100) };
                              setAttendanceData(updated);
                            }}
                            className="w-16 text-center rounded bg-muted/50 border border-admin/30 p-1 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-admin"
                          />
                        ) : (
                          <span className="text-muted-foreground">{a.attended}</span>
                        )}
                      </td>
                      <td className="p-3 text-center text-muted-foreground">{a.total}</td>
                      <td className="p-3 text-center font-semibold text-foreground">{a.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "accounts" && (
          <div className="space-y-6">
            {/* Students */}
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold text-foreground">Student Accounts</h3>
              </div>
              <div className="divide-y divide-border/30">
                {students.map((s) => (
                  <div key={s.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.rollNumber} • {s.department}</p>
                    </div>
                    {confirmDelete === s.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                        <Button size="sm" variant="destructive" onClick={() => requireVerification("Delete Student Account", () => handleDeleteStudent(s.id))}>
                          Confirm
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(s.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty */}
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold text-foreground">Faculty Accounts</h3>
              </div>
              <div className="divide-y divide-border/30">
                {faculty.map((f) => (
                  <div key={f.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{f.name}</p>
                      <p className="text-sm text-muted-foreground">{f.department} • {f.subjects.join(", ")}</p>
                    </div>
                    {confirmDelete === f.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                        <Button size="sm" variant="destructive" onClick={() => requireVerification("Delete Faculty Account", () => handleDeleteFaculty(f.id))}>
                          Confirm
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(f.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "notices" && (
          <div className="space-y-4">
            <Button
              onClick={() => requireVerification("Upload Notice", () => setShowNewNotice(true))}
              className="gap-2 bg-admin hover:bg-admin/90 text-admin-foreground"
            >
              <Plus className="h-4 w-4" /> New Notice
            </Button>

            {showNewNotice && (
              <div className="glass-card p-4 space-y-3 border-admin/20">
                <Input
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="Notice title"
                  className="bg-muted/50"
                />
                <textarea
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Notice content..."
                  className="w-full rounded-lg bg-muted/50 border border-border/50 p-3 text-sm text-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-admin"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setShowNewNotice(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleUploadNotice} disabled={!newNotice.title || !newNotice.content} className="bg-admin hover:bg-admin/90 text-admin-foreground gap-1">
                    <Upload className="h-3 w-3" /> Publish
                  </Button>
                </div>
              </div>
            )}

            {notices.map((n) => (
              <div key={n.id} className="glass-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`h-2 w-2 rounded-full ${n.priority === "high" ? "bg-admin" : n.priority === "medium" ? "bg-student" : "bg-muted-foreground"}`} />
                      <h4 className="font-medium text-foreground">{n.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{n.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{n.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="space-y-3">
            {MOCK_FEEDBACK.map((fb) => (
              <div key={fb.id} className="glass-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{fb.studentName}</p>
                    <p className="text-sm text-muted-foreground">About: {fb.faculty}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < fb.rating ? "text-student" : "text-muted"}`}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">"{fb.comment}"</p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">{fb.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <VerificationModal
        open={showVerification}
        onClose={() => { setShowVerification(false); setPendingAction(null); }}
        onVerified={handleVerified}
        actionLabel={pendingLabel}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
