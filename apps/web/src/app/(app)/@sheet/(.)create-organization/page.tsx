import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { OrganizationForm } from "../../create-organization/organization-form";

export default function CreateOrganization() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetDescription>Create Organization</SheetDescription>
        </SheetHeader>

        <OrganizationForm />
      </SheetContent>
    </Sheet>
  );
}
