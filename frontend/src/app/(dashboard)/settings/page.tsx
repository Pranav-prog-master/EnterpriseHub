"use client";

import { useState } from "react";
import {
  User, Building2, Shield, Bell, Plug, Palette, Globe,
  ChevronDown, ChevronUp, Save, Eye, EyeOff,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchMe } from "@/features/auth/authSlice";
import api from "@/lib/axios";
import { useAppearance, THEMES, type ThemeName } from "@/components/ui/AppearanceProvider";
import toast from "react-hot-toast";

/* ── helpers ── */
function Field({
  label, name, type = "text", value, onChange, placeholder = "", disabled = false,
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          type={isPass ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-[#0a0a0a] border-2 border-[#1e1e1e] px-3 py-2.5 font-mono text-[12px] text-white placeholder:text-[#333] focus:outline-none focus:border-[#2a2a2a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white"
            tabIndex={-1}
          >
            {show ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: {
  label: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#1a1a1a] last:border-0">
      <div>
        <p className="font-mono text-[11px] text-white uppercase tracking-wider">{label}</p>
        <p className="font-mono text-[9px] text-[#444] mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="shrink-0 w-10 h-5 border-2 relative transition-colors"
        style={{ borderColor: checked ? "#00c853" : "#2a2a2a", background: checked ? "#00c85320" : "transparent" }}
      >
        <span
          className="absolute top-0.5 w-3 h-3 transition-all"
          style={{ background: checked ? "#00c853" : "#333", left: checked ? "calc(100% - 14px)" : "2px" }}
        />
      </button>
    </div>
  );
}

function SaveBtn({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#ff3b00] bg-[#ff3b00] font-mono text-[10px] uppercase tracking-widest text-black shadow-[3px_3px_0_#7a1c00] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
    >
      {loading ? (
        <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
      ) : (
        <Save size={11} />
      )}
      Save Changes
    </button>
  );
}

/* ── section wrapper ── */
function Section({
  icon: Icon, title, desc, accentColor, children,
}: {
  icon: React.ElementType; title: string; desc: string; accentColor: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-2 border-[#1e1e1e] bg-[#111]" style={{ borderTopColor: open ? accentColor : "#1e1e1e" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-4 p-5 text-left group"
      >
        <div
          className="w-9 h-9 flex items-center justify-center border-2 shrink-0 transition-colors"
          style={{ borderColor: open ? accentColor : "#2a2a2a", background: open ? `${accentColor}15` : "transparent" }}
        >
          <Icon size={15} style={{ color: open ? accentColor : "#555" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-2xl uppercase tracking-wider text-white leading-none">
            {title}
          </h3>
          <p className="font-mono text-[10px] text-[#444] mt-1">{desc}</p>
        </div>
        {open
          ? <ChevronUp size={14} className="text-[#555] shrink-0 mt-1" />
          : <ChevronDown size={14} className="text-[#555] shrink-0 mt-1" />}
      </button>
      {open && (
        <div className="border-t-2 border-[#1a1a1a] px-5 pb-6 pt-5">
          {children}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const { user, isAdmin } = useAuth();
  const dispatch = useAppDispatch();

  /* ── Profile ── */
  const [profile, setProfile] = useState({
    first_name: user?.first_name || "",
    last_name:  user?.last_name  || "",
    email:      user?.email      || "",
    phone:      (user as any)?.phone      || "",
    job_title:  (user as any)?.job_title  || "",
    department: (user as any)?.department || "",
    avatar:     (user as any)?.avatar     || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await api.patch("/users/me", profile);
      await dispatch(fetchMe());
      toast.success("Profile updated.");
    } catch { toast.error("Failed to update profile."); }
    finally { setProfileLoading(false); }
  };

  /* ── Company (Admin only) ── */
  const [company, setCompany] = useState({
    name:    (user as any)?.company?.name   || "",
    domain:  (user as any)?.company?.domain || "",
    website: "",
    address: "",
    industry:"",
    size:    "",
  });
  const [companyLoading, setCompanyLoading] = useState(false);

  const saveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyLoading(true);
    try {
      await api.patch("/users/company", company);
      toast.success("Company settings saved.");
    } catch { toast.error("Failed to save company settings."); }
    finally { setCompanyLoading(false); }
  };

  /* ── Security ── */
  const [security, setSecurity] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [twoFA, setTwoFA] = useState((user as any)?.two_factor_enabled || false);
  const [secLoading, setSecLoading] = useState(false);

  const saveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (security.new_password !== security.confirm_password) {
      toast.error("Passwords do not match."); return;
    }
    setSecLoading(true);
    try {
      await api.post("/auth/change-password", {
        current_password: security.current_password,
        new_password:     security.new_password,
      });
      setSecurity({ current_password: "", new_password: "", confirm_password: "" });
      toast.success("Password changed.");
    } catch { toast.error("Failed to change password."); }
    finally { setSecLoading(false); }
  };

  /* ── Notifications ── */
  const [notifs, setNotifs] = useState({
    email_login:    true,
    email_projects: true,
    email_hr:       false,
    push_tasks:     true,
    push_mentions:  true,
    push_updates:   false,
  });
  const [notifsLoading, setNotifsLoading] = useState(false);

  const saveNotifs = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifsLoading(true);
    try {
      await api.patch("/users/me/notifications", notifs);
      toast.success("Notification preferences saved.");
    } catch { toast.error("Failed to save preferences."); }
    finally { setNotifsLoading(false); }
  };

  /* ── Integrations (Admin only) ── */
  const [integrations, setIntegrations] = useState({
    slack_webhook:  "",
    github_token:   "",
    jira_url:       "",
    jira_token:     "",
    google_client:  "",
  });
  const [intLoading, setIntLoading] = useState(false);

  const saveIntegrations = async (e: React.FormEvent) => {
    e.preventDefault();
    setIntLoading(true);
    try {
      await api.patch("/users/integrations", integrations);
      toast.success("Integrations saved.");
    } catch { toast.error("Failed to save integrations."); }
    finally { setIntLoading(false); }
  };

  const { appearance, setAppearance } = useAppearance();
  const [appLoading, setAppLoading] = useState(false);

  const saveAppearance = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppLoading(true);
    setAppearance(appearance);
    toast.success("Appearance saved.");
    setAppLoading(false);
  };

  /* ── Localization ── */
  const CURRENCIES = [
    // Major / Most Used
    { code: "USD", symbol: "$",       name: "US Dollar" },
    { code: "EUR", symbol: "€",       name: "Euro" },
    { code: "GBP", symbol: "£",       name: "British Pound" },
    { code: "JPY", symbol: "¥",       name: "Japanese Yen" },
    { code: "CNY", symbol: "¥",       name: "Chinese Yuan" },
    { code: "INR", symbol: "₹",       name: "Indian Rupee" },
    { code: "CAD", symbol: "CA$",     name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$",      name: "Australian Dollar" },
    { code: "CHF", symbol: "Fr",      name: "Swiss Franc" },
    { code: "HKD", symbol: "HK$",     name: "Hong Kong Dollar" },
    { code: "SGD", symbol: "S$",      name: "Singapore Dollar" },
    { code: "SEK", symbol: "kr",      name: "Swedish Krona" },
    { code: "NOK", symbol: "kr",      name: "Norwegian Krone" },
    { code: "DKK", symbol: "kr",      name: "Danish Krone" },
    { code: "NZD", symbol: "NZ$",     name: "New Zealand Dollar" },
    { code: "KRW", symbol: "₩",       name: "South Korean Won" },
    { code: "MXN", symbol: "MX$",     name: "Mexican Peso" },
    { code: "BRL", symbol: "R$",      name: "Brazilian Real" },
    { code: "RUB", symbol: "₽",       name: "Russian Ruble" },
    { code: "ZAR", symbol: "R",       name: "South African Rand" },
    // Middle East & Africa
    { code: "AED", symbol: "د.إ",     name: "UAE Dirham" },
    { code: "SAR", symbol: "﷼",       name: "Saudi Riyal" },
    { code: "QAR", symbol: "﷼",       name: "Qatari Riyal" },
    { code: "KWD", symbol: "د.ك",     name: "Kuwaiti Dinar" },
    { code: "BHD", symbol: "BD",      name: "Bahraini Dinar" },
    { code: "OMR", symbol: "﷼",       name: "Omani Rial" },
    { code: "JOD", symbol: "JD",      name: "Jordanian Dinar" },
    { code: "LBP", symbol: "ل.ل",     name: "Lebanese Pound" },
    { code: "ILS", symbol: "₪",       name: "Israeli Shekel" },
    { code: "EGP", symbol: "£",       name: "Egyptian Pound" },
    { code: "MAD", symbol: "MAD",     name: "Moroccan Dirham" },
    { code: "TND", symbol: "DT",      name: "Tunisian Dinar" },
    { code: "DZD", symbol: "دج",      name: "Algerian Dinar" },
    { code: "LYD", symbol: "LD",      name: "Libyan Dinar" },
    { code: "NGN", symbol: "₦",       name: "Nigerian Naira" },
    { code: "GHS", symbol: "₵",       name: "Ghanaian Cedi" },
    { code: "KES", symbol: "KSh",     name: "Kenyan Shilling" },
    { code: "TZS", symbol: "TSh",     name: "Tanzanian Shilling" },
    { code: "UGX", symbol: "USh",     name: "Ugandan Shilling" },
    { code: "ETB", symbol: "Br",      name: "Ethiopian Birr" },
    { code: "XOF", symbol: "CFA",     name: "West African CFA Franc" },
    { code: "XAF", symbol: "FCFA",    name: "Central African CFA Franc" },
    { code: "MUR", symbol: "₨",       name: "Mauritian Rupee" },
    { code: "ZMW", symbol: "ZK",      name: "Zambian Kwacha" },
    { code: "BWP", symbol: "P",       name: "Botswana Pula" },
    { code: "NAD", symbol: "N$",      name: "Namibian Dollar" },
    { code: "MZN", symbol: "MT",      name: "Mozambican Metical" },
    { code: "AOA", symbol: "Kz",      name: "Angolan Kwanza" },
    { code: "RWF", symbol: "RF",      name: "Rwandan Franc" },
    // Asia Pacific
    { code: "TWD", symbol: "NT$",     name: "Taiwan Dollar" },
    { code: "THB", symbol: "฿",       name: "Thai Baht" },
    { code: "MYR", symbol: "RM",      name: "Malaysian Ringgit" },
    { code: "IDR", symbol: "Rp",      name: "Indonesian Rupiah" },
    { code: "PHP", symbol: "₱",       name: "Philippine Peso" },
    { code: "VND", symbol: "₫",       name: "Vietnamese Dong" },
    { code: "PKR", symbol: "₨",       name: "Pakistani Rupee" },
    { code: "BDT", symbol: "৳",       name: "Bangladeshi Taka" },
    { code: "LKR", symbol: "₨",       name: "Sri Lankan Rupee" },
    { code: "NPR", symbol: "₨",       name: "Nepalese Rupee" },
    { code: "MMK", symbol: "K",       name: "Myanmar Kyat" },
    { code: "KHR", symbol: "៛",       name: "Cambodian Riel" },
    { code: "LAK", symbol: "₭",       name: "Lao Kip" },
    { code: "MNT", symbol: "₮",       name: "Mongolian Tugrik" },
    { code: "KZT", symbol: "₸",       name: "Kazakhstani Tenge" },
    { code: "UZS", symbol: "лв",      name: "Uzbekistani Som" },
    { code: "AZN", symbol: "₼",       name: "Azerbaijani Manat" },
    { code: "GEL", symbol: "₾",       name: "Georgian Lari" },
    { code: "AMD", symbol: "֏",       name: "Armenian Dram" },
    { code: "AFN", symbol: "؋",       name: "Afghan Afghani" },
    { code: "IRR", symbol: "﷼",       name: "Iranian Rial" },
    { code: "IQD", symbol: "ع.د",     name: "Iraqi Dinar" },
    { code: "SYP", symbol: "£",       name: "Syrian Pound" },
    { code: "YER", symbol: "﷼",       name: "Yemeni Rial" },
    // Europe
    { code: "PLN", symbol: "zł",      name: "Polish Zloty" },
    { code: "CZK", symbol: "Kč",      name: "Czech Koruna" },
    { code: "HUF", symbol: "Ft",      name: "Hungarian Forint" },
    { code: "RON", symbol: "lei",     name: "Romanian Leu" },
    { code: "BGN", symbol: "лв",      name: "Bulgarian Lev" },
    { code: "HRK", symbol: "kn",      name: "Croatian Kuna" },
    { code: "RSD", symbol: "din",     name: "Serbian Dinar" },
    { code: "UAH", symbol: "₴",       name: "Ukrainian Hryvnia" },
    { code: "BYN", symbol: "Br",      name: "Belarusian Ruble" },
    { code: "ISK", symbol: "kr",      name: "Icelandic Krona" },
    { code: "TRY", symbol: "₺",       name: "Turkish Lira" },
    { code: "MKD", symbol: "ден",     name: "Macedonian Denar" },
    { code: "ALL", symbol: "L",       name: "Albanian Lek" },
    { code: "BAM", symbol: "KM",      name: "Bosnia-Herzegovina Mark" },
    { code: "MDL", symbol: "L",       name: "Moldovan Leu" },
    // Americas
    { code: "ARS", symbol: "$",       name: "Argentine Peso" },
    { code: "CLP", symbol: "$",       name: "Chilean Peso" },
    { code: "COP", symbol: "$",       name: "Colombian Peso" },
    { code: "PEN", symbol: "S/.",     name: "Peruvian Sol" },
    { code: "VES", symbol: "Bs.S",    name: "Venezuelan Bolívar" },
    { code: "UYU", symbol: "$U",      name: "Uruguayan Peso" },
    { code: "PYG", symbol: "₲",       name: "Paraguayan Guarani" },
    { code: "BOB", symbol: "Bs.",     name: "Bolivian Boliviano" },
    { code: "GTQ", symbol: "Q",       name: "Guatemalan Quetzal" },
    { code: "HNL", symbol: "L",       name: "Honduran Lempira" },
    { code: "NIO", symbol: "C$",      name: "Nicaraguan Córdoba" },
    { code: "CRC", symbol: "₡",       name: "Costa Rican Colón" },
    { code: "PAB", symbol: "B/.",     name: "Panamanian Balboa" },
    { code: "DOP", symbol: "RD$",     name: "Dominican Peso" },
    { code: "CUP", symbol: "₱",       name: "Cuban Peso" },
    { code: "JMD", symbol: "J$",      name: "Jamaican Dollar" },
    { code: "TTD", symbol: "TT$",     name: "Trinidad & Tobago Dollar" },
    { code: "BBD", symbol: "Bds$",    name: "Barbadian Dollar" },
    { code: "BSD", symbol: "B$",      name: "Bahamian Dollar" },
    { code: "BZD", symbol: "BZ$",     name: "Belize Dollar" },
    { code: "GYD", symbol: "G$",      name: "Guyanese Dollar" },
    { code: "SRD", symbol: "$",       name: "Surinamese Dollar" },
    // Oceania
    { code: "FJD", symbol: "FJ$",     name: "Fijian Dollar" },
    { code: "PGK", symbol: "K",       name: "Papua New Guinean Kina" },
    { code: "WST", symbol: "WS$",     name: "Samoan Tala" },
    { code: "TOP", symbol: "T$",      name: "Tongan Paʻanga" },
    { code: "VUV", symbol: "VT",      name: "Vanuatu Vatu" },
    { code: "SBD", symbol: "SI$",     name: "Solomon Islands Dollar" },
    // Special / Other
    { code: "XCD", symbol: "EC$",     name: "East Caribbean Dollar" },
    { code: "XPF", symbol: "CFP",     name: "CFP Franc" },
    { code: "BTN", symbol: "Nu",      name: "Bhutanese Ngultrum" },
    { code: "MVR", symbol: "Rf",      name: "Maldivian Rufiyaa" },
    { code: "SCR", symbol: "₨",       name: "Seychellois Rupee" },
    { code: "MOP", symbol: "P",       name: "Macanese Pataca" },
    { code: "BND", symbol: "B$",      name: "Brunei Dollar" },
    { code: "KYD", symbol: "CI$",     name: "Cayman Islands Dollar" },
    { code: "BMD", symbol: "BD$",     name: "Bermudian Dollar" },
    { code: "AWG", symbol: "ƒ",       name: "Aruban Florin" },
    { code: "ANG", symbol: "ƒ",       name: "Netherlands Antillean Guilder" },
    { code: "DJF", symbol: "Fdj",     name: "Djiboutian Franc" },
    { code: "ERN", symbol: "Nfk",     name: "Eritrean Nakfa" },
    { code: "SOS", symbol: "Sh",      name: "Somali Shilling" },
    { code: "SDG", symbol: "ج.س.",    name: "Sudanese Pound" },
    { code: "SSP", symbol: "£",       name: "South Sudanese Pound" },
    { code: "CDF", symbol: "FC",      name: "Congolese Franc" },
    { code: "MGA", symbol: "Ar",      name: "Malagasy Ariary" },
    { code: "MWK", symbol: "MK",      name: "Malawian Kwacha" },
    { code: "ZWL", symbol: "Z$",      name: "Zimbabwean Dollar" },
    { code: "SZL", symbol: "L",       name: "Swazi Lilangeni" },
    { code: "LSL", symbol: "L",       name: "Lesotho Loti" },
    { code: "GMD", symbol: "D",       name: "Gambian Dalasi" },
    { code: "GNF", symbol: "FG",      name: "Guinean Franc" },
    { code: "SLL", symbol: "Le",      name: "Sierra Leonean Leone" },
    { code: "LRD", symbol: "L$",      name: "Liberian Dollar" },
    { code: "CVE", symbol: "$",       name: "Cape Verdean Escudo" },
    { code: "STN", symbol: "Db",      name: "São Tomé & Príncipe Dobra" },
    { code: "KMF", symbol: "CF",      name: "Comorian Franc" },
    { code: "BIF", symbol: "Fr",      name: "Burundian Franc" },
    { code: "HTG", symbol: "G",       name: "Haitian Gourde" },
    { code: "MRU", symbol: "UM",      name: "Mauritanian Ouguiya" },
    { code: "TJS", symbol: "SM",      name: "Tajikistani Somoni" },
    { code: "TMT", symbol: "T",       name: "Turkmenistani Manat" },
    { code: "KGS", symbol: "лв",      name: "Kyrgyzstani Som" },
    { code: "KPW", symbol: "₩",       name: "North Korean Won" },
  ];

  const [locale, setLocale] = useState({ language: "en", timezone: "UTC", date_format: "MM/DD/YYYY", currency: "USD" });
  const [localeLoading, setLocaleLoading] = useState(false);

  const saveLocale = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocaleLoading(true);
    try {
      await api.patch("/users/me/locale", locale);
      toast.success("Localization saved.");
    } catch { toast.error("Failed to save localization."); }
    finally { setLocaleLoading(false); }
  };

  const p = (field: keyof typeof profile) => (v: string) => setProfile((s) => ({ ...s, [field]: v }));
  const c = (field: keyof typeof company) => (v: string) => setCompany((s) => ({ ...s, [field]: v }));
  const s = (field: keyof typeof security) => (v: string) => setSecurity((prev) => ({ ...prev, [field]: v }));
  const i = (field: keyof typeof integrations) => (v: string) => setIntegrations((prev) => ({ ...prev, [field]: v }));

  return (
    <div className="space-y-3 animate-fade-in max-w-3xl">

      {/* Header */}
      <div className="flex items-end justify-between border-b-2 border-[#1e1e1e] pb-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-[#ff3b00]" />
            <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.3em]">System</p>
          </div>
          <h1 className="font-display text-7xl uppercase text-white leading-none tracking-wider">Settings</h1>
          <p className="font-mono text-[10px] text-[#444] mt-1 uppercase tracking-wider">Platform configuration</p>
        </div>
        <div
          className="flex items-center gap-2 border-2 px-3 py-1.5"
          style={{ borderColor: isAdmin ? "#ff3b00" : "#0057ff", background: isAdmin ? "#ff3b0015" : "#0057ff15" }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: isAdmin ? "#ff3b00" : "#0057ff" }}>
            {isAdmin ? "Admin" : "Employee"}
          </span>
        </div>
      </div>

      {/* ── 1. Profile ── */}
      <Section icon={User} title="Profile" desc="Update your personal information, avatar, and preferences" accentColor="#0057ff">
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name"  name="first_name" value={profile.first_name} onChange={p("first_name")} placeholder="John" />
            <Field label="Last Name"   name="last_name"  value={profile.last_name}  onChange={p("last_name")}  placeholder="Doe" />
          </div>
          <Field label="Email Address" name="email"     value={profile.email}     onChange={p("email")}     type="email" placeholder="you@company.com" disabled />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone Number" name="phone"     value={profile.phone}     onChange={p("phone")}     placeholder="+1 555 000 0000" />
            <Field label="Job Title"    name="job_title" value={profile.job_title} onChange={p("job_title")} placeholder="Software Engineer" />
          </div>
          <Field label="Department" name="department" value={profile.department} onChange={p("department")} placeholder="Engineering" />
          <div className="flex justify-end pt-2">
            <SaveBtn loading={profileLoading} />
          </div>
        </form>
      </Section>

      {/* ── 2. Company (Admin only) ── */}
      {isAdmin && (
        <Section icon={Building2} title="Company" desc="Manage company details, branding, and workspace settings" accentColor="#00c853">
          <form onSubmit={saveCompany} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Company Name"   name="name"     value={company.name}     onChange={c("name")}     placeholder="Acme Corp" />
              <Field label="Domain"         name="domain"   value={company.domain}   onChange={c("domain")}   placeholder="acme.com" />
            </div>
            <Field label="Website"          name="website"  value={company.website}  onChange={c("website")}  placeholder="https://acme.com" />
            <Field label="Office Address"   name="address"  value={company.address}  onChange={c("address")}  placeholder="123 Main St, New York, NY" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Industry"       name="industry" value={company.industry} onChange={c("industry")} placeholder="Technology" />
              <Field label="Company Size"   name="size"     value={company.size}     onChange={c("size")}     placeholder="50–200 employees" />
            </div>
            <div className="flex justify-end pt-2">
              <SaveBtn loading={companyLoading} />
            </div>
          </form>
        </Section>
      )}

      {/* ── 3. Security ── */}
      <Section icon={Shield} title="Security" desc="Password, two-factor authentication, and active sessions" accentColor="#ff3b00">
        <form onSubmit={saveSecurity} className="space-y-4">
          <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] mb-1">Change Password</p>
          <Field label="Current Password" name="current_password" type="password" value={security.current_password} onChange={s("current_password")} placeholder="••••••••" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="New Password"     name="new_password"     type="password" value={security.new_password}     onChange={s("new_password")}     placeholder="Min. 8 characters" />
            <Field label="Confirm Password" name="confirm_password" type="password" value={security.confirm_password} onChange={s("confirm_password")} placeholder="Repeat password" />
          </div>
          <div className="border-t border-[#1a1a1a] pt-4">
            <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] mb-3">Two-Factor Authentication</p>
            <Toggle
              label="Enable 2FA"
              desc="Require a verification code on every sign-in"
              checked={twoFA}
              onChange={setTwoFA}
            />
          </div>
          {isAdmin && (
            <div className="border-t border-[#1a1a1a] pt-4">
              <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] mb-2">Active Sessions</p>
              <div className="border border-[#1a1a1a] p-3 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] text-white uppercase">Current Session</p>
                  <p className="font-mono text-[9px] text-[#444] mt-0.5">This device · Active now</p>
                </div>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#00c853] rounded-full" />
                  <span className="font-mono text-[9px] text-[#00c853] uppercase">Active</span>
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <SaveBtn loading={secLoading} />
          </div>
        </form>
      </Section>

      {/* ── 4. Notifications ── */}
      <Section icon={Bell} title="Notifications" desc="Email, push, and in-app notification preferences" accentColor="#ffd600">
        <form onSubmit={saveNotifs} className="space-y-0">
          <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] mb-3">Email Notifications</p>
          <Toggle label="Login Alerts"       desc="Get notified of new sign-ins to your account"          checked={notifs.email_login}    onChange={(v) => setNotifs((n) => ({ ...n, email_login: v }))} />
          <Toggle label="Project Updates"    desc="Receive emails when projects or tasks are updated"      checked={notifs.email_projects} onChange={(v) => setNotifs((n) => ({ ...n, email_projects: v }))} />
          {isAdmin && (
            <Toggle label="HR Alerts"        desc="Get notified of leave requests and HR activity"         checked={notifs.email_hr}       onChange={(v) => setNotifs((n) => ({ ...n, email_hr: v }))} />
          )}
          <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] mt-4 mb-3">Push Notifications</p>
          <Toggle label="Task Assignments"   desc="Notify when a task is assigned to you"                  checked={notifs.push_tasks}     onChange={(v) => setNotifs((n) => ({ ...n, push_tasks: v }))} />
          <Toggle label="Mentions"           desc="Notify when someone mentions you in a comment"          checked={notifs.push_mentions}  onChange={(v) => setNotifs((n) => ({ ...n, push_mentions: v }))} />
          <Toggle label="Platform Updates"   desc="Receive announcements about new features"               checked={notifs.push_updates}   onChange={(v) => setNotifs((n) => ({ ...n, push_updates: v }))} />
          <div className="flex justify-end pt-4">
            <SaveBtn loading={notifsLoading} />
          </div>
        </form>
      </Section>

      {/* ── 5. Integrations (Admin only) ── */}
      {isAdmin && (
        <Section icon={Plug} title="Integrations" desc="Connect Slack, Google Workspace, GitHub, Jira, and more" accentColor="#0057ff">
          <form onSubmit={saveIntegrations} className="space-y-4">
            <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] mb-1">Slack</p>
            <Field label="Slack Webhook URL"      name="slack_webhook" value={integrations.slack_webhook} onChange={i("slack_webhook")} placeholder="https://hooks.slack.com/services/..." />
            <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] mt-3 mb-1">GitHub</p>
            <Field label="GitHub Personal Token"  name="github_token"  value={integrations.github_token}  onChange={i("github_token")}  type="password" placeholder="ghp_••••••••••••" />
            <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] mt-3 mb-1">Jira</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Jira Base URL"   name="jira_url"   value={integrations.jira_url}   onChange={i("jira_url")}   placeholder="https://yourorg.atlassian.net" />
              <Field label="Jira API Token"  name="jira_token" value={integrations.jira_token} onChange={i("jira_token")} type="password" placeholder="••••••••••••" />
            </div>
            <p className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] mt-3 mb-1">Google Workspace</p>
            <Field label="Google OAuth Client ID" name="google_client" value={integrations.google_client} onChange={i("google_client")} placeholder="xxxx.apps.googleusercontent.com" />
            <div className="flex justify-end pt-2">
              <SaveBtn loading={intLoading} />
            </div>
          </form>
        </Section>
      )}

      {/* ── 6. Appearance ── */}
      <Section icon={Palette} title="Appearance" desc="Theme, density, font size, and display preferences" accentColor="#ffd600">
        <form onSubmit={saveAppearance} className="space-y-5">

          {/* Theme */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] mb-3">Theme — {THEMES.length} options</p>
            <div className="grid grid-cols-4 gap-2">
              {THEMES.map((t) => {
                const active = appearance.theme === t.id;
                return (
                  <button
                    key={t.id} type="button"
                    onClick={() => setAppearance({ ...appearance, theme: t.id as ThemeName })}
                    className="relative flex flex-col items-start gap-1.5 p-2.5 border-2 transition-all text-left overflow-hidden"
                    style={{
                      borderColor: active ? t.accent : "var(--border)",
                      background:  active ? `${t.accent}18` : t.bg,
                      boxShadow:   active ? `3px 3px 0 ${t.accent}` : "none",
                    }}
                  >
                    {/* Color swatch strip */}
                    <div className="flex w-full h-2 gap-0.5">
                      <div className="flex-1" style={{ background: t.bg }} />
                      <div className="flex-1" style={{ background: t.surface }} />
                      <div className="flex-1" style={{ background: t.accent }} />
                    </div>
                    <span
                      className="font-mono text-[9px] uppercase tracking-wider w-full truncate"
                      style={{ color: active ? t.accent : "var(--text-muted)" }}
                    >
                      {t.label}
                    </span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.accent }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Density */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] mb-2">Density</p>
            <div className="grid grid-cols-3 gap-2">
              {(["compact", "comfortable", "spacious"] as const).map((opt) => {
                const bars: Record<string, number> = { compact: 4, comfortable: 3, spacious: 2 };
                const active = appearance.density === opt;
                return (
                  <button
                    key={opt} type="button"
                    onClick={() => setAppearance({ ...appearance, density: opt })}
                    className="flex flex-col items-center gap-2 py-4 border-2 font-mono text-[10px] uppercase tracking-wider transition-all"
                    style={{
                      borderColor: active ? "#ffd600" : "#1e1e1e",
                      background:  active ? "#ffd60012" : "#0a0a0a",
                      color:       active ? "#ffd600"  : "#555",
                      boxShadow:   active ? "3px 3px 0 #7a6600" : "none",
                    }}
                  >
                    <div className="flex flex-col gap-[3px] w-8">
                      {Array.from({ length: bars[opt] }).map((_, i) => (
                        <div key={i} className="h-[3px] w-full" style={{ background: active ? "#ffd600" : "#333" }} />
                      ))}
                    </div>
                    <span>{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#ffd600]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] mb-2">Font Size</p>
            <div className="grid grid-cols-3 gap-2">
              {(["small", "medium", "large"] as const).map((opt) => {
                const sizes: Record<string, string> = { small: "text-[11px]", medium: "text-[14px]", large: "text-[18px]" };
                const active = appearance.font_size === opt;
                return (
                  <button
                    key={opt} type="button"
                    onClick={() => setAppearance({ ...appearance, font_size: opt })}
                    className="flex flex-col items-center gap-2 py-4 border-2 font-mono uppercase tracking-wider transition-all"
                    style={{
                      borderColor: active ? "#ffd600" : "#1e1e1e",
                      background:  active ? "#ffd60012" : "#0a0a0a",
                      color:       active ? "#ffd600"  : "#555",
                      boxShadow:   active ? "3px 3px 0 #7a6600" : "none",
                    }}
                  >
                    <span className={`${sizes[opt]} font-bold leading-none`} style={{ color: active ? "#ffd600" : "#444" }}>Aa</span>
                    <span className="text-[10px]">{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#ffd600]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <SaveBtn loading={appLoading} />
          </div>
        </form>
      </Section>

      {/* ── 7. Localization ── */}
      <Section icon={Globe} title="Localization" desc="Language, timezone, date format, and currency settings" accentColor="#555">
        <form onSubmit={saveLocale} className="space-y-5">

          {/* Language + Timezone */}
          <div className="grid grid-cols-2 gap-3">
            {([
              ["language",    "Language",    [["en","English"],["es","Spanish"],["fr","French"],["de","German"],["ar","Arabic"],["zh","Chinese"],["ja","Japanese"],["pt","Portuguese"],["ru","Russian"],["hi","Hindi"]]],
              ["timezone",    "Timezone",    [["UTC","UTC"],["America/New_York","New York (EST)"],["America/Chicago","Chicago (CST)"],["America/Denver","Denver (MST)"],["America/Los_Angeles","Los Angeles (PST)"],["Europe/London","London (GMT)"],["Europe/Paris","Paris (CET)"],["Europe/Berlin","Berlin (CET)"],["Asia/Dubai","Dubai (GST)"],["Asia/Kolkata","India (IST)"],["Asia/Singapore","Singapore (SGT)"],["Asia/Tokyo","Tokyo (JST)"],["Asia/Shanghai","Shanghai (CST)"],["Australia/Sydney","Sydney (AEST)"],["Pacific/Auckland","Auckland (NZST)"]]],
              ["date_format", "Date Format", [["MM/DD/YYYY","MM/DD/YYYY"],["DD/MM/YYYY","DD/MM/YYYY"],["YYYY-MM-DD","YYYY-MM-DD"],["DD-MM-YYYY","DD-MM-YYYY"],["DD.MM.YYYY","DD.MM.YYYY"]]],
            ] as [keyof typeof locale, string, [string, string][]][]).map(([key, label, opts]) => (
              <div key={key}>
                <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] mb-1.5">{label}</label>
                <div className="relative">
                  <select
                    value={locale[key]}
                    onChange={(e) => setLocale((l) => ({ ...l, [key]: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border-2 border-[#1e1e1e] px-3 py-2.5 font-mono text-[12px] text-white focus:outline-none focus:border-[#555] transition-colors appearance-none pr-8"
                  >
                    {opts.map(([val, lbl]) => (
                      <option key={val} value={val} style={{ background: "#111" }}>{lbl}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]">&#9660;</span>
                </div>
              </div>
            ))}
          </div>

          {/* Currency — full searchable list */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] mb-1.5">Currency</label>
            <div className="relative">
              <select
                value={locale.currency}
                onChange={(e) => setLocale((l) => ({ ...l, currency: e.target.value }))}
                className="w-full bg-[#0a0a0a] border-2 border-[#1e1e1e] px-3 py-2.5 font-mono text-[12px] text-white focus:outline-none focus:border-[#555] transition-colors appearance-none pr-8"
                size={1}
              >
                {CURRENCIES.map(({ code, symbol, name }) => (
                  <option key={code} value={code} style={{ background: "#111" }}>
                    {code} — {symbol} — {name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]">&#9660;</span>
            </div>

            {/* Live preview */}
            {(() => {
              const selected = CURRENCIES.find(c => c.code === locale.currency);
              return selected ? (
                <div className="mt-2 flex items-center gap-3 border border-[#1e1e1e] bg-[#0d0d0d] px-3 py-2">
                  <div className="w-8 h-8 border-2 border-[#2a2a2a] flex items-center justify-center bg-[#111] shrink-0">
                    <span className="font-mono text-[13px] font-bold" style={{ color: "var(--accent)" }}>{selected.symbol}</span>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] text-white">{selected.name}</p>
                    <p className="font-mono text-[9px] text-[#555] mt-0.5 uppercase tracking-wider">
                      {selected.code} &nbsp;&middot;&nbsp; Preview: {selected.symbol}1,234.56
                    </p>
                  </div>
                  <div className="ml-auto font-mono text-[10px] text-[#333] uppercase tracking-widest">
                    {selected.code}
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          <div className="flex justify-end pt-1">
            <SaveBtn loading={localeLoading} />
          </div>
        </form>
      </Section>

      {/* Version */}
      <div className="border-2 border-[#1a1a1a] bg-[#0d0d0d] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[#333] uppercase tracking-widest">EnterpriseHub AI</span>
          <span className="tag-brutal text-[#00c853] border-[#00c853] text-[9px]">v1.0.0</span>
        </div>
        <span className="font-mono text-[10px] text-[#333] uppercase">Build 2026.07</span>
      </div>

    </div>
  );
}
