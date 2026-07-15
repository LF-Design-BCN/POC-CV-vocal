import type { CVData } from "@/lib/schema";
import { getTemplateMeta } from "@/lib/templates";
import ClassiqueLayout from "./cv-templates/ClassiqueLayout";
import SidebarLayout from "./cv-templates/SidebarLayout";
import BandeauLayout from "./cv-templates/BandeauLayout";
import TimelineLayout from "./cv-templates/TimelineLayout";

export default function CVTemplate({
  data,
  templateId,
}: {
  data: CVData;
  templateId?: string | null;
}) {
  const meta = getTemplateMeta(templateId);

  switch (meta.layout) {
    case "sidebar-gauche":
    case "sidebar-droite":
      return <SidebarLayout data={data} meta={meta} />;
    case "bandeau":
      return <BandeauLayout data={data} meta={meta} />;
    case "timeline":
      return <TimelineLayout data={data} meta={meta} />;
    default:
      return <ClassiqueLayout data={data} meta={meta} />;
  }
}
