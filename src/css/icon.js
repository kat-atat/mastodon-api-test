export default `
.icon {
  display: inline-block;
  min-width: 8px;
  min-height: 8px;
  vertical-align: baseline;
}

.icon--reply::before {
  content: "↩️";
}

.icon--reblog::before {
  content: "🔁";
}

.icon--favourite::before {
  content: "⭐︎";
}

.icon--show-sensitive::before {
  content: "👁‍🗨";
}


.icon {
  font-family: var(--icon-font-family, serif);
}
`;