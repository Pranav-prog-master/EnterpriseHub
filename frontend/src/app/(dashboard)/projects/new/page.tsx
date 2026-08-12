"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { projectService } from "@/services/projectService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: projectService.create,
    onSuccess: (data: any) => {
      toast.success("Project created.");
      router.push(`/projects/${data.id}`);
    },
    onError: () => toast.error("Failed to create project."),
  });

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">Projects</p>
          <h1 className="section-title">New Project</h1>
        </div>
        <Link href="/projects" className="btn-brutal-ghost"><ArrowLeft size={13} /> Back</Link>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="card-brutal space-y-4">
        <div>
          <label className="label-brutal">Project Name *</label>
          <input {...register("name", { required: true })} className="input-brutal" placeholder="e.g. Platform Redesign" />
          {errors.name && <p className="font-mono text-xs text-accent mt-1">Required</p>}
        </div>
        <div>
          <label className="label-brutal">Description</label>
          <textarea {...register("description")} rows={3} className="textarea-brutal" placeholder="What is this project about?" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-brutal">Status</label>
            <select {...register("status")} className="input-brutal">
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="label-brutal">Priority</label>
            <select {...register("priority")} className="input-brutal">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-brutal">Start Date</label>
            <input {...register("start_date")} type="date" className="input-brutal" />
          </div>
          <div>
            <label className="label-brutal">End Date</label>
            <input {...register("end_date")} type="date" className="input-brutal" />
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={mutation.isPending} className="btn-brutal-accent">
            {mutation.isPending ? "Creating..." : "Create Project →"}
          </button>
          <Link href="/projects" className="btn-brutal-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
