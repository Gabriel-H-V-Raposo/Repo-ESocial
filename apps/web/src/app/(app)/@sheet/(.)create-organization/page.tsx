import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";

import { InterceptedSheet } from "@/components/intercepted-sheet-content";
import { OrganizationForm } from "../../orgs/organization-form";

export default function CreateOrganization() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheet>
        <SheetHeader>
          <SheetDescription>Create Organization</SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <OrganizationForm />
        </div>
      </InterceptedSheet>
    </Sheet>
  );
}
