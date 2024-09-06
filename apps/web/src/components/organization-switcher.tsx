import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";

export function OrganizationSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <span className="text-muted-foreground">Select Organization</span>
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        className="w-[200px]"
        sideOffset={12}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuItem>
            <Avatar className="size-5 mr-2">
              <AvatarImage src="https://github.com/tanottauro.png" />
            </Avatar>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
