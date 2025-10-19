# Voting System Simulator — Enhanced

What this version includes
- Multiple voting methods: Plurality, Borda, IRV, Approval (top-k), Score (derived from ranking), Condorcet (pairwise).
- Voter models: Impartial culture (uniform random rankings) and single-peaked (1D).
- Seedable RNG for reproducible runs.
- Progress bar and UI disable while running.
- Per-method per-candidate win counts and a Chart.js visualization.
- CSV export of raw results.

Ideas for further improvements
- Add more voter models: spatial 2D, partisan blocs, correlated preferences.
- Implement real Score ballots (instead of converting from ranking) where voters assign numeric scores — especially useful for Score & Approval.
- Add advanced Condorcet methods (Schulze, Ranked Pairs, Copeland).
- Add tie-breaking rules configurable by user.
- Allow candidate names and party labels, show colors and legend for candidates.
- Move heavy simulations into a Web Worker to avoid UI thread blocking for very large runs (e.g., 10k sims).
- Add unit tests around election method implementations, and property-based tests (e.g., monotonicity, consistency).
- Add statistical outputs: variance, confidence intervals, pairwise preference matrices, probability that different methods pick different winners.
- Add story / tutorial UI to explain differences between methods, with visual examples.
- Split JS into modules and convert to TypeScript for better maintainability.
- Accessibility: keyboard navigation, ARIA for charts, better contrast & focus styles.

How to use
- Open index.html in a modern browser.
- Adjust number of voters/candidates/simulations and choose voter model.
- Optionally set a seed to reproduce results.
- Click "Run Simulation" and inspect summary, table, and chart.
- Export results to CSV for further analysis.

License
- Free to use and modify.
