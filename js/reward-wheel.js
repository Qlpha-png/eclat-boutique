// ============================
// ÉCLAT — Roue de la Chance post-achat
// S'affiche après chaque achat réussi (page success.html)
// Gain GARANTI à chaque spin (100% légal, pas de gambling)
// ============================

(function() {
    'use strict';

    // Segments de la roue (probabilités pondérées)
    var SEGMENTS = [
        { label: '+10 Éclats', color: '#c9a87c', weight: 40, reward: { type: 'eclats', value: 10 } },
        { label: '-5% prochain achat', color: '#2d1f3d', weight: 25, reward: { type: 'discount', value: 5 } },
        { label: '+25 Éclats', color: '#1a4d2e', weight: 15, reward: { type: 'eclats', value: 25 } },
        { label: 'Livraison offerte', color: '#1a3a5c', weight: 10, reward: { type: 'shipping', value: 0 } },
        { label: '+50 Éclats', color: '#5c1a3a', weight: 8, reward: { type: 'eclats', value: 50 } },
        { label: '-15% EXCLUSIF', color: '#8b6914', weight: 2, reward: { type: 'discount', value: 15 } }
    ];

    // Choisir un segment par poids
    function pickSegment() {
        var total = SEGMENTS.reduce(function(s, seg) { return s + seg.weight; }, 0);
        var rand = Math.random() * total;
        var cumul = 0;
        for (var i = 0; i < SEGMENTS.length; i++) {
            cumul += SEGMENTS[i].weight;
            if (rand <= cumul) return i;
        }
        return 0;
    }

    // Créer la roue
    function createWheel() {
        // Vérifier si déjà tournée pour cette session
        var sessionKey = 'eclat_wheel_' + (new Date().toDateString());
        if (localStorage.getItem(sessionKey)) return;

        var overlay = document.createElement('div');
        overlay.id = 'rewardWheelOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;opacity:0;transition:opacity 0.5s;';

        var container = document.createElement('div');
        container.style.cssText = 'text-align:center;max-width:400px;width:90%;';

        // Titre
        container.innerHTML = '<h2 style="color:#c9a87c;font-family:\'Playfair Display\',serif;font-size:1.8rem;margin-bottom:8px;">Félicitations !</h2>' +
            '<p style="color:#ccc;font-size:0.95rem;margin-bottom:24px;">Tournez la roue pour découvrir votre récompense</p>';

        // Canvas roue
        var canvasWrap = document.createElement('div');
        canvasWrap.style.cssText = 'position:relative;width:300px;height:300px;margin:0 auto 24px;';

        var canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        canvas.style.cssText = 'border-radius:50%;box-shadow:0 0 40px rgba(201,168,124,0.3);';

        // Flèche indicateur
        var arrow = document.createElement('div');
        arrow.style.cssText = 'position:absolute;top:-10px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:14px solid transparent;border-right:14px solid transparent;border-top:24px solid #c9a87c;z-index:2;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));';

        canvasWrap.appendChild(canvas);
        canvasWrap.appendChild(arrow);
        container.appendChild(canvasWrap);

        // Bouton spin
        var spinBtn = document.createElement('button');
        spinBtn.textContent = 'Tourner la roue';
        spinBtn.style.cssText = 'background:linear-gradient(135deg,#c9a87c,#e8d5b5);color:#1a1a1a;border:none;padding:16px 40px;border-radius:30px;font-size:1.1rem;font-weight:700;cursor:pointer;font-family:inherit;transition:transform 0.2s;';
        spinBtn.onmouseover = function() { this.style.transform = 'scale(1.05)'; };
        spinBtn.onmouseout = function() { this.style.transform = 'scale(1)'; };
        container.appendChild(spinBtn);

        // Résultat (caché)
        var resultDiv = document.createElement('div');
        resultDiv.id = 'wheelResult';
        resultDiv.style.cssText = 'display:none;margin-top:20px;';
        container.appendChild(resultDiv);

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        // Dessiner la roue
        var ctx = canvas.getContext('2d');
        var rotation = 0;
        drawWheel(ctx, rotation);

        // Afficher avec animation
        requestAnimationFrame(function() { overlay.style.opacity = '1'; });

        // Spin
        spinBtn.addEventListener('click', function() {
            if (spinBtn.disabled) return;
            spinBtn.disabled = true;
            spinBtn.textContent = 'La roue tourne...';
            spinBtn.style.opacity = '0.6';

            var winIndex = pickSegment();
            var segAngle = 360 / SEGMENTS.length;
            // Calculer l'angle final pour atterrir sur le bon segment
            var targetAngle = 360 * 5 + (360 - (winIndex * segAngle + segAngle / 2));

            var startTime = null;
            var duration = 4000;

            function animateSpin(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // Easing out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                rotation = eased * targetAngle;
                drawWheel(ctx, rotation);

                if (progress < 1) {
                    requestAnimationFrame(animateSpin);
                } else {
                    // Révéler le résultat
                    showResult(winIndex, sessionKey, overlay);
                }
            }
            requestAnimationFrame(animateSpin);
        });
    }

    function drawWheel(ctx, rotation) {
        var cx = 150, cy = 150, r = 145;
        var segAngle = (2 * Math.PI) / SEGMENTS.length;

        ctx.clearRect(0, 0, 300, 300);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((rotation * Math.PI) / 180);

        for (var i = 0; i < SEGMENTS.length; i++) {
            var startAngle = i * segAngle;
            var endAngle = startAngle + segAngle;

            // Segment
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, r, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = SEGMENTS[i].color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Texte
            ctx.save();
            ctx.rotate(startAngle + segAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.fillText(SEGMENTS[i].label, r - 15, 4);
            ctx.restore();
        }

        // Cercle central
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, 2 * Math.PI);
        ctx.fillStyle = '#c9a87c';
        ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ÉCLAT', 0, 4);

        ctx.restore();
    }

    function showResult(winIndex, sessionKey, overlay) {
        var seg = SEGMENTS[winIndex];
        localStorage.setItem(sessionKey, JSON.stringify(seg.reward));

        var result = document.getElementById('wheelResult');
        result.style.display = 'block';
        result.innerHTML = '<div style="background:linear-gradient(135deg,#1a1520,#2d1f3d);border:2px solid #c9a87c;border-radius:16px;padding:24px;animation:wheelPop 0.5s ease;">' +
            '<div style="font-size:2rem;margin-bottom:8px;">🎉</div>' +
            '<h3 style="color:#c9a87c;font-size:1.3rem;margin-bottom:8px;">Vous avez gagné !</h3>' +
            '<div style="font-size:1.5rem;font-weight:700;color:#fff;margin-bottom:16px;">' + seg.label + '</div>' +
            '<p style="color:#999;font-size:0.85rem;">La récompense sera appliquée automatiquement.</p>' +
            '</div>';

        // Bouton fermer
        var closeBtn = document.createElement('button');
        closeBtn.textContent = 'Continuer mes achats';
        closeBtn.style.cssText = 'margin-top:16px;background:transparent;border:1px solid #c9a87c;color:#c9a87c;padding:12px 32px;border-radius:25px;font-size:0.9rem;cursor:pointer;font-family:inherit;';
        closeBtn.onclick = function() {
            overlay.style.opacity = '0';
            setTimeout(function() { overlay.remove(); }, 500);
        };
        result.appendChild(closeBtn);

        // Cacher le bouton spin
        var spinBtn = overlay.querySelector('button:first-of-type');
        if (spinBtn && spinBtn !== closeBtn) spinBtn.style.display = 'none';

        // Appliquer la récompense via API si connecté
        applyReward(seg.reward);
    }

    async function applyReward(reward) {
        if (!window.auth || !window.auth.isSignedIn() || !window.auth._session) return;

        try {
            // Envoyer la récompense au serveur pour crédit
            await fetch('/api/reward', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.auth._session.access_token
                },
                body: JSON.stringify({ reward: reward, source: 'wheel' })
            });
        } catch (e) {
            // Silent fail — la récompense sera récupérée plus tard
        }
    }

    // CSS animation
    var style = document.createElement('style');
    style.textContent = '@keyframes wheelPop { 0% { transform:scale(0.8);opacity:0; } 100% { transform:scale(1);opacity:1; } }';
    document.head.appendChild(style);

    // Lancer sur la page success uniquement
    if (window.location.pathname.includes('success')) {
        // Attendre un peu pour que le client savoure
        setTimeout(createWheel, 2000);
    }
})();
