import { Component } from "./base-component.js";
import { Validatable, validate } from "../util/validation.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";

//projectInput class
export class ProjectInput extends Component<HTMLDListElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  modalElement = document.querySelector("#exampleModal") as HTMLElement;
  modalMsg =  document.querySelector(".modal-msg") as HTMLElement; 

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | undefined {
    const enterdTitle = this.titleInputElement.value;
    const enterdDescription = this.descriptionInputElement.value;
    const enterdPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enterdTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enterdDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enterdPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if(!validate(titleValidatable)){
      this.showModal("Please provide a title");
    }
    else if(!validate(descriptionValidatable)){
      this.showModal("Descriptions must contain at least five letters");
    }
    else if(!validate(peopleValidatable)){
      this.showModal("The number of people should range from 1 to 5");
    }
    else {
      return [enterdTitle, enterdDescription, +enterdPeople];
    }
  }

  private showModal(msg:string){
    this.modalMsg.textContent="";
    this.modalMsg.textContent=msg;
    $(this.modalElement).modal();
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

}
