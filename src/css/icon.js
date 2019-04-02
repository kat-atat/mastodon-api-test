export default `
.icon {
  vertical-align: middle;
}

.icon--reply::before { content: var(--icon--reply__before-content, "↩️"); }
.icon--reblog::before { content: var(--icon--reblog__before-content, "🔁"); }
.icon--favourite::before { content: var(--icon--favourite__before-content, "⭐️"); }
.icon--show-sensitive::before { content: var(--icon--show-sensitive__before-content, "👁"); }
`;