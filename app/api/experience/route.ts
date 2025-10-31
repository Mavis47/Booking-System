import { CreateNewExperience, getAllExperiences } from "@/app/controllers/experienceController";

export async function GET() {
  return await getAllExperiences();
}

export async function POST(req: Request) {
  return await CreateNewExperience(req);
}