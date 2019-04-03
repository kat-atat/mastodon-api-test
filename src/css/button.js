export default `
.button {
  min-width: 14mm;
  min-height: 7mm;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-radius: 4px;
  border-style: outset;
}

.button:active { border-style: inset; }


.button {
  background: var(--button-background);
  color: var(--button-color);
  border-color: var(--button-border-color);
}
`;