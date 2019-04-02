export default `
/**
 * static section
 */
.client {
}

.client__timeline {
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.client__actions {
  display: grid;
  grid-auto-flow: column;
  gap: 0 2mm;
}

:not(.client--show-timeline)>.client__timeline {
  display: none;
}

:not(.client--show-account)>.client__account {
  display: none;
}


/**
 * optional section
 */
.client {
  padding: 1em;
}

.client {
  background-color: rgb(199, 101, 63);
  color: rgb(223, 218, 217);
}


/**
 * configable section
 */
.client {
  font-size: var(--client-font-size , calc(6px + 0.6vw));
  font-family: var(--client-font-family, monospace);
}

.client .actions>.actions__home-timeline::before {
  content: var(--actions__home-timeline__before-content, "Home");
}

.client .actions>.actions__local-timeline::before {
  content: var(--actions__local-timeline__before-content, "Local");
}

.client .actions>.actions__federated-timeline::before {
  content: var(--actions__federated-timeline__before-content, "Federated");
}

.client .actions>.actions__local-media-timeline::before {
  content: var(--actions__local-media-timeline__before-content, "Local(media)");
}

.client .actions>.actions__federated-media-timeline::before {
  content: var(--actions__federated-media-timeline__before-content, "Federated(media)");
}

.client .actions>.actions__scroll-top::before {
  content: var(--actions__scroll-top__before-content, "ScrollTop");
}

.client .actions>.actions__account::before {
  content: var(--actions__account__before-content, "Account");
}

.client .actions>.actions__clear::before {
  content: var(--actions__clear__before-content, "Clear");
}
`;