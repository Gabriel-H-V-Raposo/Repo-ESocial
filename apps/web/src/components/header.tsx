import Image from "next/image";
import googleIcon from "@/assets/google-icon.svg";
import { ProfileButton } from "./profile-button";
import { Slash } from "lucide-react";
import { OrganizationSwitcher } from "./organization-switcher";

export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image src={googleIcon} className="size-6" alt="Google Icon" />

        <Slash className="size-4 -rotate-[24deg] text-border" />

        <OrganizationSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  );
}
