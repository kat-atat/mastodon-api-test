export default `
.toggle {
  min-width: 14mm;
  min-height: 7mm;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
}

.toggle--checked { border-style: inset; }
.toggle--unchecked { border-style: outset; }


.toggle {
  background: var(--toggle-background);
  color: var(--toggle-color);
  border-color: var(--toggle-border-color);
}
`;