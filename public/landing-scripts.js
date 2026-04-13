window.addEventListener('DOMContentLoaded', (event) => {

                !function () { if (!window.UnicornStudio) { window.UnicornStudio = { isInitialized: !1 }; var i = document.createElement("script"); i.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js", i.onload = function () { window.UnicornStudio.isInitialized || (UnicornStudio.init(), window.UnicornStudio.isInitialized = !0) }, (document.head || document.body).appendChild(i) } }();
            


            (function () {
                const section = document.getElementById("solution");
                if (!section) return;

                const divider = section.querySelector(".split-divider");
                const packet = divider ? divider.querySelector(".packet") : null;

                const problemItems = Array.from(section.querySelectorAll('[data-list="problem"] .bullet-item'));
                const solutionItems = Array.from(section.querySelectorAll('[data-list="solution"] .bullet-item'));

                const routeLayer = section.querySelector(".route-layer svg");
                const routePath = section.querySelector(".route-path");

                if (!routeLayer || !routePath || !divider || !packet) return;

                // Convert element rect -> section-local coords
                function rectToLocalCenter(el) {
                    const r = el.getBoundingClientRect();
                    const s = section.getBoundingClientRect();
                    return {
                        x: (r.left + r.width / 2) - s.left,
                        y: (r.top + r.height / 2) - s.top
                    };
                }

                function setPacketToY(y) {
                    const d = divider.getBoundingClientRect();
                    const s = section.getBoundingClientRect();
                    const topInSection = d.top - s.top;
                    const clamped = Math.max(topInSection + 24, Math.min(topInSection + d.height - 24, y));
                    packet.style.top = clamped + "px";
                }

                function setRoute(fromEl, toEl) {
                    const a = rectToLocalCenter(fromEl);
                    const b = rectToLocalCenter(toEl);

                    // Update SVG viewBox to match section for correct mapping
                    const s = section.getBoundingClientRect();
                    routeLayer.setAttribute("viewBox", `0 0 ${Math.max(1, s.width)} ${Math.max(1, s.height)}`);

                    // Curve across the divider
                    const midX = (a.x + b.x) / 2;
                    const tension = Math.max(80, Math.min(220, Math.abs(b.x - a.x) * 0.35));

                    const d = `M ${a.x} ${a.y} C ${midX - tension} ${a.y}, ${midX + tension} ${b.y}, ${b.x} ${b.y}`;
                    routePath.setAttribute("d", d);

                    // Move packet in divider to hovered row Y
                    setPacketToY(a.y);

                    // activate
                    section.classList.add("is-active");
                }

                function clearRoute() {
                    section.classList.remove("is-active");
                }

                function resolveIndex(i) {
                    problemItems.forEach((item, idx) => {
                        item.classList.toggle("is-resolved", idx === i);
                    });
                    solutionItems.forEach((item, idx) => {
                        item.classList.toggle("is-active", idx === i);
                    });
                }

                // hover / click mapping (hover desktop, click mobile)
                problemItems.forEach((item) => {
                    const i = Number(item.getAttribute("data-route")) || 0;
                    const sink = solutionItems.find(el => Number(el.getAttribute("data-sink")) === i) || solutionItems[i];

                    const activate = () => {
                        resolveIndex(i);
                        setRoute(item, sink);
                    };

                    item.addEventListener("mouseenter", activate);
                    item.addEventListener("focus", activate);

                    item.addEventListener("click", () => {
                        // mobile-friendly toggle
                        if (section.classList.contains("is-active") && item.classList.contains("is-resolved")) {
                            clearRoute();
                            problemItems.forEach(x => x.classList.remove("is-resolved"));
                            solutionItems.forEach(x => x.classList.remove("is-active"));
                        } else {
                            activate();
                        }
                    });
                });

                // clear when leaving the section area
                section.addEventListener("mouseleave", () => {
                    clearRoute();
                    problemItems.forEach(x => x.classList.remove("is-resolved"));
                    solutionItems.forEach(x => x.classList.remove("is-active"));
                });

                // keep route aligned on resize
                let lastActive = 0;
                const observer = new MutationObserver(() => {
                    // noop placeholder in case Aura toggles classes
                });
                observer.observe(section, { attributes: true, subtree: true });

                window.addEventListener("resize", () => {
                    if (!section.classList.contains("is-active")) return;
                    // Rebuild route based on current resolved
                    const idx = problemItems.findIndex(x => x.classList.contains("is-resolved"));
                    if (idx >= 0) {
                        const sink = solutionItems[idx];
                        setRoute(problemItems[idx], sink);
                    }
                });
            })();
        


            (function () {
                const wrap = document.querySelector('[data-constellation-wrap]');
                if (!wrap) return;

                const canvas = wrap.querySelector('[data-constellation-canvas]');
                const ctx = canvas.getContext('2d');

                const chips = Array.from(wrap.querySelectorAll('[data-node]'));
                const shards = Array.from(document.querySelectorAll('.shard-card[data-shard]'));

                // Active state
                let active = 0;

                function setActive(i) {
                    active = i;
                    shards.forEach(s => {
                        const isActive = Number(s.getAttribute('data-shard')) === i;
                        s.classList.toggle('is-active', isActive);
                        if (!isActive) s.classList.add('opacity-70');
                        else s.classList.remove('opacity-70');
                    });
                }
                setActive(0);

                // Canvas "Signal Constellation" animation
                let w = 0, h = 0, dpr = 1;
                let mouse = { x: 0.5, y: 0.5 };

                // Node anchor points (relative positions)
                const nodes = [
                    { x: 0.18, y: 0.72 },
                    { x: 0.54, y: 0.62 },
                    { x: 0.82, y: 0.78 },
                    { x: 0.30, y: 0.42 },
                    { x: 0.70, y: 0.35 },
                ];

                function resize() {
                    const r = wrap.getBoundingClientRect();
                    dpr = Math.min(2, window.devicePixelRatio || 1);
                    w = Math.max(1, Math.floor(r.width * dpr));
                    h = Math.max(1, Math.floor(r.height * dpr));
                    canvas.width = w;
                    canvas.height = h;
                    canvas.style.width = r.width + "px";
                    canvas.style.height = r.height + "px";
                }
                window.addEventListener('resize', resize);
                resize();

                wrap.addEventListener('mousemove', (e) => {
                    const r = wrap.getBoundingClientRect();
                    mouse.x = (e.clientX - r.left) / Math.max(1, r.width);
                    mouse.y = (e.clientY - r.top) / Math.max(1, r.height);
                });

                // Chips control active shard + "burst" in constellation
                let burst = 0;
                chips.forEach(btn => {
                    btn.addEventListener('mouseenter', () => {
                        const i = Number(btn.getAttribute('data-node'));
                        setActive(i);
                        burst = 1.0;
                    });
                    btn.addEventListener('click', () => {
                        const i = Number(btn.getAttribute('data-node'));
                        setActive(i);
                        burst = 1.0;
                    });
                });

                function draw(t) {
                    const time = t * 0.001;
                    burst *= 0.92;

                    ctx.clearRect(0, 0, w, h);

                    // Background faint scanlines
                    ctx.globalAlpha = 0.10;
                    ctx.fillStyle = "#00e5ff";
                    for (let y = 0; y < h; y += Math.floor(18 * dpr)) {
                        ctx.fillRect(0, y, w, 1);
                    }
                    ctx.globalAlpha = 1;

                    // Convert nodes to pixels + subtle orbit
                    const px = nodes.map((n, idx) => {
                        const wobble = 0.012 * Math.sin(time * 1.3 + idx * 1.7);
                        const wobble2 = 0.012 * Math.cos(time * 1.0 + idx * 1.1);
                        const mx = (mouse.x - 0.5) * 0.10;
                        const my = (mouse.y - 0.5) * 0.10;
                        return {
                            x: (n.x + wobble + mx) * w,
                            y: (n.y + wobble2 + my) * h
                        };
                    });

                    // Draw connections with animated traveling "pulse"
                    function line(a, b, intensity) {
                        const ax = a.x, ay = a.y, bx = b.x, by = b.y;

                        // base line
                        ctx.lineWidth = 1.2 * dpr;
                        ctx.strokeStyle = "rgba(255,255,255,0.10)";
                        ctx.beginPath();
                        ctx.moveTo(ax, ay);
                        ctx.lineTo(bx, by);
                        ctx.stroke();

                        // traveling pulse
                        const p = (time * 0.35 + intensity) % 1;
                        const x = ax + (bx - ax) * p;
                        const y = ay + (by - ay) * p;

                        const g = ctx.createRadialGradient(x, y, 0, x, y, 22 * dpr);
                        g.addColorStop(0, "rgba(0,229,255,0.35)");
                        g.addColorStop(1, "rgba(0,229,255,0)");

                        ctx.fillStyle = g;
                        ctx.beginPath();
                        ctx.arc(x, y, 22 * dpr, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    line(px[3], px[0], 0.12 + active * 0.07);
                    line(px[3], px[1], 0.28 + active * 0.07);
                    line(px[1], px[4], 0.42 + active * 0.07);
                    line(px[4], px[2], 0.66 + active * 0.07);

                    // Nodes
                    px.forEach((p, idx) => {
                        const isHot = (idx === active) || (idx === active + 3); // slight bias toward active cluster
                        const r = (isHot ? 5.2 : 4.2) * dpr;

                        // outer glow
                        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 34 * dpr);
                        glow.addColorStop(0, `rgba(0,229,255,${0.22 + (isHot ? 0.10 : 0) + burst * 0.12})`);
                        glow.addColorStop(1, "rgba(0,229,255,0)");
                        ctx.fillStyle = glow;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, 34 * dpr, 0, Math.PI * 2);
                        ctx.fill();

                        // core
                        ctx.fillStyle = `rgba(0,229,255,${0.55 + (isHot ? 0.18 : 0)})`;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                        ctx.fill();
                    });

                    requestAnimationFrame(draw);
                }
                requestAnimationFrame(draw);
            })();
        


            (function () {
                const section = document.querySelector('[data-element-id="aura-emmcanfzzf4hq3jn"]');
                if (!section) return;
                const glowLayer = section.querySelector('.parallax-glow');

                if (glowLayer) {
                    section.addEventListener('mousemove', function (e) {
                        const rect = section.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;

                        const moveX = (e.clientX - centerX) * 0.05;
                        const moveY = (e.clientY - centerY) * 0.05;

                        glowLayer.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
                    });

                    section.addEventListener('mouseleave', function () {
                        glowLayer.style.transform = 'translate(0px, 0px)';
                    });
                }
            })();
        


        /* ==========================================================================
           EXISTING WEBGL LOGIC (STRICTLY UNTOUCHED)
           ========================================================================== */
        const container = document.getElementById('webgl-container');
        const scene = new THREE.Scene();

        const bgColor = 0x09090b;
        scene.background = new THREE.Color(bgColor);
        scene.fog = new THREE.FogExp2(bgColor, 0.025);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 15);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0x222233, 1.5);
        scene.add(ambientLight);

        const tealLight = new THREE.PointLight(0x00e5ff, 5, 50);
        tealLight.position.set(10, 15, 10);
        scene.add(tealLight);

        const violetLight = new THREE.PointLight(0xb388ff, 4, 50);
        violetLight.position.set(-10, -15, 10);
        scene.add(violetLight);

        const backLight = new THREE.PointLight(0xffffff, 2, 60);
        backLight.position.set(0, 0, -20);
        scene.add(backLight);

        const shardMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.15,
            transmission: 0.95,
            ior: 1.5,
            thickness: 2.5,
            transparent: true,
            opacity: 1.0,
            side: THREE.DoubleSide
        });

        const geometries = [
            new THREE.TetrahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(1, 0),
            new THREE.IcosahedronGeometry(1, 0)
        ];

        geometries.forEach(geo => {
            geo.scale(1, 2.5 + Math.random() * 1.5, 1);
        });

        const shards = [];
        const shardCount = 60;

        for (let i = 0; i < shardCount; i++) {
            const geo = geometries[Math.floor(Math.random() * geometries.length)];
            const mesh = new THREE.Mesh(geo, shardMaterial);

            mesh.position.x = (Math.random() - 0.5) * 40;
            mesh.position.y = (Math.random() - 0.5) * 40;
            mesh.position.z = (Math.random() - 0.5) * 30 - 5;

            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;

            const scale = Math.random() * 0.8 + 0.2;
            mesh.scale.set(scale, scale, scale);

            mesh.userData = {
                rx: (Math.random() - 0.5) * 0.002,
                ry: (Math.random() - 0.5) * 0.002,
                rz: (Math.random() - 0.5) * 0.002,
                dy: (Math.random() - 0.5) * 0.005 + 0.002,
                originalY: mesh.position.y
            };

            scene.add(mesh);
            shards.push(mesh);
        }

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        let scrollY = 0;

        const baseCameraZ = 15;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX) / windowHalfX;
            mouseY = (event.clientY - windowHalfY) / windowHalfY;
        });

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            shards.forEach(shard => {
                shard.rotation.x += shard.userData.rx;
                shard.rotation.y += shard.userData.ry;
                shard.rotation.z += shard.userData.rz;
                shard.position.y += Math.sin(elapsedTime * 0.5 + shard.userData.originalY) * 0.005;
            });

            targetX = mouseX * 2;
            targetY = -(mouseY * 2) + (scrollY * 0.015);

            camera.position.x += (targetX - camera.position.x) * 0.02;
            camera.position.y += (targetY - camera.position.y) * 0.02;

            camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.5, 0);

            renderer.render(scene, camera);
        }

        animate();

        /* ==========================================================================
           NEW UI INTERACTIONS LOGIC
           ========================================================================== */
        document.addEventListener("DOMContentLoaded", () => {

            // 1. Header Scroll Logic
            const header = document.getElementById('main-header');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // 2. Mobile Menu Toggle
            const menuToggle = document.getElementById('menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileLinks = document.querySelectorAll('.mobile-link');

            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
            });

            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('open');
                });
            });

            // 3. Scroll Reveal Observer
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

            // 4. Use Cases Tabs
            const tabBtns = document.querySelectorAll('.tab-btn');
            const panelContents = document.querySelectorAll('.panel-content');

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active from all
                    tabBtns.forEach(b => b.classList.remove('active'));
                    panelContents.forEach(p => p.classList.remove('active'));

                    // Add active to clicked
                    btn.classList.add('active');
                    const targetId = btn.getAttribute('data-target');
                    document.getElementById(targetId).classList.add('active');
                });
            });

            // 5. Pricing Toggle
            const pricingToggle = document.getElementById('pricing-toggle');
            const priceElements = document.querySelectorAll('.price');
            const lblMonthly = document.getElementById('lbl-monthly');
            const lblYearly = document.getElementById('lbl-yearly');

            pricingToggle.addEventListener('change', (e) => {
                const isYearly = e.target.checked;

                if (isYearly) {
                    lblYearly.classList.add('active');
                    lblMonthly.classList.remove('active');
                } else {
                    lblMonthly.classList.add('active');
                    lblYearly.classList.remove('active');
                }

                priceElements.forEach(el => {
                    if (el.innerText !== "Custom") {
                        // animate the number change subtly
                        el.style.opacity = 0;
                        setTimeout(() => {
                            el.innerText = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
                            el.style.opacity = 1;
                        }, 200);
                    }
                });
            });

            // 6. FAQ Accordion
            const faqItems = document.querySelectorAll('.faq-item');

            faqItems.forEach(item => {
                item.addEventListener('click', () => {
                    const isOpen = item.classList.contains('open');

                    // Close all
                    faqItems.forEach(faq => {
                        faq.classList.remove('open');
                        faq.querySelector('.faq-answer').style.maxHeight = null;
                    });

                    // If wasn't open, open it
                    if (!isOpen) {
                        item.classList.add('open');
                        const answer = item.querySelector('.faq-answer');
                        answer.style.maxHeight = answer.scrollHeight + "px";
                    }
                });
            });
        });
    


});
