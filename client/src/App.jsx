import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

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

import {
  getCurrentSession,
  getCurrentUser,
  signOutUser,
} from "./services/auth";
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
} from "./services/leads";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./services/tasks";
import { supabase } from "./lib/supabase";
import { initialLeads, tasks as initialTasks } from "./data/crmData";

function parsePremium(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  const numeric = String(value).replace(/[^0-9.]/g, "");
  return Number(numeric) || 0;
}

function formatPremiumForUi(value) {
  const amount = Number(value) || 0;
  return `$${amount}/mo`;
}

function mapDbLeadToUi(lead) {
  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone || "",
    email: lead.email || "",
    product: lead.product || "",
    carrier: lead.carrier || "",
    stage: lead.stage || "New Lead",
    premium: formatPremiumForUi(lead.premium),
    followUp: lead.follow_up || "",
    notes: Array.isArray(lead.notes) ? lead.notes : [],
    agent: "Assigned User",
  };
}

function mapUiLeadToDb(lead, ownerId) {
  return {
    owner_id: ownerId,
    name: lead.name,
    phone: lead.phone || null,
    email: lead.email || null,
    product: lead.product || null,
    carrier: lead.carrier || null,
    stage: lead.stage || "New Lead",
    premium: parsePremium(lead.premium),
    follow_up: lead.followUp || null,
    notes: Array.isArray(lead.notes) ? lead.notes : [],
  };
}

function mapDbTaskToUi(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description || "",
    status: task.status || "Open",
    priority: task.priority || "Medium",
    dueDate: task.due_date || "",
    agent: "Assigned User",
  };
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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    async function boot() {
      try {
        const { data: sessionData } = await getCurrentSession();
        const session = sessionData?.session;

        if (!session) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setIsBooting(false);
          return;
        }

        const { data: userData } = await getCurrentUser();
        const user = userData?.user;

        if (!user) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setIsBooting(false);
          return;
        }

        const role =
          user.user_metadata?.role ||
          user.app_metadata?.role ||
          "Agent";

        const name =
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "User";

        setCurrentUser({
          id: user.id,
          name,
          email: user.email,
          role,
        });

        setIsAuthenticated(true);

        const [{ data: dbLeads }, { data: dbTasks }] = await Promise.all([
          fetchLeads(),
          fetchTasks(),
        ]);

        if (Array.isArray(dbLeads)) {
          setLeads(dbLeads.map(mapDbLeadToUi));
        }

        if (Array.isArray(dbTasks)) {
          setTaskList(dbTasks.map(mapDbTaskToUi));
        }
      } finally {
        setIsBooting(false);
      }
    }

    boot();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          return;
        }

        const user = session.user;

        const role =
          user.user_metadata?.role ||
          user.app_metadata?.role ||
          "Agent";

        const name =
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "User";

        setCurrentUser({
          id: user.id,
          name,
          email: user.email,
          role,
        });

        setIsAuthenticated(true);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  function rewardBones(amount) {
    setDogBones((prev) => prev + amount);
  }

  async function handleAddLead(newLead) {
    if (!currentUser?.id) return;

    const payload = mapUiLeadToDb(newLead, currentUser.id);
    const { data, error } = await createLead(payload);

    if (error) {
      console.error("createLead error:", error);
      return;
    }

    if (data) {
      setLeads((prev) => [mapDbLeadToUi(data), ...prev]);
      rewardBones(10);
    }
  }

  async function handleDeleteLead(id) {
    const { error } = await deleteLead(id);

    if (error) {
      console.error("deleteLead error:", error);
      return;
    }

    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    setSelectedLead(null);
  }

  async function handleStageChange(id, newStage) {
    const { data, error } = await updateLead(id, {
      stage: newStage,
    });

    if (error) {
      console.error("updateLead stage error:", error);
      return;
    }

    if (data) {
      const mapped = mapDbLeadToUi(data);

      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? mapped : lead))
      );

      setSelectedLead((prev) => (prev && prev.id === id ? mapped : prev));
      rewardBones(getBoneRewardForStage(newStage));
    }
  }

  async function handleAddNote(id, note) {
    const lead = leads.find((item) => item.id === id);
    if (!lead) return;

    const nextNotes = [...(lead.notes || []), note];

    const { data, error } = await updateLead(id, {
      notes: nextNotes,
    });

    if (error) {
      console.error("updateLead notes error:", error);
      return;
    }

    if (data) {
      const mapped = mapDbLeadToUi(data);

      setLeads((prev) =>
        prev.map((item) => (item.id === id ? mapped : item))
      );

      setSelectedLead((prev) => (prev && prev.id === id ? mapped : prev));
      rewardBones(3);
    }
  }

  async function handleSaveLead(updatedLead) {
    const payload = {
      name: updatedLead.name,
      phone: updatedLead.phone || null,
      email: updatedLead.email || null,
      product: updatedLead.product || null,
      carrier: updatedLead.carrier || null,
      stage: updatedLead.stage || "New Lead",
      premium: parsePremium(updatedLead.premium),
      follow_up: updatedLead.followUp || null,
      notes: Array.isArray(updatedLead.notes) ? updatedLead.notes : [],
    };

    const { data, error } = await updateLead(updatedLead.id, payload);

    if (error) {
      console.error("saveLead error:", error);
      return;
    }

    if (data) {
      const mapped = mapDbLeadToUi(data);

      setLeads((prev) =>
        prev.map((lead) => (lead.id === mapped.id ? mapped : lead))
      );

      setSelectedLead(mapped);
      rewardBones(5);
    }
  }

  function handleLogin(user) {
    setCurrentUser(user);
    setIsAuthenticated(true);
  }

  async function handleLogout() {
    await signOutUser();
    setIsAuthenticated(false);
    setSelectedLead(null);
    setCurrentUser(null);
  }

  function canAccess(allowedRoles) {
    return allowedRoles.includes(currentUser?.role);
  }

  const visibleLeads = useMemo(() => {
    if (currentUser?.role === "Admin") return leads;
    if (currentUser?.role === "Manager") return leads;
    return leads;
  }, [leads, currentUser]);

  const visibleTasks = useMemo(() => {
    if (currentUser?.role === "Admin") return taskList;
    if (currentUser?.role === "Manager") return taskList;
    return taskList;
  }, [taskList, currentUser]);

  const performanceStats = useMemo(() => {
    return calculateStats(visibleLeads, visibleTasks, dogBones);
  }, [visibleLeads, visibleTasks, dogBones]);

  if (isBooting) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          color: "white",
        }}
      >
        Loading AMARA CRM...
      </div>
    );
  }

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
                leads={visibleLeads}
                tasks={visibleTasks}
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

      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
}