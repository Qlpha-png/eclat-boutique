// ============================
// ECLAT Beaute — Scroll Animations
// IntersectionObserver, zero libraries
// Respects prefers-reduced-motion
// ============================
(function() {
    'use strict';

    // ---------- Reduced motion check ----------

    var prefersReduced = false;
    try {
        prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
        // matchMedia not supported, assume no preference
    }

    // ---------- State ----------

    var fadeObserver = null;
    var counterObserver = null;
    var staggerObserver = null;
    var initialized = false;

    // ---------- Debounced observer factory ----------
    // Wraps IntersectionObserver callback in a requestAnimationFrame debounce

    function createDebouncedObserver(callback, options) {
        if (typeof IntersectionObserver === 'undefined') return null;

        var pending = false;
        var pendingEntries = [];

        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                pendingEntries.push(entries[i]);
            }
            if (!pending) {
                pending = true;
                requestAnimationFrame(function() {
                    callback(pendingEntries, observer);
                    pendingEntries = [];
                    pending = false;
                });
            }
        }, options || {});

        return observer;
    }

    // ---------- Fade-up animations ----------

    function initFadeUp() {
        var elements = document.querySelectorAll('.anim-fade-up');
        if (!elements.length) return;

        // Apply initial hidden state
        for (var i = 0; i < elements.length; i++) {
            if (prefersReduced) {
                // Show immediately, no animation
                elements[i].style.opacity = '1';
                elements[i].style.transform = 'none';
            } else {
                elements[i].style.opacity = '0';
                elements[i].style.transform = 'translateY(24px)';
                elements[i].style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }
        }

        if (prefersReduced) return;

        fadeObserver = createDebouncedObserver(function(entries, obs) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    var el = entries[i].target;
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    obs.unobserve(el);
                }
            }
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        if (!fadeObserver) return;
        for (var j = 0; j < elements.length; j++) {
            fadeObserver.observe(elements[j]);
        }
    }

    // ---------- Counter animations ----------

    function animateCounter(el, target, duration) {
        duration = duration || 1400;

        if (prefersReduced) {
            el.textContent = target.toLocaleString('fr-FR');
            return;
        }

        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current.toLocaleString('fr-FR');
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString('fr-FR');
            }
        }

        requestAnimationFrame(step);
    }

    function initCounters() {
        var elements = document.querySelectorAll('.anim-counter');
        if (!elements.length) return;

        if (prefersReduced) {
            for (var i = 0; i < elements.length; i++) {
                var val = parseInt(elements[i].getAttribute('data-target'), 10) || 0;
                elements[i].textContent = val.toLocaleString('fr-FR');
            }
            return;
        }

        counterObserver = createDebouncedObserver(function(entries, obs) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    var el = entries[i].target;
                    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
                    animateCounter(el, target);
                    obs.unobserve(el);
                }
            }
        }, { threshold: 0.3 });

        if (!counterObserver) return;
        for (var j = 0; j < elements.length; j++) {
            counterObserver.observe(elements[j]);
        }
    }

    // ---------- Stagger animations ----------

    function initStagger() {
        var containers = document.querySelectorAll('.anim-stagger');
        if (!containers.length) return;

        for (var c = 0; c < containers.length; c++) {
            var children = containers[c].children;
            for (var i = 0; i < children.length; i++) {
                if (prefersReduced) {
                    children[i].style.opacity = '1';
                    children[i].style.transform = 'none';
                } else {
                    children[i].style.opacity = '0';
                    children[i].style.transform = 'translateY(20px)';
                    children[i].style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    children[i].style.transitionDelay = (i * 0.08) + 's';
                }
            }
        }

        if (prefersReduced) return;

        staggerObserver = createDebouncedObserver(function(entries, obs) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    var container = entries[i].target;
                    var kids = container.children;
                    for (var k = 0; k < kids.length; k++) {
                        kids[k].style.opacity = '1';
                        kids[k].style.transform = 'translateY(0)';
                    }
                    obs.unobserve(container);
                }
            }
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

        if (!staggerObserver) return;
        for (var j = 0; j < containers.length; j++) {
            staggerObserver.observe(containers[j]);
        }
    }

    // ---------- Product card hover (add/remove CSS class) ----------

    function initProductHover() {
        var cards = document.querySelectorAll('.product-card');
        if (!cards.length) return;

        for (var i = 0; i < cards.length; i++) {
            (function(card) {
                card.addEventListener('mouseenter', function() {
                    card.classList.add('eclat-hover-elevated');
                });
                card.addEventListener('mouseleave', function() {
                    card.classList.remove('eclat-hover-elevated');
                });
            })(cards[i]);
        }

        // Inject the elevation class style once
        if (!document.getElementById('eclat-hover-style')) {
            var style = document.createElement('style');
            style.id = 'eclat-hover-style';
            style.textContent = '.eclat-hover-elevated{box-shadow:0 8px 28px rgba(0,0,0,0.12) !important;' +
                'transform:translateY(-3px) !important;transition:box-shadow 0.25s ease,transform 0.25s ease !important;}';
            document.head.appendChild(style);
        }
    }

    // ---------- Main init ----------

    function init() {
        if (initialized) return;
        initialized = true;

        initFadeUp();
        initCounters();
        initStagger();
        initProductHover();

        // Mark body as loaded for optional CSS transitions
        if (document.body) {
            document.body.classList.add('page-loaded');
        }
    }

    // ---------- Reinit for dynamic content ----------

    function reinit() {
        initialized = false;
        init();
    }

    // ---------- Expose ----------

    window.EclatAnimations = {
        init: init,
        reinit: reinit,
        animateCounter: animateCounter
    };

    // Also keep legacy compat
    window.animateCounter = animateCounter;
    window.reinitAnimations = reinit;

    // ---------- Auto-init ----------

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
