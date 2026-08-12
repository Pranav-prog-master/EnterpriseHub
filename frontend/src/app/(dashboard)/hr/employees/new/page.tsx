"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { hrService } from "@/services/hrService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewEmployeePage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: hrService.createEmployee,
    onSuccess: () => { toast.success("Employee created."); router.push("/hr/employees"); },
    onError: () => toast.error("Failed to create employee."),
  });

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div className="page-header">
        <div>
          <p className="font-mono text-[10px] text-muted-fg uppercase tracking-widest mb-1">HR</p>
          <h1 className="section-title">Add Employee</h1>
        </div>
        <Link href="/hr/employees" className="btn-brutal-ghost"><ArrowLeft size={13} /> Back</Link>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="card-brutal space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-brutal">Employee ID *</label>
            <input {...register("employee_id", { required: true })} className="input-brutal" placeholder="EMP001" />
            {errors.employee_id && <p className="font-mono text-xs text-accent mt-1">Required</p>}
          </div>
          <div>
            <label className="label-brutal">Department *</label>
            <input {...register("department", { required: true })} className="input-brutal" placeholder="Engineering" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-brutal">Designation *</label>
            <input {...register("designation", { required: true })} className="input-brutal" placeholder="Software Engineer" />
          </div>
          <div>
            <label className="label-brutal">Date of Joining *</label>
            <input {...register("date_of_joining", { required: true })} type="date" className="input-brutal" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-brutal">Salary</label>
            <input {...register("salary")} type="number" className="input-brutal" placeholder="75000" />
          </div>
          <div>
            <label className="label-brutal">Status</label>
            <select {...register("status")} className="input-brutal">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={mutation.isPending} className="btn-brutal-accent">
            {mutation.isPending ? "Creating..." : "Add Employee →"}
          </button>
          <Link href="/hr/employees" className="btn-brutal-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
