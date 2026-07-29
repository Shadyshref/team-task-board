import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/types/api";

type ProjectCardProps = {
  project: Project;
  currentUserId: string;
};

export function ProjectCard({
  project,
  currentUserId,
}: ProjectCardProps) {
  const isOwner = project.ownerId === currentUserId;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{project.name}</CardTitle>
          <Badge variant={isOwner ? "default" : "secondary"}>
            {isOwner ? "Owner" : "Member"}
          </Badge>
        </div>

        <CardDescription>
          {project.description ?? "No description provided."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Owner</dt>
            <dd className="font-medium">{project.owner.name}</dd>
          </div>

          <div>
            <dt className="text-muted-foreground">Members</dt>
            <dd className="font-medium">{project._count.member}</dd>
          </div>

          <div>
            <dt className="text-muted-foreground">Open tasks</dt>
            <dd className="font-medium">{project._count.task}</dd>
          </div>
        </dl>

        <Button asChild variant="outline" className="w-full">
          <Link href={`/projects/${project.id}`}>View details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}