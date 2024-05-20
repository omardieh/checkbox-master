export default class OptionsScreen {
  constructor(root) {
    this.root = root;
    this.checkButton = this.createElement({
      type: "button",
      textContent: "Check All",
    });
    this.uncheckButton = this.createElement({
      type: "button",
      textContent: "Uncheck All",
    });
    this.counter = this.createElement({
      type: "span",
      className: "counter",
      textContent: "Selected 0",
    });
    this.updateCountText = this.updateCountText.bind(this);
    this.render();
  }

  render() {
    const optionsScreen = this.createElement({
      type: "div",
      className: "options-screen",
    });

    const headerTitle = this.createElement({
      type: "h2",
      textContent: document.title,
    });
    const featuresText = [
      "Check All / Uncheck All Buttons",
      "Real-Time Count Updates",
      "Easy-to-Use Interface",
      "Supports Iframe HTML",
    ];
    const featuresItems = featuresText.map((text) =>
      this.createElement({ type: "li", textContent: text })
    );
    const featuresList = this.createElement({
      type: "ul",
      className: "features-list",
    });
    featuresList.append(...featuresItems);
    const buttonContainer = this.createElement({
      type: "div",
      className: "button-container",
    });
    buttonContainer.append(this.checkButton, this.uncheckButton);

    const counterContainer = this.createElement({
      type: "div",
      className: "counter-container",
    });
    counterContainer.appendChild(this.counter);

    const footerTitle = this.createElement({
      type: "p",
      className: "footer",
      innerHTML: `Powered by <a href="https://github.com/omardieh" target="_blank"> Omar Dieh </a>`,
    });

    optionsScreen.append(
      headerTitle,
      featuresList,
      buttonContainer,
      counterContainer,
      footerTitle
    );

    this.root.appendChild(optionsScreen);
  }

  createElement({ type, className, textContent, innerHTML, styles }) {
    const element = document.createElement(type);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    if (innerHTML) element.innerHTML = innerHTML;
    if (styles) Object.assign(element.style, styles);
    return element;
  }

  updateCountText(count) {
    this.counter.textContent = "Selected " + count;
  }
}
