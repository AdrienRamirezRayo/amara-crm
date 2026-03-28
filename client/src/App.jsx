import { Routes, Route, Navigate } from "react-router-dom";
import { useMemo, useState } from "react";

import AppLayout from "./layout/AppLayout";
import ProtectedLayout from "./components/ProtectedLayout";
import RecruitingPage from "./pages/RecruitingPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import TeamInvitePage from "./pages/TeamInvitePage";
import RecruitDetailPage from "./pages/RecruitDetailPage";
import DashboardPage from "./pages/DashboardPage";
import CarriersPage from "./pages/CarriersPage";
import LeadsPage from "./pages/LeadsPage";
import LeadDetailPage from "./pages/LeadDetailPage";
import PipelinePage from "./pages/PipelinePage";
import AppointmentsPage from "./pages/AppointmentsPage";
import IllustrationsPage from "./pages/IllustrationsPage";
import CommissionsPage from "./pages/CommissionsPage";
import SalesCoachPage from "./pages/SalesCoachPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import TasksPage from "./pages/TasksPage";
import ManagerDashboardPage from "./pages/ManagerDashboardPage";
import AgentsPage from "./pages/AgentsPage";
import AgentDetailPage from "./pages/AgentDetailPage";
import NotificationsPage from "./pages/NotificationsPage";
import AuditCenterPage from "./pages/AuditCenterPage";
import ReportsPage from "./pages/ReportsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import SettingsPage from "./pages/SettingsPage";

import { initialLeads, tasks as initialTasks } from "./data/crmData";

function parsePremium(value) {
  if (!value) return 0;
  const numeric = String(value).replace(/[^0-9.]/g, "");
  return Number(numeric) || 0;
}

function calculateStats(leads, tasks, dogBones) {
  const totalPremium = leads.reduce(
    (sum, lead) => sum + parsePremium(lead.premium),
    0
  );

  const closingLeads = leads.filter(
    (lead) => lead.stage === "Application" || lead.stage === "Underwriting"
  ).length;

  const closeRate = leads.length
    ? Math.round((closingLeads / leads.length) * 100)
    : 0;

  const callsToday =
    tasks.filter((task) => task.status === "Open").length +
    leads.reduce((sum, lead) => sum + (lead.notes?.length || 0), 0);

  return {
    production: totalPremium,
    closeRate,
    callsToday,
    dogBones,
  };
}

function getBoneRewardForStage(newStage) {
  switch (newStage) {
    case "New Lead":
      return 2;
    case "Follow Up":
      return 4;
    case "Quoted":
      return 12;
    case "Application":
      return 20;
    case "Underwriting":
      return 28;
    default:
      return 5;
  }
}

