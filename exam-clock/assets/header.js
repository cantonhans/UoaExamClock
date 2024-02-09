const headerTemplate = document.createElement("template");

headerTemplate.innerHTML = `
<style>
  .header {
    display: block;
  }

  .header-bar {
    background-color: #f2f2f2;
    height: 105px;
    width: 100%;
  }

  .logo-container {
    position: relative;
    bottom: 50px;
    display: flex;
    justify-content: center;
  }

  .logo {
    max-width: 170px;
    max-height: 170px;
  }
</style>

<div class="header">
  <div class="header-bar"></div>
  <div class="logo-container">
    <img
      class="logo"
      src="../assets/uoa-logo.svg"
      alt="The University of Auckland logo"
    />
  </div>
</div>
`;

class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "closed" });

    shadowRoot.appendChild(headerTemplate.content);
  }
}

customElements.define("uoa-header", Header);
