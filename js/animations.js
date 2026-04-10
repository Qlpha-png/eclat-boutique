// ============================================================
// ECLAT Boutique — Scroll-Triggered Animations
// Vanilla JS, IntersectionObserver, zero dependencies
// Respects prefers-reduced-motion
// ============================================================
(function() {
    'use strict';

    // ----------------------------------------------------------
    // Reduced-motion check
    // ----------------------------------------------------------

    var prefersReduced = false;
    try {
        prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
        // matchMedia unsupported — assume no preference
    }

    // ----------------------------------------------------------
    // State
    // ----------------------------------------------------------

    var initialized = false;
    var styleInjected = false;

    // ----------------------------------------------------------
    // Selector map — which elements get which animation
    // Each entry: { selector, animation, stagger }
    //   animation: 'fade-in-up' | 'fade-in-scale'
    //   stagger:   true  = apply stagger delay to each matched
    //              false = animate individually
    // ----------------------------------------------------------

    var ANIMATION_MAP = [
        { selector: '.section-header',   animation: 'fade-in-up',    stagger: false },
        { selector: '.product-card',     animation: 'fade-in-scale', stagger: true  },
        { selector: '.category-card',    animation: 'fade-in-scale', stagger: true  },
        { selector: '.promise-card',     animation: 'fade-in-up',    stagger: true  },
        { selector: '.newsletter-box',   animation: 'fade-in-up',    stagger: false },
        { selector: '.testimonial-card', animation: 'fade-in-up',    stagger: true  },
        { selector: '.blog-card',        animation: 'fade-in-scale', stagger: true  },
        { selector: '.badge-card',       animation: 'fade-in-up',    stagger: true  }
    ];

    // Stagger delay between siblings (seconds)
    var STAGGER_DELAY = 0.08;

    // ----------------------------------------------------------
    // CSS injection — animation classes via transitions
    // Injected once by JS so that if JS is disabled, elements
    // remain visible (no FOUC).
    // ----------------------------------------------------------

    function injectStyles() {
        if (styleInjected) return;
        styleInjected = true;

        if (document.getElementById('eclat-anim-styles')) return;

        var css = [
            '/* ECLAT scroll-animation classes (injected by animations.js) */',
            '.fade-in-up {',
            '    opacity: 1 !important;',
            '    transform: translateY(0) !important;',
            '}',
            '.fade-in-scale {',
            '    opacity: 1 !important;',
            '    transform: scale(1) !important;',
            '}',
            '.stagger-children > .fade-in-up,',
            '.stagger-children > .fade-in-scale {',
            '    opacity: 1 !important;',
            '    transform: none !important;',
            '}'
        ].join('\n');

        var tag = document.createElement('style');
        tag.id = 'eclat-anim-styles';
        tag.textContent = css;
        document.head.appendChild(tag);
    }

    // ----------------------------------------------------------
    // Utility: group elements by their parent container
    // Returns array of { parent, children: [el, ...] }
    // ----------------------------------------------------------

    function groupByParent(elements) {
        var map = [];
        var parentIndex = [];

        for (var i = 0; i < elements.length; i++) {
            var parent = elements[i].parentNode;
            var idx = -1;
            for (var j = 0; j < parentIndex.length; j++) {
                if (parentIndex[j] === parent) {
                    idx = j;
                    break;
                }
            }
            if (idx === -1) {
                parentIndex.push(parent);
                map.push({ parent: parent, children: [elements[i]] });
            } else {
                map[idx].children.push(elements[i]);
            }
        }

        return map;
    }

    // ----------------------------------------------------------
    // Apply initial hidden state to an element via inline styles
    // This avoids FOUC: if JS is disabled, no inline styles are
    // applied and elements remain visible.
    // ----------------------------------------------------------

    function hideForFadeUp(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    function hideForFadeScale(el) {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.92)';
        el.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // ----------------------------------------------------------
    // Observer: individual elements (no stagger)
    // ----------------------------------------------------------

    var singleObserver = null;

    function createSingleObserver() {
        if (typeof IntersectionObserver === 'undefined') return null;

        return new IntersectionObserver(function(entries, obs) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    var el = entries[i].target;
                    var animClass = el.getAttribute('data-anim');
                    if (animClass) {
                        el.classList.add(animClass);
                    }
                    obs.unobserve(el);
                }
            }
        }, { threshold: 0.1 });
    }

    // ----------------------------------------------------------
    // Observer: stagger groups
    // When the parent scrolls into view, reveal its children
    // with incremental delays.
    // ----------------------------------------------------------

    var staggerObserver = null;

    function createStaggerObserver() {
        if (typeof IntersectionObserver === 'undefined') return null;

        return new IntersectionObserver(function(entries, obs) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    var container = entries[i].target;
                    var kids = container.querySelectorAll('[data-anim]');
                    for (var k = 0; k < kids.length; k++) {
                        kids[k].style.transitionDelay = (k * STAGGER_DELAY) + 's';
                        var animClass = kids[k].getAttribute('data-anim');
                        if (animClass) {
                            kids[k].classList.add(animClass);
                        }
                    }
                    obs.unobserve(container);
                }
            }
        }, { threshold: 0.1 });
    }

    // ----------------------------------------------------------
    // Observer: counter animation
    // ----------------------------------------------------------

    var counterObserver = null;

    function createCounterObserver() {
        if (typeof IntersectionObserver === 'undefined') return null;

        return new IntersectionObserver(function(entries, obs) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    var el = entries[i].target;
                    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
                    animateCounter(el, target);
                    obs.unobserve(el);
                }
            }
        }, { threshold: 0.3 });
    }

    // ----------------------------------------------------------
    // Counter: animated number count-up
    // ----------------------------------------------------------

    function animateCounter(el, target, duration) {
        duration = duration || 1400;

        if (prefersReduced) {
            el.textContent = formatNumber(target);
            return;
        }

        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = prefix + formatNumber(current) + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = prefix + formatNumber(target) + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    function formatNumber(n) {
        if (typeof n !== 'number') return '0';
        try {
            return n.toLocaleString('fr-FR');
        } catch (e) {
            return String(n);
        }
    }

    // ----------------------------------------------------------
    // Auto-detect and prepare elements
    // ----------------------------------------------------------

    function scanAndPrepare() {
        if (prefersReduced) {
            // Reduced motion: show everything immediately, no transforms
            for (var m = 0; m < ANIMATION_MAP.length; m++) {
                var elems = document.querySelectorAll(ANIMATION_MAP[m].selector);
                for (var n = 0; n < elems.length; n++) {
                    elems[n].style.opacity = '1';
                    elems[n].style.transform = 'none';
                }
            }
            // Counters: show final value immediately
            var counters = document.querySelectorAll('[data-anim-counter]');
            for (var c = 0; c < counters.length; c++) {
                var val = parseInt(counters[c].getAttribute('data-target'), 10) || 0;
                var pre = counters[c].getAttribute('data-prefix') || '';
                var suf = counters[c].getAttribute('data-suffix') || '';
                counters[c].textContent = pre + formatNumber(val) + suf;
            }
            return;
        }

        // Create observers
        singleObserver = createSingleObserver();
        staggerObserver = createStaggerObserver();
        counterObserver = createCounterObserver();

        // Process each selector in the animation map
        for (var i = 0; i < ANIMATION_MAP.length; i++) {
            var rule = ANIMATION_MAP[i];
            var elements = document.querySelectorAll(rule.selector);
            if (!elements.length) continue;

            if (rule.stagger) {
                // Group siblings by parent, observe parent
                var groups = groupByParent(elements);
                for (var g = 0; g < groups.length; g++) {
                    var parent = groups[g].parent;
                    var children = groups[g].children;

                    // Mark parent as stagger container
                    parent.classList.add('stagger-children');

                    // Hide each child and tag it
                    for (var k = 0; k < children.length; k++) {
                        children[k].setAttribute('data-anim', rule.animation);
                        if (rule.animation === 'fade-in-up') {
                            hideForFadeUp(children[k]);
                        } else {
                            hideForFadeScale(children[k]);
                        }
                    }

                    // Observe the parent container
                    if (staggerObserver) {
                        staggerObserver.observe(parent);
                    }
                }
            } else {
                // Individual elements
                for (var j = 0; j < elements.length; j++) {
                    elements[j].setAttribute('data-anim', rule.animation);
                    if (rule.animation === 'fade-in-up') {
                        hideForFadeUp(elements[j]);
                    } else {
                        hideForFadeScale(elements[j]);
                    }
                    if (singleObserver) {
                        singleObserver.observe(elements[j]);
                    }
                }
            }
        }

        // Counter elements
        var counterEls = document.querySelectorAll('[data-anim-counter]');
        for (var ci = 0; ci < counterEls.length; ci++) {
            if (counterObserver) {
                counterObserver.observe(counterEls[ci]);
            }
        }
    }

    // ----------------------------------------------------------
    // Product card hover elevation
    // ----------------------------------------------------------

    function initProductHover() {
        var cards = document.querySelectorAll('.product-card');
        if (!cards.length) return;

        if (!document.getElementById('eclat-hover-style')) {
            var style = document.createElement('style');
            style.id = 'eclat-hover-style';
            style.textContent =
                '.eclat-hover-elevated{' +
                    'box-shadow:0 8px 28px rgba(0,0,0,0.12) !important;' +
                    'transform:translateY(-3px) !important;' +
                    'transition:box-shadow 0.25s ease,transform 0.25s ease !important;' +
                '}';
            document.head.appendChild(style);
        }

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
    }

    // ----------------------------------------------------------
    // Main init
    // ----------------------------------------------------------

    function init() {
        if (initialized) return;
        initialized = true;

        injectStyles();
        scanAndPrepare();
        initProductHover();

        // Mark body as loaded for optional CSS hooks
        if (document.body) {
            document.body.classList.add('page-loaded');
        }
    }

    // ----------------------------------------------------------
    // Reinit for dynamically loaded content
    // ----------------------------------------------------------

    function reinit() {
        initialized = false;
        init();
    }

    // ----------------------------------------------------------
    // Expose public API
    // ----------------------------------------------------------

    window.EclatAnimations = {
        init: init,
        reinit: reinit,
        animateCounter: animateCounter
    };

    // Legacy compatibility
    window.animateCounter = animateCounter;
    window.reinitAnimations = reinit;

    // ----------------------------------------------------------
    // Auto-init on DOMContentLoaded
    // ----------------------------------------------------------

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
