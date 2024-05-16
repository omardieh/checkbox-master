export default class OptionsScreen {
  constructor(root, checkButton, uncheckButton, counter) {
    this.root = root;
    this.checkButton = checkButton;
    this.uncheckButton = uncheckButton;
    this.counter = counter;
    this.render();
  }

  render() {
    const optionsScreen = document.createElement("div");
    optionsScreen.classList.add("options-screen");

    const headerTitle = document.createElement("h2");
    headerTitle.innerText = document.title;
    optionsScreen.appendChild(headerTitle);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.appendChild(this.checkButton);
    buttonContainer.appendChild(this.uncheckButton);
    optionsScreen.appendChild(buttonContainer);

    const counterContainer = document.createElement("div");
    counterContainer.classList.add("counter-container");
    counterContainer.appendChild(this.counter);
    optionsScreen.appendChild(counterContainer);

    const footerTitle = document.createElement("p");
    footerTitle.innerText = "Powered by Omar Dieh";
    footerTitle.classList.add("footer");
    optionsScreen.appendChild(footerTitle);

    this.root.appendChild(optionsScreen);
  }
}
