import { type Furniture, type InsertFurniture, type Project, type InsertProject } from "@shared/schema";
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
        name: "Sofá Moderno Cinzento",
        category: "living",
        imageUrl: "/attached_assets/generated_images/Modern_gray_sofa_furniture_ba24cb6a.png",
        style: "Moderno",
        price: "€899",
        brand: "DecorAR",
      },
      {
        id: "coffee-table-1",
        name: "Mesa de Centro Madeira",
        category: "living",
        imageUrl: "/attached_assets/generated_images/Wooden_coffee_table_furniture_db5c91e8.png",
        style: "Escandinavo",
        price: "€249",
        brand: "DecorAR",
      },
      {
        id: "armchair-1",
        name: "Poltrona Confortável",
        category: "living",
        imageUrl: "/attached_assets/generated_images/Beige_armchair_furniture_3fe1efe7.png",
        style: "Contemporâneo",
        price: "€449",
        brand: "DecorAR",
      },
      {
        id: "bookshelf-1",
        name: "Estante Branca",
        category: "office",
        imageUrl: "/attached_assets/generated_images/White_bookshelf_furniture_00172115.png",
        style: "Minimalista",
        price: "€329",
        brand: "DecorAR",
      },
      {
        id: "dining-table-1",
        name: "Mesa de Jantar Redonda",
        category: "living",
        imageUrl: "/attached_assets/generated_images/Round_dining_table_furniture_2fc15cdc.png",
        style: "Moderno",
        price: "€599",
        brand: "DecorAR",
      },
      {
        id: "desk-1",
        name: "Secretária Madeira",
        category: "office",
        imageUrl: "/attached_assets/generated_images/Wooden_desk_furniture_90fcd8ba.png",
        style: "Escandinavo",
        price: "€399",
        brand: "DecorAR",
      },
      {
        id: "lamp-1",
        name: "Candeeiro de Chão",
        category: "decor",
        imageUrl: "/attached_assets/generated_images/Modern_floor_lamp_e66ff688.png",
        style: "Contemporâneo",
        price: "€179",
        brand: "DecorAR",
      },
      {
        id: "plant-1",
        name: "Planta Decorativa",
        category: "decor",
        imageUrl: "/attached_assets/generated_images/Decorative_plant_pot_3efd1a1f.png",
        style: "Natural",
        price: "€89",
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
