import { Project, ProjectStatus } from "../models/project.js"

// Project state Management
type Listner<T> = (items: T[]) => void;

class State<T> {
	protected listeners: Listner<T>[] = [];

	addListner(listnerFn: Listner<T>){
		this.listeners.push(listnerFn);
	}
}

//singleton class which having only one instance of it
export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
		super();
	}

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus){
    const project = this.projects.find(prj => prj.id === projectId);
    if(project && project.status !== newStatus){
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners(){
    for (const listnerFn of this.listeners) {
      listnerFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();