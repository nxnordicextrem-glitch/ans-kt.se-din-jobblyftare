import { useState } from "react";
import { CVData, CVExperience, CVEducation, CVSkill, CVLanguage } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  data: CVData;
  onChange: (data: CVData) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const SortableRow = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}
      className="rounded-xl border border-border bg-card"
    >
      <div className="flex items-start gap-2 p-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="Dra för att ändra ordning"
          type="button"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export const CVEditorForm = ({ data, onChange }: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const updatePersonal = (k: keyof CVData["personal"], v: string) =>
    onChange({ ...data, personal: { ...data.personal, [k]: v } });

  /* --- Experience --- */
  const addExp = () =>
    onChange({
      ...data,
      experience: [
        ...data.experience,
        { id: uid(), role: "", company: "", location: "", startDate: "", endDate: "", current: false, bullets: [""] },
      ],
    });
  const updExp = (id: string, patch: Partial<CVExperience>) =>
    onChange({ ...data, experience: data.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const delExp = (id: string) => onChange({ ...data, experience: data.experience.filter((e) => e.id !== id) });
  const reorderExp = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldIdx = data.experience.findIndex((x) => x.id === active.id);
      const newIdx = data.experience.findIndex((x) => x.id === over.id);
      onChange({ ...data, experience: arrayMove(data.experience, oldIdx, newIdx) });
    }
  };

  /* --- Education --- */
  const addEdu = () =>
    onChange({
      ...data,
      education: [
        ...data.education,
        { id: uid(), degree: "", school: "", location: "", startDate: "", endDate: "", description: "" },
      ],
    });
  const updEdu = (id: string, patch: Partial<CVEducation>) =>
    onChange({ ...data, education: data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const delEdu = (id: string) => onChange({ ...data, education: data.education.filter((e) => e.id !== id) });
  const reorderEdu = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const o = data.education.findIndex((x) => x.id === active.id);
      const n = data.education.findIndex((x) => x.id === over.id);
      onChange({ ...data, education: arrayMove(data.education, o, n) });
    }
  };

  /* --- Skills --- */
  const addSkill = () => onChange({ ...data, skills: [...data.skills, { id: uid(), name: "", level: 3 }] });
  const updSkill = (id: string, patch: Partial<CVSkill>) =>
    onChange({ ...data, skills: data.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const delSkill = (id: string) => onChange({ ...data, skills: data.skills.filter((s) => s.id !== id) });
  const reorderSkill = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const o = data.skills.findIndex((x) => x.id === active.id);
      const n = data.skills.findIndex((x) => x.id === over.id);
      onChange({ ...data, skills: arrayMove(data.skills, o, n) });
    }
  };

  /* --- Languages --- */
  const addLang = () => onChange({ ...data, languages: [...data.languages, { id: uid(), name: "", level: "Flytande" }] });
  const updLang = (id: string, patch: Partial<CVLanguage>) =>
    onChange({ ...data, languages: data.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  const delLang = (id: string) => onChange({ ...data, languages: data.languages.filter((l) => l.id !== id) });

  return (
    <Accordion type="multiple" defaultValue={["personal", "experience"]} className="space-y-3">
      {/* Personal */}
      <AccordionItem value="personal" className="rounded-xl border border-border bg-card px-4">
        <AccordionTrigger className="font-display text-base">Personlig info</AccordionTrigger>
        <AccordionContent className="space-y-3 pb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Fullständigt namn</Label><Input value={data.personal.fullName} onChange={(e) => updatePersonal("fullName", e.target.value)} /></div>
            <div><Label>Yrkestitel</Label><Input value={data.personal.title} onChange={(e) => updatePersonal("title", e.target.value)} /></div>
            <div><Label>E-post</Label><Input type="email" value={data.personal.email} onChange={(e) => updatePersonal("email", e.target.value)} /></div>
            <div><Label>Telefon</Label><Input value={data.personal.phone} onChange={(e) => updatePersonal("phone", e.target.value)} /></div>
            <div><Label>Ort</Label><Input value={data.personal.location} onChange={(e) => updatePersonal("location", e.target.value)} /></div>
            <div><Label>Webbplats</Label><Input value={data.personal.website || ""} onChange={(e) => updatePersonal("website", e.target.value)} /></div>
            <div className="sm:col-span-2"><Label>LinkedIn</Label><Input value={data.personal.linkedin || ""} onChange={(e) => updatePersonal("linkedin", e.target.value)} /></div>
          </div>
          <div>
            <Label>Profil / Sammanfattning</Label>
            <Textarea rows={4} value={data.personal.summary} onChange={(e) => updatePersonal("summary", e.target.value)} placeholder="2–3 meningar om dig själv, dina styrkor och vad du söker." />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Experience */}
      <AccordionItem value="experience" className="rounded-xl border border-border bg-card px-4">
        <AccordionTrigger className="font-display text-base">Arbetslivserfarenhet</AccordionTrigger>
        <AccordionContent className="space-y-3 pb-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={reorderExp}>
            <SortableContext items={data.experience.map((e) => e.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {data.experience.map((e) => (
                  <SortableRow key={e.id} id={e.id}>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input placeholder="Roll" value={e.role} onChange={(ev) => updExp(e.id, { role: ev.target.value })} />
                      <Input placeholder="Företag" value={e.company} onChange={(ev) => updExp(e.id, { company: ev.target.value })} />
                      <Input placeholder="Ort" value={e.location || ""} onChange={(ev) => updExp(e.id, { location: ev.target.value })} />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Startdatum" value={e.startDate} onChange={(ev) => updExp(e.id, { startDate: ev.target.value })} />
                        <Input placeholder="Slutdatum" value={e.endDate} disabled={e.current} onChange={(ev) => updExp(e.id, { endDate: ev.target.value })} />
                      </div>
                    </div>
                    <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Checkbox checked={!!e.current} onCheckedChange={(v) => updExp(e.id, { current: !!v, endDate: v ? "" : e.endDate })} />
                      Pågår fortfarande
                    </label>
                    <div className="mt-3">
                      <Label className="text-xs">Punkter (en per rad)</Label>
                      <Textarea
                        rows={3}
                        value={e.bullets.join("\n")}
                        onChange={(ev) => updExp(e.id, { bullets: ev.target.value.split("\n") })}
                        placeholder="Beskriv ett resultat eller ansvarsområde…"
                      />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button variant="ghost" size="sm" onClick={() => delExp(e.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" /> Ta bort
                      </Button>
                    </div>
                  </SortableRow>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <Button variant="outline" size="sm" onClick={addExp}><Plus className="h-4 w-4" /> Lägg till erfarenhet</Button>
        </AccordionContent>
      </AccordionItem>

      {/* Education */}
      <AccordionItem value="education" className="rounded-xl border border-border bg-card px-4">
        <AccordionTrigger className="font-display text-base">Utbildning</AccordionTrigger>
        <AccordionContent className="space-y-3 pb-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={reorderEdu}>
            <SortableContext items={data.education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {data.education.map((e) => (
                  <SortableRow key={e.id} id={e.id}>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input placeholder="Examen / Program" value={e.degree} onChange={(ev) => updEdu(e.id, { degree: ev.target.value })} />
                      <Input placeholder="Skola / Universitet" value={e.school} onChange={(ev) => updEdu(e.id, { school: ev.target.value })} />
                      <Input placeholder="Ort" value={e.location || ""} onChange={(ev) => updEdu(e.id, { location: ev.target.value })} />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Från" value={e.startDate} onChange={(ev) => updEdu(e.id, { startDate: ev.target.value })} />
                        <Input placeholder="Till" value={e.endDate} onChange={(ev) => updEdu(e.id, { endDate: ev.target.value })} />
                      </div>
                    </div>
                    <Textarea className="mt-2" rows={2} placeholder="Beskrivning (valfritt)" value={e.description || ""} onChange={(ev) => updEdu(e.id, { description: ev.target.value })} />
                    <div className="mt-2 flex justify-end">
                      <Button variant="ghost" size="sm" onClick={() => delEdu(e.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" /> Ta bort
                      </Button>
                    </div>
                  </SortableRow>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <Button variant="outline" size="sm" onClick={addEdu}><Plus className="h-4 w-4" /> Lägg till utbildning</Button>
        </AccordionContent>
      </AccordionItem>

      {/* Skills */}
      <AccordionItem value="skills" className="rounded-xl border border-border bg-card px-4">
        <AccordionTrigger className="font-display text-base">Kompetenser</AccordionTrigger>
        <AccordionContent className="space-y-3 pb-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={reorderSkill}>
            <SortableContext items={data.skills.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {data.skills.map((s) => (
                  <SortableRow key={s.id} id={s.id}>
                    <div className="flex items-center gap-2">
                      <Input placeholder="T.ex. Figma" value={s.name} onChange={(e) => updSkill(s.id, { name: e.target.value })} />
                      <select
                        value={s.level || 3}
                        onChange={(e) => updSkill(s.id, { level: Number(e.target.value) })}
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}/5</option>)}
                      </select>
                      <Button variant="ghost" size="icon" onClick={() => delSkill(s.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </SortableRow>
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <Button variant="outline" size="sm" onClick={addSkill}><Plus className="h-4 w-4" /> Lägg till kompetens</Button>
        </AccordionContent>
      </AccordionItem>

      {/* Languages */}
      <AccordionItem value="languages" className="rounded-xl border border-border bg-card px-4">
        <AccordionTrigger className="font-display text-base">Språk</AccordionTrigger>
        <AccordionContent className="space-y-3 pb-4">
          <div className="space-y-2">
            {data.languages.map((l) => (
              <div key={l.id} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
                <Input placeholder="Språk" value={l.name} onChange={(e) => updLang(l.id, { name: e.target.value })} />
                <select
                  value={l.level}
                  onChange={(e) => updLang(l.id, { level: e.target.value })}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {["Modersmål", "Flytande", "Konversation", "Grundläggande"].map((x) => <option key={x}>{x}</option>)}
                </select>
                <Button variant="ghost" size="icon" onClick={() => delLang(l.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={addLang}><Plus className="h-4 w-4" /> Lägg till språk</Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
