"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Calendar, User } from "lucide-react";
import { useState } from "react";

export default function BottomNav() {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const navItems = [
    { id: "home", label: "Home", href: "/", icon: Home },
    { id: "services", label: "Services", href: "#services", icon: Layers },
    { id: "book", label: "Book", href: "#contact", icon: Calendar },
  ];

  return (
    <>
      <style>{`
        .bottom-nav-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 90;
          background: rgba(3, 8, 16, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 243, 255, 0.15);
          padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
          transition: transform 0.3s ease;
        }

        /* Visible on all screens per user request */

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.2s, transform 0.2s;
          position: relative;
        }

        .bottom-nav-item:hover, .bottom-nav-item:active {
          color: #00f3ff;
          transform: translateY(-2px);
        }

        .bottom-nav-label {
          font-family: var(--font-orbitron), monospace;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .login-btn-nav {
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .login-popup {
          position: absolute;
          bottom: 120%;
          right: 0;
          width: Max(200px, 60vw);
          background: rgba(3, 8, 16, 0.95);
          border: 1px solid rgba(0, 243, 255, 0.2);
          border-radius: 0.5rem;
          padding: 1rem;
          color: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 243, 255, 0.1);
          animation: fadeUpPopup 0.2s ease-out forwards;
        }

        @keyframes fadeUpPopup {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          background: white;
          color: #1f2937;
          font-weight: 600;
          font-size: 0.8rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .google-btn:hover {
          background: #f3f4f6;
        }
      `}</style>
      <nav className="bottom-nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isHovered === item.id;
          return (
            <Link 
              key={item.id} 
              href={item.href} 
              className="bottom-nav-item"
              onMouseEnter={() => setIsHovered(item.id)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} style={{ filter: active ? 'drop-shadow(0 0 5px rgba(0,243,255,0.6))' : 'none' }} />
              <span className="bottom-nav-label" style={{ color: active ? '#00f3ff' : 'inherit' }}>{item.label}</span>
            </Link>
          );
        })}

        {/* Profile / Login Mock */}
        <div 
          className="bottom-nav-item login-btn-nav"
          onMouseEnter={() => setIsHovered("profile")}
          onMouseLeave={() => setIsHovered(null)}
        >
          <User size={22} strokeWidth={isHovered === "profile" ? 2.5 : 2} style={{ filter: isHovered === "profile" ? 'drop-shadow(0 0 5px rgba(0,243,255,0.6))' : 'none' }} />
          <span className="bottom-nav-label" style={{ color: isHovered === "profile" ? '#00f3ff' : 'inherit' }}>Profile</span>
          
          {/* Mock Login Popup shown on hover/focus */}
          {isHovered === "profile" && (
            <div className="login-popup">
              <p style={{ 
                fontFamily: "var(--font-orbitron), monospace", 
                fontSize: "0.75rem", 
                fontWeight: 700, 
                marginBottom: "0.75rem", 
                textAlign: "center",
                color: "#00f3ff" 
              }}>
                ACCESS CONTROL
              </p>
              <button className="google-btn" onClick={() => alert("Google Login mock triggered!")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
