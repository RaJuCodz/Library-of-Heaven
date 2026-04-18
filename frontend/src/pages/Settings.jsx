import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCheckCircle, FaShieldAlt, FaBell, FaLock } from "react-icons/fa";

const SettingCard = ({ icon: Icon, iconColor, title, description, badge, children, delay = 0 }) => (
  <motion.div
    className="rounded-2xl border border-parchment-300 dark:border-navy-500
      bg-parchment-100 dark:bg-navy-700 overflow-hidden"
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    {/* Card header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-parchment-200 dark:border-navy-600">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-sans font-semibold text-sm text-parchment-900 dark:text-parchment-100">
            {title}
          </h3>
          <p className="font-sans text-xs text-toffee-500 dark:text-toffee-500 mt-0.5">{description}</p>
        </div>
      </div>
      {badge && (
        <span className="font-cinzel text-[10px] px-2.5 py-1 rounded-full tracking-widest uppercase
          bg-parchment-200 dark:bg-navy-600 text-toffee-500 dark:text-toffee-400
          border border-parchment-300 dark:border-navy-500"
        >
          {badge}
        </span>
      )}
    </div>

    {/* Card body */}
    {children && <div className="px-6 py-5">{children}</div>}
  </motion.div>
);

const Settings = () => {
  const [address, setAddress]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  const headers = {
    id:            localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/get_user_info`, { headers })
      .then((res) => setAddress(res.data.address || ""))
      .catch(() => toast.error("Failed to fetch user info"))
      .finally(() => setFetching(false));
  }, []);

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!address.trim()) { toast.error("Address cannot be empty"); return; }
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/update_address`,
        { address },
        { headers }
      );
      toast.success(res.data.message || "Address updated successfully!");
    } catch {
      toast.error("Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center gap-3 mb-7">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))' }}
        >
          <FaLock className="w-4 h-4 text-gilt-600 dark:text-gilt-400" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-parchment-900 dark:text-parchment-100">Settings</h2>
          <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mt-0.5">
            Manage your account preferences
          </p>
        </div>
      </div>

      <div className="space-y-4 max-w-xl">

        {/* Delivery address */}
        <SettingCard
          icon={FaMapMarkerAlt}
          iconColor="bg-gilt-500/12 dark:bg-gilt-500/15 text-gilt-600 dark:text-gilt-400"
          title="Delivery Address"
          description="Used for order deliveries"
          delay={0}
        >
          <form onSubmit={handleUpdateAddress} noValidate className="space-y-4">
            <div>
              <label className="field-label" htmlFor="address">Your Address</label>
              {fetching ? (
                <div className="input-field animate-pulse bg-parchment-200 dark:bg-navy-600 text-transparent select-none">
                  Loading…
                </div>
              ) : (
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City, Country"
                  className="input-field"
                  required
                />
              )}
            </div>
            <button
              type="submit"
              disabled={loading || fetching}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                font-sans font-semibold text-sm text-navy-950
                shadow-sm hover:shadow-glow-gilt transition-all duration-250
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              style={!loading && !fetching
                ? { background: 'linear-gradient(135deg, #F0DE9A, #C9A84C, #B8922A)' }
                : { background: '#C4B5A0' }
              }
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : <FaCheckCircle className="w-4 h-4" />
              }
              {loading ? "Saving…" : "Save Address"}
            </button>
          </form>
        </SettingCard>

        {/* Privacy */}
        <div className="opacity-55 cursor-not-allowed select-none">
          <SettingCard
            icon={FaShieldAlt}
            iconColor="bg-navy-100/20 dark:bg-navy-500/30 text-navy-400 dark:text-navy-300"
            title="Privacy & Security"
            description="Password, 2FA, active sessions"
            badge="Coming Soon"
            delay={0.1}
          />
        </div>

        {/* Notifications */}
        <div className="opacity-55 cursor-not-allowed select-none">
          <SettingCard
            icon={FaBell}
            iconColor="bg-toffee-100 dark:bg-toffee-900/20 text-toffee-600 dark:text-toffee-400"
            title="Notifications"
            description="Email & push preferences"
            badge="Coming Soon"
            delay={0.15}
          />
        </div>

      </div>
    </div>
  );
};

export default Settings;
