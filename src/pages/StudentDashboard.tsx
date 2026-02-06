import { useState } from "react";
import { BookOpen, ClipboardList, Bell, FileText, MessageSquare, Download, Star } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MOCK_MARKS, MOCK_ATTENDANCE, MOCK_NOTICES, MOCK_STUDY_MATERIALS } from "@/data/mockData";

type Tab = "marks" | "attendance" | "notices" | "materials" | "feedback";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "marks", label: "Marks", icon: <ClipboardList className="h-4 w-4" /> },
  { id: "attendance", label: "Attendance", icon: <BookOpen className="h-4 w-4" /> },
  { id: "notices", label: "Notices", icon: <Bell className="h-4 w-4" /> },
  { id: "materials", label: "Materials", icon: <FileText className="h-4 w-4" /> },
  { id: "feedback", label: "Feedback", icon: <MessageSquare className="h-4 w-4" /> },
];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("marks");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  return (
    <DashboardLayout>
      <div className="mb-6 animate-slide-up">
        <h2 className="text-xl font-bold text-foreground">Student Dashboard</h2>
        <p className="text-sm text-muted-foreground">Read-only access • View your academic records</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-student text-student-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === "marks" && (
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <h3 className="font-semibold text-foreground">Subject-wise Marks</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-3 text-muted-foreground font-medium">Subject</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">Midterm</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">Final</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">Assignment</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">Total</th>
                    <th className="text-center p-3 text-muted-foreground font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_MARKS.map((m) => (
                    <tr key={m.subject} className="border-b border-border/30 hover:bg-muted/20">
                      <td className="p-3 text-foreground font-medium">{m.subject}</td>
                      <td className="p-3 text-center text-muted-foreground">{m.midterm}/40</td>
                      <td className="p-3 text-center text-muted-foreground">{m.final}/90</td>
                      <td className="p-3 text-center text-muted-foreground">{m.assignment}/20</td>
                      <td className="p-3 text-center text-foreground font-semibold">{m.total}/{m.maxTotal}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-student/10 text-student">{m.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_ATTENDANCE.map((a) => (
              <div key={a.subject} className="glass-card p-4">
                <h4 className="font-medium text-foreground mb-3">{a.subject}</h4>
                <div className="flex items-end gap-3">
                  <span className={`text-3xl font-bold ${a.percentage >= 85 ? "text-faculty" : a.percentage >= 75 ? "text-student" : "text-admin"}`}>
                    {a.percentage}%
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">{a.attended}/{a.total} classes</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${a.percentage >= 85 ? "bg-faculty" : a.percentage >= 75 ? "bg-student" : "bg-admin"}`}
                    style={{ width: `${a.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "notices" && (
          <div className="space-y-3">
            {MOCK_NOTICES.map((n) => (
              <div key={n.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`h-2 w-2 rounded-full ${
                        n.priority === "high" ? "bg-admin" : n.priority === "medium" ? "bg-student" : "bg-muted-foreground"
                      }`} />
                      <h4 className="font-medium text-foreground">{n.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{n.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap font-mono">{n.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "materials" && (
          <div className="space-y-3">
            {MOCK_STUDY_MATERIALS.map((m) => (
              <div key={m.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{m.title}</h4>
                  <p className="text-sm text-muted-foreground">{m.subject} • {m.uploadedBy} • {m.fileSize}</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-muted/50 text-student transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="glass-card p-6 max-w-lg">
            <h3 className="font-semibold text-foreground mb-4">Submit Faculty Feedback</h3>
            <p className="text-sm text-muted-foreground mb-4">Your feedback is anonymous and visible only to administration.</p>
            {feedbackSubmitted ? (
              <div className="text-center py-8">
                <MessageSquare className="h-10 w-10 text-student mx-auto mb-3" />
                <p className="font-medium text-foreground">Feedback Submitted</p>
                <p className="text-sm text-muted-foreground">Thank you for your input.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Rating</label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setFeedbackRating(s)}>
                        <Star className={`h-6 w-6 transition-colors ${s <= feedbackRating ? "text-student fill-student" : "text-muted-foreground"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Comments</label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="mt-1 w-full rounded-lg bg-muted/50 border border-border/50 p-3 text-sm text-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Share your feedback..."
                  />
                </div>
                <button
                  onClick={() => setFeedbackSubmitted(true)}
                  disabled={!feedbackRating || !feedbackText}
                  className="w-full py-2 rounded-lg bg-student text-student-foreground font-medium text-sm disabled:opacity-50 transition-opacity"
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
