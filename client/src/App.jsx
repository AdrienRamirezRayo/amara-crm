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

import { createLeadActivity } from "./services/activity";
import { signOutUser } from "./services/auth";
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
} from "./services/leads";
import { fetchTasks } from "./services/tasks";
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
    ownerId: lead.owner_id || null,
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
    ownerId: task.owner_id || null,
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
    let isMounted = true;

    async function loadAppData() {
      try {
        const [leadsResult, tasksResult] = await Promise.allSettled([
          fetchLeads(),
          fetchTasks(),
        ]);

        if (!isMounted) return;

        if (leadsResult.status === "fulfilled") {
          const { data: dbLeads, error: leadsError } = leadsResult.value;
          if (leadsError) {
            console.error("fetchLeads error:", leadsError);
            setLeads([]);
          } else {
            setLeads(Array.isArray(dbLeads) ? dbLeads.map(mapDbLeadToUi) : []);
          }
        } else {
          console.error("fetchLeads crashed:", leadsResult.reason);
          setLeads([]);
        }

        if (tasksResult.status === "fulfilled") {
          const { data: dbTasks, error: tasksError } = tasksResult.value;
          if (tasksError) {
            console.error("fetchTasks error:", tasksError);
            setTaskList([]);
          } else {
            setTaskList(Array.isArray(dbTasks) ? dbTasks.map(mapDbTaskToUi) : []);
          }
        } else {
          console.error("fetchTasks crashed:", tasksResult.reason);
          setTaskList([]);
        }
      } catch (error) {
        console.error("loadAppData error:", error);
        if (isMounted) {
          setLeads([]);
          setTaskList([]);
        }
      }
    }

    async function loadUserAndData(user) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, full_name, role, manager_id")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("profile read error:", profileError);
          throw profileError;
        }

        if (!isMounted) return;

        setCurrentUser({
          id: user.id,
          name: profile?.full_name || user.email?.split("@")[0] || "User",
          email: user.email,
          role: String(profile?.role || "").toLowerCase(),
          managerId: profile?.manager_id || null,
        });

        setIsAuthenticated(true);
        setIsBooting(false);

        loadAppData();
      } catch (error) {
        console.error("loadUserAndData error:", error);

        if (!isMounted) return;

        setIsAuthenticated(false);
        setCurrentUser(null);
        setLeads([]);
        setTaskList([]);
        setIsBooting(false);
      }
    }

    async function boot() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("getSession error:", error);
        }

        if (!isMounted) return;

        if (!session) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          setLeads([]);
          setTaskList([]);
          setIsBooting(false);
          return;
        }

        await loadUserAndData(session.user);
      } catch (error) {
        console.error("boot error:", error);

        if (!isMounted) return;

        setIsAuthenticated(false);
        setCurrentUser(null);
        setLeads([]);
        setTaskList([]);
        setIsBooting(false);
      }
    }

    const timeoutId = setTimeout(() => {
      if (!isMounted) return;
      setIsBooting(false);
    }, 4000);

    boot();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (!session) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setLeads([]);
        setTaskList([]);
        setIsBooting(false);
        return;
      }

      await loadUserAndData(session.user);
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
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
      await createLeadActivity({
        lead_id: data.id,
        owner_id: currentUser.id,
        action: "Lead Created",
        detail: `${data.name} was added to the CRM.`,
      });

      setLeads((prev) => [mapDbLeadToUi(data), ...prev]);
      rewardBones(10);
    }
  }

  async function handleDeleteLead(id) {
    const leadToDelete = leads.find((lead) => lead.id === id);

    if (leadToDelete && currentUser?.id) {
      await createLeadActivity({
        lead_id: id,
        owner_id: currentUser.id,
        action: "Lead Deleted",
        detail: `${leadToDelete.name} was removed from the CRM.`,
      });
    }

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
      await createLeadActivity({
        lead_id: data.id,
        owner_id: currentUser.id,
        action: "Stage Changed",
        detail: `${data.name} moved to ${newStage}.`,
      });

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
      await createLeadActivity({
        lead_id: data.id,
        owner_id: currentUser.id,
        action: "Note Added",
        detail: `A new note was added for ${data.name}.`,
      });

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
      await createLeadActivity({
        lead_id: data.id,
        owner_id: currentUser.id,
        action: "Lead Updated",
        detail: `${data.name}'s record was updated.`,
      });

      const mapped = mapDbLeadToUi(data);

      setLeads((prev) =>
        prev.map((lead) => (lead.id === mapped.id ? mapped : lead))
      );

      setSelectedLead(mapped);
      rewardBones(5);
    }
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
    if (currentUser?.role === "admin") return leads;
    if (currentUser?.role === "manager") return leads;
    return leads.filter((lead) => lead.ownerId === currentUser?.id);
  }, [leads, currentUser]);

  const visibleTasks = useMemo(() => {
    if (currentUser?.role === "admin") return taskList;
    if (currentUser?.role === "manager") return taskList;
    return taskList.filter((task) => task.ownerId === currentUser?.id);
  }, [taskList, currentUser]);

  const performanceStats = useMemo(() => {
    return calculateStats(visibleLeads, visibleTasks, dogBones);
  }, [visibleLeads, visibleTasks, dogBones]);

  if (isBooting && !currentUser && !isAuthenticated) {
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
      <Route path="/login" element={<LoginPage />} />

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
          element={
            canAccess(["admin"]) ? (
              <OnboardingPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/team-invite"
          element={
            canAccess(["admin", "manager"]) ? (
              <TeamInvitePage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/leads"
          element={
            <LeadsPage leads={visibleLeads} onOpenLead={setSelectedLead} />
          }
        />
        <Route path="/leads/:id" element={<LeadDetailPage />} />
        <Route path="/audit-center" element={<AuditCenterPage />} />
        <Route
          path="/recruiting"
          element={<RecruitingPage currentUser={currentUser} />}
        />
        <Route
          path="/pipeline"
          element={
            <PipelinePage
              leads={visibleLeads}
              onStageChange={handleStageChange}
            />
          }
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
            canAccess(["admin", "manager"]) ? (
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
          element={
            canAccess(["admin", "manager"]) ? (
              <AgentsPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/agents/:id"
          element={
            canAccess(["admin", "manager"]) ? (
              <AgentDetailPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route
          path="/audit"
          element={
            canAccess(["admin"]) ? (
              <AuditCenterPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/reports"
          element={
            canAccess(["admin", "manager"]) ? (
              <ReportsPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/integrations"
          element={
            canAccess(["admin"]) ? (
              <IntegrationsPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            canAccess(["admin"]) ? (
              <SettingsPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}