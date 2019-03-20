export default `
.account {
  display: grid;
  grid-template:
  "a b b"
  "c c c";
}

.account>.account__avatar {
  grid-area: a;
  width: 8em;
}
`;