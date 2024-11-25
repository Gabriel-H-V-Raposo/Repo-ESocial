import { Header } from "@/components/header";
import { ProjectForm } from "./project-form";

export default function CreateProjects() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Create Projects</h1>

          <ProjectForm />
        </div>
      </main>
    </div>
  );
}
