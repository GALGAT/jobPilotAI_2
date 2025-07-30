import {
  users,
  userProfiles,
  jobs,
  applications,
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Job,
  type InsertJob,
  type Application,
  type InsertApplication,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Legacy user operations (for backward compatibility)
  getUserByUsername?(username: string): Promise<User | undefined>;
  getUserByEmail?(email: string): Promise<User | undefined>;
  createUser?(user: any): Promise<User>;

  // User Profile methods
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;

  // Job methods
  getJobs(filters?: { 
    location?: string; 
    skills?: string[]; 
    minSalary?: number; 
    maxSalary?: number;
    isRemote?: boolean;
  }): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;

  // Application methods
  getApplications(userId: string): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, application: Partial<InsertApplication>): Promise<Application | undefined>;
  getApplicationByUserAndJob(userId: string, jobId: string): Promise<Application | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Legacy methods for backward compatibility
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: any): Promise<User> {
    // For legacy support during development
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email || `temp_${Date.now()}@example.com`,
        firstName: userData.username || "Temp User",
      })
      .returning();
    return user;
  }

  // User Profile methods
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db
      .insert(userProfiles)
      .values({ ...profile, userId })
      .returning();
    return newProfile;
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // Job methods
  async getJobs(filters?: { 
    location?: string; 
    skills?: string[]; 
    minSalary?: number; 
    maxSalary?: number;
    isRemote?: boolean;
  }): Promise<Job[]> {
    // For now, return all jobs - we can add filtering later
    const allJobs = await db.select().from(jobs);
    return allJobs;
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  // Application methods
  async getApplications(userId: string): Promise<Application[]> {
    const userApplications = await db.select().from(applications).where(eq(applications.userId, userId));
    return userApplications;
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db.insert(applications).values(application).returning();
    return newApplication;
  }

  async updateApplication(id: string, application: Partial<InsertApplication>): Promise<Application | undefined> {
    const [updatedApplication] = await db
      .update(applications)
      .set({ ...application, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }

  async getApplicationByUserAndJob(userId: string, jobId: string): Promise<Application | undefined> {
    const [application] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.userId, userId), eq(applications.jobId, jobId)));
    return application;
  }
}