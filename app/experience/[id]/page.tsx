import ExperienceDetails from "../../components/ExperienceDetails";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  return <ExperienceDetails id={id} />;
}