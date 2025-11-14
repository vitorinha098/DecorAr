import { type Furniture, type InsertFurniture, type Project, type InsertProject } from "../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getFurniture(): Promise<Furniture[]>;
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
}


export class MemStorage implements IStorage {
  private furniture: Map<string, Furniture>;
  private projects: Map<string, Project>;

  constructor() {
    this.furniture = new Map();
    this.projects = new Map();
    this.initializeFurniture();
  }

  private initializeFurniture() {
    const initialFurniture: Furniture[] = [
      {
        id: "sofa-1",
        name: "Sofá IDANÄS",
        category: "living",
        imageUrl: "/generated_images/IDANÄS.png",
        style: "Moderno",
        price: "€899",
        brand: "DecorAR",
      },
      {
        id: "coffee-table-1",
        name: "Cama RAMNEFJÄLL",
        category: "living",
        imageUrl: "/generated_images/RAMNEFJÄLL.png",
        style: "Moderno",
        price: "€259",
        brand: "DecorAR",
      },
      {
        id: "armchair-1",
        name: "Cama TÄLLÅSEN",
        category: "living",
        imageUrl: "/generated_images/TÄLLÅSEN.png",
        style: "Contemporâneo",
        price: "€239",
        brand: "DecorAR",
      },
      {
        id: "bookshelf-1",
        name: "Cama FRIDHULT",
        category: "office",
        imageUrl: "/generated_images/269-FRIDHULT-removebg-preview.png",
        style: "Minimalista",
        price: "€329",
        brand: "DecorAR",
      },
      {
        id: "dining-table-1",
        name: "SKÖNABÄCK",
        category: "living",
        imageUrl: "/generated_images/SKÖNABÄCK_299-removebg-preview.png", 
        style: "Moderno",
        price: "€299",
        brand: "DecorAR",
      },
      {
        id: "desk-1",
        name: "FRIHETEN",
        category: "office",
        imageUrl: "/generated_images/FRIHETEN_449-removebg-preview.png",
        style: "Escandinavo",
        price: "€449",
        brand: "DecorAR",
      },
      {
        id: "lamp-1",
        name: "GRUNNARP",
        category: "decor",
        imageUrl: "/generated_images/GRUNNARP_549-removebg-preview.png",
        style: "Contemporâneo",
        price: "€549",
        brand: "DecorAR",
      },
      {
        id: "plant-1",
        name: "HEMNES",
        category: "decor",
        imageUrl: "/generated_images/HEMNES-224-removebg-preview.png",  
        style: "Natural",
        price: "€224",
        brand: "DecorAR",
      },
    ];

    initialFurniture.forEach((item) => {
      this.furniture.set(item.id, item);
    });
  }

  async getFurniture(): Promise<Furniture[]> {
    return Array.from(this.furniture.values());
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

}

export const storage = new MemStorage();