export default function App() {
  const [leads, setLeads] = useState(initialLeads);
  const [taskList, setTaskList] = useState(initialTasks);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dogBones, setDogBones] = useState(1240);

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: "Adrien",
    email: "adrien@amara.crm",
    role: "Admin",
  });

  function rewardBones(amount) {
    setDogBones((prev) => prev + amount);
  }

  function handleAddLead(newLead) {
    setLeads((prev) => [newLead, ...prev]);
    rewardBones(10);
  }

  function handleDeleteLead(id) {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    setSelectedLead(null);
  }

  function handleStageChange(id, newStage) {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, stage: newStage } : lead
      )
    );

    setSelectedLead((prev) =>
      prev && prev.id === id ? { ...prev, stage: newStage } : prev
    );

    rewardBones(getBoneRewardForStage(newStage));
  }

  function handleAddNote(id, note) {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? { ...lead, notes: [...(lead.notes || []), note] }
          : lead
      )
    );

    setSelectedLead((prev) =>
      prev && prev.id === id
        ? { ...prev, notes: [...(prev.notes || []), note] }
        : prev
    );

    rewardBones(3);
  }

  function handleSaveLead(updatedLead) {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
    );
    setSelectedLead(updatedLead);
    rewardBones(5);
  }

  function handleLogin(user) {
    setCurrentUser(user);
    setIsAuthenticated(true);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setSelectedLead(null);
  }

  function canAccess(allowedRoles) {
    return allowedRoles.includes(currentUser?.role);
  }

  const visibleLeads = useMemo(() => {
    if (currentUser?.role === "Admin") return leads;
    if (currentUser?.role === "Manager") return leads;
    return leads.filter((lead) => lead.agent === currentUser?.name);
  }, [leads, currentUser]);

  const visibleTasks = useMemo(() => {
    if (currentUser?.role === "Admin") return taskList;
    if (currentUser?.role === "Manager") return taskList;
    return taskList.filter((task) => task.agent === currentUser?.name);
  }, [taskList, currentUser]);

  const performanceStats = useMemo(() => {
    return calculateStats(visibleLeads, visibleTasks, dogBones);
  }, [visibleLeads, visibleTasks, dogBones]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      <Route
        element={
          <ProtectedLayout isAuthenticated={isAuthenticated}>
            <AppLayout
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenLeadModal={() => setIsLeadModalOpen(true)}
              isLeadModalOpen={isLeadModalOpen}
              setIsLeadModalOpen={setIsLeadModalOpen}
              onAddLead={handleAddLead}
              selectedLead={selectedLead}
              setSelectedLead={setSelectedLead}
              onDeleteLead={handleDeleteLead}
              onEditLead={(lead) => {
                setSelectedLead(lead);
                setIsEditModalOpen(true);
              }}
              onStageChange={handleStageChange}
              onAddNote={handleAddNote}
              isEditModalOpen={isEditModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
              onSaveLead={handleSaveLead}
              dogBones={dogBones}
              performanceStats={performanceStats}
            />
          </ProtectedLayout>
        }
      >
        <Route path="/" element={<DashboardPage leads={visibleLeads} />} />
        <Route
          path="/onboarding"
          element={canAccess(["Admin"]) ? <OnboardingPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/team-invite"
          element={
            canAccess(["Admin", "Manager", "Agent"]) ? (
              <TeamInvitePage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/leads"
          element={<LeadsPage leads={visibleLeads} onOpenLead={setSelectedLead} />}
        />
        <Route path="/leads/:id" element={<LeadDetailPage />} />
        <Route path="/audit-center" element={<AuditCenterPage />} />
        <Route path="/recruiting" element={<RecruitingPage currentUser={currentUser} />} />
        <Route
          path="/pipeline"
          element={<PipelinePage leads={visibleLeads} onStageChange={handleStageChange} />}
        />
        <Route path="/carriers" element={<CarriersPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/illustrations" element={<IllustrationsPage />} />
        <Route path="/commissions" element={<CommissionsPage />} />
        <Route path="/sales-coach" element={<SalesCoachPage />} />
        <Route
          path="/recruiting/:id"
          element={<RecruitDetailPage currentUser={currentUser} />}
        />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route
          path="/tasks"
          element={<TasksPage tasks={visibleTasks} currentUser={currentUser} />}
        />
        <Route
          path="/manager"
          element={
            canAccess(["Admin", "Manager"]) ? (
              <ManagerDashboardPage
                leads={leads}
                tasks={taskList}
                currentUser={currentUser}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/agents"
          element={canAccess(["Admin", "Manager"]) ? <AgentsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/agents/:id"
          element={
            canAccess(["Admin", "Manager"]) ? <AgentDetailPage /> : <Navigate to="/" replace />
          }
        />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route
          path="/audit"
          element={canAccess(["Admin"]) ? <AuditCenterPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/reports"
          element={
            canAccess(["Admin", "Manager"]) ? <ReportsPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/integrations"
          element={canAccess(["Admin"]) ? <IntegrationsPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/settings"
          element={canAccess(["Admin"]) ? <SettingsPage /> : <Navigate to="/" replace />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}