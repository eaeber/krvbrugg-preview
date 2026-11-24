/* KRV Brugg – kleine Animationen. Ohne Bibliotheken; respektiert «Bewegung reduzieren». */
(() => {
	const root = document.documentElement;
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
	root.classList.add('krv-js');

	// Kopfzeile: Zustand nach dem ersten Scrollen
	const onScroll = () => root.classList.toggle('krv-scrolled', scrollY > 24);
	addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	// Grosse Titel: Wörter einzeln einblenden
	document.querySelectorAll('.krv-hero-title, .krv-pagehead h1').forEach((h) => {
		// Trennung an Leerzeichen/Umbrüchen; nach «/» und «-» darf ebenfalls umbrochen werden
		const words = h.innerHTML.split(/(\s+|<br\s*\/?>)/).flatMap((w) => (/^\s+$|^<br/.test(w) ? [w] : w.split(/(?<=\/)|(?<=[a-zäöüA-ZÄÖÜ]-)/)));
		let i = 0;
		h.innerHTML = words
			.map((w) => (/^\s+$|^<br/.test(w) || !w ? w : `<span class="krv-w"><span style="--i:${i++}">${w}</span></span>`))
			.join('');
		h.classList.add('krv-split');
	});

	if (reduce) {
		root.classList.add('krv-in-all');
		return;
	}

	// Einblenden beim Scrollen – wird automatisch auf Inhalte angewendet, Redaktion muss nichts tun
	const targets = document.querySelectorAll(
		'main .entry-content > *:not(.krv-hero), .krv-reveal, .wp-block-post, .krv-tiles .wp-block-column, .krv-dark li, .krv-footer-cta, .krv-footer-cols .wp-block-column'
	);
	const io = new IntersectionObserver(
		(entries) =>
			entries.forEach((e) => {
				if (!e.isIntersecting) return;
				e.target.classList.add('is-in');
				io.unobserve(e.target);
			}),
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
	);
	targets.forEach((el) => {
		const idx = el.matches(".entry-content > *") ? 0 : [...el.parentElement.children].indexOf(el);
		el.classList.add('krv-r');
		el.style.setProperty('--d', `${Math.min(idx, 5) * 80}ms`);
		io.observe(el);
	});

	// Titelbild: sanfter Parallax-Effekt
	const media = document.querySelector('.krv-hero .wp-block-cover__image-background');
	if (media) {
		let ticking = false;
		const move = () => {
			const y = Math.min(scrollY, innerHeight);
			media.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(1.06)`;
			ticking = false;
		};
		addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
		move();
	}
})();
