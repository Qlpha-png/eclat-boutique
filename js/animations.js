// ============================
// ÉCLAT — Animations & Micro-interactions
// Intersection Observer, pas de librairie
// ============================
(function() {
    'use strict';

    // ——— Fade-in au scroll ———
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('anim-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    function initAnimations() {
        document.querySelectorAll('.anim-fade-up, .anim-fade-in, .anim-fade-scale, .anim-stagger').forEach(function(el) {
            observer.observe(el);
        });

        // Stagger children
        document.querySelectorAll('.anim-stagger-children').forEach(function(parent) {
            var children = parent.children;
            for (var i = 0; i < children.length; i++) {
                children[i].classList.add('anim-fade-up');
                children[i].style.transitionDelay = (i * 0.08) + 's';
                observer.observe(children[i]);
            }
        });
    }

    // ——— Counter animation ———
    window.animateCounter = function(el, target, duration) {
        duration = duration || 1500;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            var current = Math.floor(eased * target);
            el.textContent = current.toLocaleString('fr-FR');
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString('fr-FR');
        }

        requestAnimationFrame(step);
    };

    // ——— Counter observer ———
    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var target = parseInt(entry.target.dataset.count) || 0;
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    function initCounters() {
        document.querySelectorAll('[data-count]').forEach(function(el) {
            counterObserver.observe(el);
        });
    }

    // ——— Product card hover tilt ———
    function initTilt() {
        document.querySelectorAll('.product-card, .cat-card').forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = 'perspective(600px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg) translateY(-4px)';
            });
            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
        });
    }

    // ——— Smooth page load ———
    document.body.classList.add('page-loaded');

    // ——— Init ———
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initAnimations();
            initCounters();
            setTimeout(initTilt, 500);
        });
    } else {
        initAnimations();
        initCounters();
        setTimeout(initTilt, 500);
    }

    // Re-init after dynamic content load
    window.reinitAnimations = function() {
        initAnimations();
        initCounters();
        initTilt();
    };
})();
