// components/loader.tsx
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/components/smooth-scroll";

const MIN_MS = 1600; // minimum visible time
const MAX_MS = 6000; // never wait longer than this

const criticalAssets = () =>
    Promise.race([
        Promise.all([
            document.fonts.ready,
            ...Array.from(
                document.querySelectorAll<HTMLImageElement>("[data-critical-img]")
            ).map((img) => img.decode().catch(() => undefined)),
        ]),
        new Promise((r) => setTimeout(r, MAX_MS)),
    ]);

export function Loader() {
    const rootRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();
    const lenisRef = useRef(lenis);
    lenisRef.current = lenis;

    useEffect(() => {
        const root = rootRef.current;
        const html = document.documentElement;
        if (!root) return;

        if (html.classList.contains("skip-loader")) {
            root.remove();
            return;
        }

        gsap.registerPlugin(ScrollTrigger);
        lenisRef.current?.stop();

        let cancelled = false;
        const anims: gsap.core.Animation[] = [];
        const state = { p: 0 };
        const apply = () => root.style.setProperty("--p", String(state.p));
        apply();

        const creep = gsap
            .timeline()
            // slow start, gradually speeding up
            .to(state, { p: 0.55, duration: 1.6, ease: "power1.in", onUpdate: apply })
            // glides on at the same speed, then settles at the wait point
            .to(state, { p: 0.92, duration: 1.1, ease: "power1.out", onUpdate: apply });
        anims.push(creep);

        const done = () => {
            root.style.display = "none";
            html.classList.remove("is-loading");
            try { sessionStorage.setItem("loader-seen", "1"); } catch { }
            lenisRef.current?.start();
            ScrollTrigger.refresh();
            window.dispatchEvent(new Event("loader:done"));
        };

        const finish = () => {
            if (cancelled) return;
            creep.kill();
            anims.push(
                gsap
                    .timeline({ onComplete: done })
                    // constant fast speed, so the last stretch is quick whatever p is
                    .to(state, {
                        p: 1,
                        duration: Math.max(0.15, (1 - state.p) / 1.1),
                        ease: "none",
                        onUpdate: apply,
                    })
                    .to({}, { duration: 0.2 })
                    .add("lift")
                    .to(root, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "lift")
                    .add(() => window.dispatchEvent(new Event("loader:reveal")), "lift+=0.35")
            );
        };

        const start = performance.now();
        criticalAssets().then(() => {
            if (cancelled) return;
            const wait = Math.max(0, MIN_MS - (performance.now() - start));
            anims.push(gsap.delayedCall(wait / 1000, finish));
        });

        return () => {
            cancelled = true;
            anims.forEach((a) => a.kill());
        };
    }, []);

    return (
        <div id="loader" ref={rootRef} role="status" aria-live="polite">
            <span className="sr-only">Loading</span>
            <div className="loader-name font-serif" aria-hidden="true">
                <span className="base">Anas Alam</span>
                <span className="fill">Anas Alam</span>
            </div>
            <div className="loader-bar" aria-hidden="true" />
        </div>
    );
}
