export default `
.client {
  padding: 1em;
}

.client__timeline {
  max-height: 100vh;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}


:not(.client--show-timeline)>.client__timeline {
  display: none;
}

:not(.client--show-account)>.client__account {
  display: none;
}
`;