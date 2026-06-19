import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  Mail,
  Edit3,
  X,
  Check,
  Loader2,
  Calendar,
  Award,
  PenSquare,
  TrendingUp,
  PlusCircle,
  Briefcase,
  Code,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import MainLayout from "../layouts/MainLayout";
import api from "../utils/api";

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateProfile } = useContext(AuthContext);

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [isFetchingPosts, setIsFetchingPosts] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    semester: "",
    year: "",
    bio: "",
    skills: [],
    profilePicture: ""
  });
  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  const isSelf = !userId || userId === currentUser?._id;
  const activeUserId = isSelf ? currentUser?._id : userId;

  // Fetch Profile User Info
  const fetchProfileUser = async () => {
    setIsFetchingUser(true);
    try {
      if (isSelf) {
        // Fetch fresh copy of own profile
        const res = await api.get("/auth/me");
        setProfileUser(res.data.user);
        initForm(res.data.user);
      } else {
        const res = await api.get(`/auth/user/${userId}`);
        setProfileUser(res.data.user);
      }
    } catch (err) {
      console.error("Error fetching profile user:", err);
      setError("Failed to load user profile.");
    } finally {
      setIsFetchingUser(false);
    }
  };

  // Fetch User specific Posts
  const fetchUserPosts = async () => {
    if (!activeUserId) return;
    setIsFetchingPosts(true);
    try {
      const res = await api.get(`/posts/user/${activeUserId}`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setIsFetchingPosts(false);
    }
  };

  // Initialize edit form with user data
  const initForm = (userData) => {
    if (!userData) return;
    setFormData({
      name: userData.name || "",
      branch: userData.branch || "",
      semester: userData.semester || "",
      year: userData.year || "",
      bio: userData.bio || "",
      skills: userData.skills || [],
      profilePicture: userData.profilePicture || ""
    });
  };

  useEffect(() => {
    fetchProfileUser();
  }, [userId, currentUser?._id]);

  useEffect(() => {
    fetchUserPosts();
  }, [activeUserId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Skill Management
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (formData.skills.includes(newSkill.trim())) {
      setNewSkill("");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  // Submit Profile Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const updated = await updateProfile(formData);
      setProfileUser(updated.user);
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSaveSuccess(false);
      }, 1000);
    } catch (err) {
      setError(err || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "CC";
    const parts = name.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isFetchingUser ? (
          // Skeleton screen for Profile loading
          <div className="space-y-6 animate-pulse">
            <div className="h-48 w-full bg-slate-900 rounded-3xl" />
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/3 space-y-6">
                <div className="h-60 bg-slate-900 rounded-3xl" />
                <div className="h-40 bg-slate-900 rounded-3xl" />
              </div>
              <div className="lg:w-2/3 space-y-5">
                <div className="h-10 w-40 bg-slate-900 rounded-full" />
                <div className="h-32 bg-slate-900 rounded-3xl" />
                <div className="h-32 bg-slate-900 rounded-3xl" />
              </div>
            </div>
          </div>
        ) : !profileUser ? (
          // Error / Empty profile state
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
            <User size={48} className="mx-auto text-slate-500 mb-4" />
            <h2 className="text-xl font-bold text-white">Profile not found</h2>
            <p className="text-slate-400 mt-2">The user you are trying to view does not exist or has deleted their account.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-semibold transition"
            >
              Go to Homepage
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. Header Banner & Profile Meta */}
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/40 shadow-xl overflow-hidden backdrop-blur-md">
              {/* Cover Banner */}
              <div className="h-44 w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/10 via-transparent to-transparent" />
                <div className="absolute -bottom-1 right-8 p-3 text-white/5">
                  <Sparkles size={120} />
                </div>
              </div>

              {/* Profile Meta Section */}
              <div className="px-6 pb-6 pt-16 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
                {/* Overlapping Avatar */}
                <div className="absolute top-[-70px] left-6">
                  <div className="relative group">
                    {profileUser.profilePicture ? (
                      <img
                        src={profileUser.profilePicture}
                        alt={profileUser.name}
                        className="h-28 w-28 rounded-3xl object-cover border-4 border-slate-950 bg-slate-900 shadow-2xl hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="h-28 w-28 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 text-3xl font-extrabold text-white flex items-center justify-center border-4 border-slate-950 shadow-2xl hover:scale-105 transition-transform">
                        {getInitials(profileUser.name)}
                      </div>
                    )}
                    <span
                      className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-slate-950"
                      title="Active on Campus"
                    />
                  </div>
                </div>

                {/* Primary Student Metadata */}
                <div className="flex-1 mt-2 md:mt-0">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    {profileUser.name}
                    {isSelf && (
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Me
                      </span>
                    )}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5 text-sm text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium text-slate-200">
                      <GraduationCap size={16} className="text-indigo-400" />
                      {profileUser.branch || "General Student"}
                    </span>
                    {(profileUser.semester || profileUser.year) && (
                      <>
                        <span className="hidden md:inline text-slate-600">•</span>
                        <span className="px-2 py-0.5 rounded-lg bg-slate-950/40 text-slate-400 border border-slate-800 text-xs">
                          {profileUser.semester ? `Sem ${profileUser.semester}` : ""} 
                          {profileUser.semester && profileUser.year ? " • " : ""}
                          {profileUser.year ? `Year ${profileUser.year}` : ""}
                        </span>
                      </>
                    )}
                    <span className="hidden md:inline text-slate-600">•</span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Mail size={14} className="text-slate-500" />
                      {profileUser.email}
                    </span>
                  </div>
                </div>

                {/* Actions Button */}
                {isSelf ? (
                  <button
                    onClick={() => {
                      initForm(profileUser);
                      setIsEditModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 border border-indigo-400/20 md:self-end"
                  >
                    <Edit3 size={15} />
                    <span>Edit Profile ID</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/messages?user=${profileUser._id}`)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all active:scale-95 border border-slate-700 md:self-end"
                  >
                    <span>Message Student</span>
                    <ChevronRight size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Content Sections - Double Columns */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column: Bio & Skills details */}
              <div className="lg:w-1/3 space-y-6">
                {/* About Bio Card */}
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-4 text-white">
                    <User size={16} className="text-indigo-400" />
                    <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400">Student Bio</h2>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {profileUser.bio || "No student bio added yet. Add a bio to share details about your graduation targets, study projects, or campus focus!"}
                  </p>
                </div>

                {/* Technical Skills Card */}
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-4 text-white">
                    <Code size={16} className="text-indigo-400" />
                    <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400">Core Skills</h2>
                  </div>
                  {profileUser.skills && profileUser.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profileUser.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-xl border border-indigo-500/10 bg-indigo-500/5 hover:bg-indigo-500/10 text-xs font-semibold text-indigo-300 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No skills added yet. Add tags for technical skills, hobbies, or community interests!
                    </p>
                  )}
                </div>

                {/* Achievements Card (Static placeholder to feel production-ready) */}
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-4 text-white">
                    <Award size={16} className="text-indigo-400" />
                    <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400">Student Pulse</h2>
                  </div>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/20 border border-slate-850">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <TrendingUp size={14} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Active Contributor</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Top 15% student engagement this month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: User Posts Feed */}
              <div className="lg:w-2/3 space-y-5">
                {/* Timeline Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <PenSquare size={16} className="text-indigo-400" />
                    <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400">Campus Activity Timeline</h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{posts.length} shared posts</span>
                </div>

                {/* Posts Timeline rendering */}
                {isFetchingPosts ? (
                  <div className="space-y-4">
                    {[1, 2].map((n) => (
                      <div key={n} className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 bg-slate-800 rounded-xl" />
                          <div className="space-y-2">
                            <div className="h-3 w-28 bg-slate-800 rounded-full" />
                            <div className="h-2 w-16 bg-slate-800 rounded-full" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-slate-800 rounded-full" />
                          <div className="h-3 w-3/4 bg-slate-800 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="rounded-3xl border border-slate-800/85 bg-slate-900/20 p-10 text-center flex flex-col items-center justify-center">
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-600 mb-3">
                      <PenSquare size={24} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-300">No posts shared yet</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      {isSelf 
                        ? "You haven't posted anything on the feed yet. Head to the Campus Feed to share your first post!"
                        : `${profileUser.name} hasn't posted anything to the community feed yet.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {posts.map((post) => (
                      <PostCard key={post._id} post={post} fetchPosts={fetchUserPosts} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Sleek Edit Profile Modal Overlay */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            {/* Modal backdrop background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSaving && setIsEditModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Glass Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Edit Campus Identity</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Customize your public student profile credentials</p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                  className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form container scrollable */}
              <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-sm text-slate-350">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                    <span>{error}</span>
                  </div>
                )}

                {/* Row 1: Profile Picture URL & Preview */}
                <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-slate-950/30 border border-slate-850 rounded-2xl">
                  <div className="shrink-0">
                    {formData.profilePicture ? (
                      <img
                        src={formData.profilePicture}
                        alt="Avatar preview"
                        className="h-16 w-16 rounded-2xl object-cover border border-slate-800 bg-slate-900"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120"; // Fallback URL
                        }}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold uppercase">
                        {getInitials(formData.name)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Avatar Image URL
                    </label>
                    <input
                      type="url"
                      name="profilePicture"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.profilePicture}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs outline-none focus:border-indigo-500/50 text-white transition-all placeholder-slate-600"
                    />
                  </div>
                </div>

                {/* Row 2: Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs outline-none focus:border-indigo-500/50 text-white transition-all"
                    required
                  />
                </div>

                {/* Row 3: Branch, Year, Semester (Flex grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Branch / Stream
                    </label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs outline-none focus:border-indigo-500/50 text-white transition-all"
                    >
                      <option value="">Select Branch</option>
                      <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                      <option value="Electronics (ECE)">Electronics (ECE)</option>
                      <option value="Mechanical (ME)">Mechanical (ME)</option>
                      <option value="Electrical (EE)">Electrical (EE)</option>
                      <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
                      <option value="Information Technology (IT)">Information Technology (IT)</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="General Science">General Science</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Current Year
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs outline-none focus:border-indigo-500/50 text-white transition-all"
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Semester
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs outline-none focus:border-indigo-500/50 text-white transition-all"
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 4: Bio */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Bio / Student Summary
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Describe your student profile interests, project focus, or what campus clubs you lead..."
                    rows={4}
                    className="w-full px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs outline-none focus:border-indigo-500/50 text-white transition-all resize-none placeholder-slate-650"
                  />
                </div>

                {/* Row 5: Skills tag list & interactive input */}
                <div className="space-y-3 p-4 bg-slate-950/20 border border-slate-850 rounded-2xl">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Skill Tag Manager
                  </label>
                  
                  {/* Skill text input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a skill e.g. React, Python, UI Design, Figma..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl text-xs outline-none focus:border-indigo-500/50 text-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-xs border border-slate-700 transition"
                    >
                      Add Tag
                    </button>
                  </div>

                  {/* Skills Tag Cloud */}
                  {formData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/10 bg-indigo-500/10 text-xs font-semibold text-indigo-300"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-indigo-400 hover:text-red-400 transition-colors p-0.5 rounded-lg hover:bg-slate-900"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 pt-1">
                      No skill tags added. Type a skill and click "Add Tag" to display tags on your profile.
                    </p>
                  )}
                </div>

                {/* Modal Footer Controls */}
                <div className="border-t border-slate-800/60 pt-4 mt-6 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-850 font-semibold text-slate-400 text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || saveSuccess}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-500/15 border border-indigo-400/20 disabled:opacity-50 flex items-center gap-1.5 min-w-[90px] justify-center"
                  >
                    {isSaving ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : saveSuccess ? (
                      <Check size={13} className="text-emerald-400" />
                    ) : (
                      <span>Save ID</span>
                    )}
                    <span>{isSaving ? "Saving..." : saveSuccess ? "Saved!" : ""}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}

export default Profile;