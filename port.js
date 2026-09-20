      window.addEventListener("load", () => {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        /* 1. Theme Management & VANTA */
        let vantaEffect = null;
        const themeToggle = document.getElementById("themeToggle");
        const themeToggleMobile = document.getElementById("themeToggleMobile");

        function updateThemeUI(theme) {
          const isDark = theme === "dark";
          const icon = isDark ? "☀️" : "🌙";
          const label = isDark ? "Switch to light theme" : "Switch to dark theme";
          if (themeToggle) {
            themeToggle.textContent = icon;
            themeToggle.setAttribute("aria-label", label);
            themeToggle.setAttribute("title", label);
          }
          if (themeToggleMobile) {
            themeToggleMobile.textContent = icon + (isDark ? " Light Mode" : " Dark Mode");
          }
          if (vantaEffect && typeof vantaEffect.setOptions === "function") {
            vantaEffect.setOptions({
              color: isDark ? 0x2d6de8 : 0x2563eb,
              backgroundColor: isDark ? 0x0c1e4a : 0xf0f5ff,
            });
          }
        }

        function setTheme(theme) {
          document.documentElement.setAttribute("data-theme", theme);
          try {
            localStorage.setItem("portfolio-theme", theme);
          } catch (e) {}
          updateThemeUI(theme);
        }

        const currentTheme =
          document.documentElement.getAttribute("data-theme") || "light";
        updateThemeUI(currentTheme);

        if (typeof VANTA !== "undefined" && !reducedMotion) {
          const isDark = currentTheme === "dark";
          vantaEffect = VANTA.NET({
            el: "#vanta-hero",
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            color: isDark ? 0x2d6de8 : 0x2563eb,
            backgroundColor: isDark ? 0x0c1e4a : 0xf0f5ff,
            points: 10,
            maxDistance: 22,
            spacing: 18,
          });
        }

        function toggleTheme() {
          const active =
            document.documentElement.getAttribute("data-theme") || "light";
          setTheme(active === "dark" ? "light" : "dark");
        }

        if (themeToggle) {
          themeToggle.addEventListener("click", toggleTheme);
        }

        /* 2. Custom cursor */
        if (window.matchMedia("(pointer:fine)").matches) {
          const co = document.getElementById("cursorOuter"),
            cd = document.getElementById("cursorDot");
          let mx = 0,
            my = 0,
            ox = 0,
            oy = 0;
          document.addEventListener("mousemove", (e) => {
            mx = e.clientX;
            my = e.clientY;
            cd.style.left = mx + "px";
            cd.style.top = my + "px";
          });
          document.addEventListener("mouseleave", () => {
            co.style.opacity = "0";
            cd.style.opacity = "0";
          });
          document.addEventListener("mouseenter", () => {
            co.style.opacity = ".45";
            cd.style.opacity = "1";
          });
          (function loop() {
            ox += (mx - ox) * 0.12;
            oy += (my - oy) * 0.12;
            co.style.left = ox + "px";
            co.style.top = oy + "px";
            requestAnimationFrame(loop);
          })();
          document.querySelectorAll("a,button,[data-tilt]").forEach((el) => {
            el.addEventListener("mouseenter", () => {
              co.classList.add("hov");
              cd.classList.add("hov");
            });
            el.addEventListener("mouseleave", () => {
              co.classList.remove("hov");
              cd.classList.remove("hov");
            });
          });
        }

        /* 3. Nav */
        const nav = document.getElementById("nav");
        const ham = document.getElementById("navHamburger");
        const drw = document.getElementById("navDrawer");
        const dls = drw.querySelectorAll(".nav-link");
        const ttd = document.getElementById("themeToggleMobile");

        window.addEventListener(
          "scroll",
          () => {
            nav.classList.toggle("scrolled", scrollY > 40);
            if (drw.classList.contains("open")) close();
          },
          { passive: true },
        );
        function open() {
          drw.classList.add("open");
          ham.setAttribute("aria-expanded", "true");
          dls.forEach((l) => l.setAttribute("tabindex", "0"));
          if (ttd) ttd.setAttribute("tabindex", "0");
        }
        function close() {
          drw.classList.remove("open");
          ham.setAttribute("aria-expanded", "false");
          dls.forEach((l) => l.setAttribute("tabindex", "-1"));
          if (ttd) ttd.setAttribute("tabindex", "-1");
        }
        ham.addEventListener("click", () =>
          drw.classList.contains("open") ? close() : open(),
        );
        dls.forEach((l) => l.addEventListener("click", close));
        if (ttd) {
          ttd.addEventListener("click", () => {
            toggleTheme();
            close();
          });
        }
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") close();
        });

        // Active section tracking
        const sections = document.querySelectorAll("section[id]");
        const nls = document.querySelectorAll(".nav-link");
        const setActive = (id) =>
          nls.forEach((l) => {
            const is = l.getAttribute("href") === "#" + id;
            l.classList.toggle("active", is);
            l.setAttribute("aria-current", is ? "page" : "false");
          });
        sections.forEach((s) =>
          new IntersectionObserver(
            (es) =>
              es.forEach((e) => {
                if (e.isIntersecting) setActive(e.target.id);
              }),
            { rootMargin: "-40% 0px -55% 0px" },
          ).observe(s),
        );

        /* 4. Hire float */
        const hf = document.getElementById("hireFloat");
        window.addEventListener(
          "scroll",
          () => hf.classList.toggle("visible", scrollY > 300),
          { passive: true },
        );

        /* 5. GSAP scroll reveals */
        if (typeof gsap !== "undefined" && !reducedMotion) {
          gsap.registerPlugin(ScrollTrigger);
          const T = (sel, from, to, stagger = 0) =>
            gsap.utils.toArray(sel).forEach((el, i) =>
              gsap.fromTo(el, from, {
                ...to,
                delay: i * stagger,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
            );

          // Hero
          gsap
            .timeline({ delay: 0.15 })
            .to("#heroEyebrow", {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power3.out",
            })
            .to(
              "#heroName",
              { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
              "-=.35",
            )
            .to(
              "#heroRole",
              { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
              "-=.45",
            )
            .to(
              "#heroDesc",
              { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
              "-=.40",
            )
            .to(
              "#heroBtns",
              { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
              "-=.30",
            )
            .to(
              "#heroCards",
              { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
              "-=.45",
            );

          T(
            ".rv-up",
            { opacity: 0, y: 44 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            0.08,
          );
          T(
            ".rv-left",
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" },
          );
          T(
            ".rv-right",
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" },
          );
          T(
            ".rv-scale",
            { opacity: 0, scale: 0.88 },
            { opacity: 1, scale: 1, duration: 0.65, ease: "back.out(1.4)" },
            0.1,
          );
          gsap.utils.toArray(".skill-card").forEach((el, i) =>
            gsap.fromTo(
              el,
              { opacity: 0, y: 32 },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: "power3.out",
                delay: i * 0.09,
                scrollTrigger: { trigger: el, start: "top 90%", once: true },
              },
            ),
          );
          gsap.utils.toArray(".award-card").forEach((el, i) =>
            gsap.fromTo(
              el,
              { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
              {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power3.out",
                delay: i * 0.08,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              },
            ),
          );
          gsap.utils.toArray(".section").forEach((s) => {
            const h = s.querySelector(".section-heading");
            if (!h) return;
            gsap.fromTo(
              h,
              { y: 0 },
              {
                y: -16,
                ease: "none",
                scrollTrigger: {
                  trigger: s,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
          document.querySelectorAll(".stat-card").forEach((c) => {
            c.addEventListener("mouseenter", () =>
              gsap.to(c, {
                boxShadow: "0 0 24px rgba(109,213,250,.20)",
                duration: 0.25,
              }),
            );
            c.addEventListener("mouseleave", () =>
              gsap.to(c, { boxShadow: "none", duration: 0.25 }),
            );
          });
        }

        /* 6. Stat counters */
        function animCounter(el) {
          const tgt = parseFloat(el.dataset.target),
            dec = parseInt(el.dataset.dec || 0),
            suf = el.dataset.suffix || "";
          let cur = 0;
          const inc = tgt / 100;
          const t = setInterval(() => {
            cur = Math.min(cur + inc, tgt);
            el.textContent =
              dec > 0 ? cur.toFixed(dec) + suf : Math.round(cur) + suf;
            if (cur >= tgt) clearInterval(t);
          }, 16);
        }
        if (!reducedMotion) {
          new IntersectionObserver(
            (es) =>
              es.forEach((e) => {
                if (e.isIntersecting) {
                  e.target.querySelectorAll(".stat-num").forEach(animCounter);
                }
              }),
            { threshold: 0.3 },
          ).observe(document.getElementById("heroCards"));
        } else {
          document.querySelectorAll(".stat-num").forEach((el) => {
            const tgt = parseFloat(el.dataset.target),
              dec = parseInt(el.dataset.dec || 0),
              suf = el.dataset.suffix || "";
            el.textContent =
              dec > 0 ? tgt.toFixed(dec) + suf : Math.round(tgt) + suf;
          });
        }
      });
