import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Users,
  Save,
  Trash2,
  LogOut,
  BadgeCheck,
  UserPlus,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { usersService } from "../../services/userService";
import type { User } from "../../types/auth";

export const Settings = () => {
  const { user, setUser, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [team, setTeam] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para Convite de Novo Membro
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (activeTab === "team" && user?.role === "ADMIN") {
      loadTeam();
    }
  }, [activeTab, user?.role]);

  const loadTeam = async () => {
    setIsLoading(true);
    try {
      const data = await usersService.listUsers();
      setTeam(data);
    } catch (error) {
      console.error("Error loading team", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMe = async () => {
    try {
      setIsLoading(true);
      const updated = await usersService.updateMe(formData);
      setUser((prev) => (prev ? { ...prev, ...updated } : null));
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData.name || !inviteData.email || !inviteData.password) {
      return alert("Please fill all fields");
    }

    try {
      setIsLoading(true);
      await usersService.inviteMember(inviteData);
      alert("Member added successfully!");
      setInviteData({ name: "", email: "", password: "" });
      setShowInviteForm(false);
      loadTeam();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error adding member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (targetId: string, role: any) => {
    try {
      await usersService.updateUserRole(targetId, role);
      loadTeam();
    } catch (error) {
      alert("Error updating role");
    }
  };

  const handleDeactivate = async (targetId: string) => {
    if (
      window.confirm("Disable this user? They will lose access immediately.")
    ) {
      try {
        await usersService.deactivateUser(targetId);
        loadTeam();
      } catch (error) {
        alert("Error deactivating user");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Settings
        </h1>
        <p className="text-gray-400 mt-1">
          Manage your account and team permissions.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-[#13131A] border border-white/5 rounded-2xl p-2 space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-500 hover:bg-white/5"
            }`}
          >
            <UserIcon size={18} /> Profile
          </button>

          {user?.role === "ADMIN" && (
            <button
              onClick={() => setActiveTab("team")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "team"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-500 hover:bg-white/5"
              }`}
            >
              <Users size={18} /> Team
            </button>
          )}

          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </div>

        {/* Painel */}
        <div className="flex-1 bg-[#13131A] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8">
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Cabeçalho Perfil */}
                <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    className="w-24 h-24 rounded-2xl ring-4 ring-purple-500/10 bg-[#1C1C26]"
                    alt="Avatar"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">
                        {user?.name}
                      </h3>
                      <BadgeCheck size={18} className="text-purple-400" />
                    </div>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase rounded-full border border-purple-500/20">
                      {user?.role}
                    </span>
                  </div>
                </div>

                {/* Form Perfil */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-[#1C1C26] border border-white/5 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-purple-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-[#1C1C26] border border-white/5 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-purple-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleUpdateMe}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-3.5 bg-purple-600 rounded-2xl text-sm font-bold text-white hover:bg-purple-700 transition-all"
                  >
                    <Save size={18} />{" "}
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Team Members
                    </h3>
                    <p className="text-sm text-gray-500">
                      Only users from your company
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInviteForm(!showInviteForm)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      showInviteForm
                        ? "bg-white/10 text-white"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    {showInviteForm ? <X size={18} /> : <UserPlus size={18} />}
                    {showInviteForm ? "Cancel" : "Add Member"}
                  </button>
                </div>

                {/* Formulário de Convite */}
                <AnimatePresence>
                  {showInviteForm && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={handleInvite}
                      className="overflow-hidden bg-[#1C1C26] rounded-2xl border border-purple-500/20"
                    >
                      <div className="p-6 space-y-4">
                        <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                          New Member Details
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            required
                            placeholder="Full Name"
                            value={inviteData.name}
                            onChange={(e) =>
                              setInviteData({
                                ...inviteData,
                                name: e.target.value,
                              })
                            }
                            className="bg-[#13131A] border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/30"
                          />
                          <input
                            required
                            type="email"
                            placeholder="Email Address"
                            value={inviteData.email}
                            onChange={(e) =>
                              setInviteData({
                                ...inviteData,
                                email: e.target.value,
                              })
                            }
                            className="bg-[#13131A] border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/30"
                          />
                          <input
                            required
                            type="password"
                            placeholder="Initial Password"
                            value={inviteData.password}
                            onChange={(e) =>
                              setInviteData({
                                ...inviteData,
                                password: e.target.value,
                              })
                            }
                            className="bg-[#13131A] border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/30"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all"
                        >
                          {isLoading ? "Adding..." : "Create Account (Viewer)"}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Tabela */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[11px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                        <th className="pb-4 px-2">Member</th>
                        <th className="pb-4 px-2">Role</th>
                        <th className="pb-4 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {team.map((member) => (
                        <tr
                          key={member.id}
                          className="group hover:bg-white/1 transition-colors"
                        >
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xs">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {member.name}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <select
                              value={member.role}
                              onChange={(e) =>
                                handleChangeRole(member.id, e.target.value)
                              }
                              disabled={member.id === user?.id || isLoading}
                              className="bg-[#1C1C26] border border-white/10 text-[11px] font-bold text-gray-300 rounded-xl px-3 py-1.5 outline-none focus:border-purple-500/50 cursor-pointer disabled:opacity-30"
                            >
                              <option value="VIEWER">VIEWER</option>
                              <option value="MANAGER">MANAGER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td className="py-4 px-2 text-right">
                            {member.id !== user?.id && (
                              <button
                                onClick={() => handleDeactivate(member.id)}
                                className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {team.length === 0 && !isLoading && (
                    <div className="py-10 text-center text-gray-500 text-sm italic">
                      No team members found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
