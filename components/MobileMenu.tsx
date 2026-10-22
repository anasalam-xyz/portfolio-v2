"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export interface MenuItem {
  label: string;
  href: string;
  onClick?: () => void;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items?: MenuItem[];
  activeHref?: string;
  width?: number;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

function MenuButton({
  label,
  onClick,
  isOpen,
  index,
  isActive,
}: {
  label: string;
  onClick?: () => void;
  isOpen: boolean;
  index: number;
  isActive?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const animatingRef = useRef(false);
  const pendingLeaveRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const chars = label.split("");
  const lockDuration = 25 * chars.length + 300;

  const handleEnter = useCallback(() => {
    pendingLeaveRef.current = false;
    if (hovered) return;
    setHovered(true);
    animatingRef.current = true;
    setTimeout(() => {
      animatingRef.current = false;
      if (pendingLeaveRef.current) {
        pendingLeaveRef.current = false;
        setHovered(false);
      }
    }, lockDuration);
  }, [hovered, lockDuration]);

  const handleLeave = useCallback(() => {
    if (animatingRef.current) {
      pendingLeaveRef.current = true;
    } else {
      setHovered(false);
    }
  }, []);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer select-none transition-colors duration-160 focus-ring"
      style={{
        backgroundColor: hovered ? "var(--nav-link-hover-bg)" : "transparent",
      }}
      animate={{
        opacity: isOpen ? 1 : 0,
        y: isOpen ? 0 : (shouldReduceMotion ? 0 : 6),
      }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : 0.3,
        delay: isOpen ? 0.05 + 0.035 * index : 0,
        ease,
      }}
    >
      <div
        className="text-[18px] uppercase leading-none overflow-hidden"
        style={{
          fontFamily: "'Trobika', 'Bebas Neue', var(--font-dm-sans), sans-serif",
          letterSpacing: "0.03em",
          fontWeight: 700,
          height: "1.25em",
        }}
      >
        <div className="flex items-center">
          {chars.map((char, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden"
              style={{ height: "1.25em" }}
            >
              <span
                className="flex flex-col"
                style={{
                  transitionProperty: shouldReduceMotion ? "none" : "transform",
                  transitionDuration: hovered ? "450ms" : "0ms",
                  transitionDelay: hovered ? `${20 * i}ms` : "0ms",
                  transform: hovered && !shouldReduceMotion ? "translateY(-50%)" : "translateY(0%)",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <span
                  className="block"
                  style={{
                    height: "1.25em",
                    lineHeight: "1.25em",
                    color: isActive ? "var(--accent)" : "var(--nav-text)",
                  }}
                >
                  {char}
                </span>
                <span
                  className="block"
                  style={{
                    height: "1.25em",
                    lineHeight: "1.25em",
                    color: "var(--accent)",
                  }}
                  aria-hidden
                >
                  {char}
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Active state indicator dot */}
      {isActive ? (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: "var(--accent)" }}
          aria-hidden="true"
        />
      ) : (
        <span className="w-1.5 h-1.5 shrink-0 opacity-0" aria-hidden="true" />
      )}
    </motion.button>
  );
}

export function MobileMenu({
  isOpen,
  onClose,
  items,
  activeHref = "#",
  width,
  triggerRef,
}: MobileMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const defaultItems: MenuItem[] = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Work", href: "#projects" },
    { label: "Art", href: "#art" },
    { label: "Contact", href: "#footer" },
  ];

  const menuItems = items ?? defaultItems;

  const handleItemClick = useCallback(
    (item: MenuItem) => {
      onClose();
      if (item.onClick) {
        item.onClick();
      }
    },
    [onClose]
  );

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (containerRef.current && containerRef.current.contains(target)) {
        return;
      }
      if (triggerRef?.current && triggerRef.current.contains(target)) {
        return;
      }
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          id="mobile-nav-menu"
          role="dialog"
          aria-label="Mobile navigation menu"
          className="pointer-events-auto backdrop-blur-xl flex flex-col p-2 overflow-hidden mt-2 z-50"
          style={{
            width: width ? `${width}px` : "100%",
            backgroundColor: "var(--nav-bg)",
            border: "1px solid var(--nav-border)",
            boxShadow: "var(--nav-shadow-scrolled)",
            borderRadius: 24,
          }}
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : -8,
            scale: shouldReduceMotion ? 1 : 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : -6,
            scale: shouldReduceMotion ? 1 : 0.98,
          }}
          transition={{
            duration: shouldReduceMotion ? 0.1 : 0.25,
            ease,
          }}
        >
          <div className="flex flex-col gap-0.5 w-full">
            {menuItems.map((item, idx) => (
              <MenuButton
                key={item.label}
                label={item.label}
                onClick={() => handleItemClick(item)}
                isOpen={isOpen}
                index={idx}
                isActive={item.href === activeHref}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
