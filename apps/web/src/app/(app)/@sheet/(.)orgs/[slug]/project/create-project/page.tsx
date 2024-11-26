import { Header } from "@/components/header";
import { ability } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ProjectForm } from "@/app/(app)/orgs/[slug]/project/create-project/project-form";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { InterceptedSheet } from "@/components/intercepted-sheet-content";

export default async function CreateProjects() {
  const permissions = await ability();

  if (permissions?.cannot("create", "Project")) {
    redirect("/");
  }

  return (
    <Sheet defaultOpen>
      <InterceptedSheet>
        <SheetHeader>
          <SheetTitle>Create Projects</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <ProjectForm />
        </div>
      </InterceptedSheet>
    </Sheet>
  );
}
